FROM node:current-alpine AS build

# Environment variables used by Vite are required at build time for
ARG API_BASE_URL
ENV VITE_API_BASE_URL=$API_BASE_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app
WORKDIR /app

RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM caddy:latest AS production
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
