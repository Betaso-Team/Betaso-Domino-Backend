FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm ci
COPY . .
ENV NODE_ENV=development
EXPOSE 2569
CMD ["npm", "run", "dev"]

FROM development AS builder
RUN npm run build

FROM base AS production
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build
ENV NODE_ENV=production
EXPOSE 2569
CMD ["npm", "start"]
