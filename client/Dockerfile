FROM node:current-alpine AS build

# Environment variables used by Vite are required at build time for static replacement
# Port is not forwarded because Caddy serves content in production
ARG API_BASE_URL
ENV VITE_API_BASE_URL=$API_BASE_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
COPY . .
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM caddy:latest
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
CMD caddy run --config /etc/caddy/Caddyfile