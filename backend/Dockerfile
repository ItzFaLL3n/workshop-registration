FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=build /app/dist ./dist

EXPOSE 4000

# Applies any pending migrations before starting — safe to run on every
# boot since `prisma migrate deploy` is a no-op when the schema is current.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
