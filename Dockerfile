FROM node:20 AS nestjs-build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
ARG APP
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=nestjs-build /usr/src/app/libs ./libs
COPY --from=nestjs-build /usr/src/app/node_modules ./node_modules
COPY --from=nestjs-build /usr/src/app/dist/apps/${APP} ./dist

EXPOSE 3000 3001

CMD ["node", "dist/main"]