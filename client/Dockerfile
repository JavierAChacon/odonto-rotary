FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM development AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
RUN npm run build

FROM base AS production-dependencies
RUN npm ci --omit=dev

FROM node:24-alpine AS staging
WORKDIR /app
ENV NODE_ENV=production
ENV APP_ENV=staging
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
COPY package.json ./
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]

FROM staging AS production
ENV APP_ENV=production
