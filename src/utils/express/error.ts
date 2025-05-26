import axios from "axios";
import express from "express";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { ServiceError } from "../errors";
import { logger } from "../logger";

const formatAxiosErrorData = (
  axiosErrorData: object & { message?: string; metadata?: object }
) => {
  if (axiosErrorData.message?.includes("E11000"))
    return { ...axiosErrorData, errorCode: "DUPLICATE_ERROR" };

  if (axiosErrorData.metadata)
    return {
      ...axiosErrorData,
      ...axiosErrorData.metadata,
    };

  return axiosErrorData;
};

export const errorMiddleware = async (
  error: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).send({
      type: error.name,
      message: fromZodError(error).message,
    });
  } else if (error instanceof ServiceError) {
    res.status(error.code).send({
      type: error.name,
      message: error.message,
      metadata: error.metadata,
    });
  } else if (["TokenExpiredError", "JsonWebTokenError"].includes(error.name)) {
    res.status(401).send({
      type: error.name,
      message: error.message,
    });
  } else if (axios.isAxiosError(error) && error.response?.status) {
    const errorCommunicationData = {
      status: error.response.status,
      statusText: error.response.statusText,
      baseUrl: error.config?.baseURL,
    };

    logger.error("Request failed with error: ", errorCommunicationData);

    const metadata = formatAxiosErrorData(error.response.data);

    logger.error("Error metadata: ", metadata);

    res.status(error.response?.status).send({
      type: error.name,
      message: metadata ? metadata.message : error.message,
      metadata,
    });
  } else {
    res.status(500).send({
      type: "InternalServerError",
      message: error.message ?? "internal server error",
    });

    logger.error("Request failed with error: ", error);
  }

  next();
};
