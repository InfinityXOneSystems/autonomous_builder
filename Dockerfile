FROM node:20-bookworm-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Safe defaults: dry-run
ENV DRY_RUN=true
CMD ["npm","run","prime:supervisor"]
