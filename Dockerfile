# שלב 1: בuilder
FROM node:18-alpine AS builder
WORKDIR /app

# העתק והתקן תלויות
COPY package.json package-lock.json ./
RUN npm ci

# העתק שאר הקוד וה-env
COPY . .
COPY .env.local .env.local

# הרץ build
RUN npm run build

# שלב 2: שרת הפרודקשן
FROM node:18-alpine AS runner
WORKDIR /app

# העתק רק את התוצרים מה-build
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
