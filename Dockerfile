FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN pnpm prisma generate

FROM node:20-alpine AS build

WORKDIR /app

COPY --from=base /app /app

RUN pnpm install --frozen-lockfile

RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app


RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=base /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=base /app/prisma ./prisma

CMD ["node", "dist/main"]
