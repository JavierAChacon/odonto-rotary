FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM development AS build
RUN npm run build

FROM base AS production-dependencies
RUN npm ci --omit=dev

FROM node:24-alpine AS staging
WORKDIR /app
ENV NODE_ENV=production
ENV APP_ENV=staging
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

FROM staging AS production
ENV APP_ENV=production
