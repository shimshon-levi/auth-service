FROM node:18

# תיקיית עבודה בתוך הקונטיינר
WORKDIR /app

# העתקת package.json והתקנת תלויות
COPY package*.json ./
RUN npm install

# העתקת כל שאר הקבצים
COPY . .

# משתנה סביבה (אם אתה משתמש בו בקוד)
ENV PORT=8000

# פתיחת הפורט
EXPOSE 8000

# הפקודה שמריצה את השרת שלך
CMD ["npm", "run", "start"]
