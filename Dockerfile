# syntax=docker/dockerfile:1

FROM node:23-slim AS base

# Install system dependencies needed for native modules (e.g. better-sqlite3)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  git \
  && rm -rf /var/lib/apt/lists/*

# Disable telemetry
ENV ELIZAOS_TELEMETRY_DISABLED=true
ENV DO_NOT_TRACK=1

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm bun

# Copy package manifest and install dependencies
COPY package.json ./
RUN pnpm install

# Surgical patches: Force ElizaOS's OpenAI plugin to use standard Chat Completions interface & avoid 'developer' role
RUN find node_modules -path "*/@elizaos/plugin-openai/dist/*" -type f \( -name "*.js" -o -name "*.cjs" \) -exec sed -i 's/openai\.languageModel(/openai\.chat(/g' {} +
RUN find node_modules -path "*/@ai-sdk/openai/dist/*" -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.mjs" \) -exec sed -i 's/"developer"/"system"/g' {} +

# Copy all source files
COPY . .

# Build frontend dashboard
RUN cd dashboard && npm run build

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3000

ENV NODE_ENV=production
ENV SERVER_PORT=3000

CMD ["pnpm", "start"]
