# Install dependencies only when needed
FROM node:20-alpine3.18 AS dev-deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
FROM node:20-alpine3.18 AS builder
WORKDIR /usr/src/app
COPY --from=dev-deps /usr/src/app/node_modules ./node_modules
COPY src ./src
COPY package.json yarn.lock tsconfig.json tsconfig.build.json .eslintrc.js ./
RUN yarn build

FROM node:20-alpine3.18 AS prod-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

FROM node:20-alpine3.18 AS prod
WORKDIR /usr/src/app
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
CMD [ "node","dist/main" ]