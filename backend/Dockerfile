# Use official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Build arguments
ARG VERSION
ENV VERSION=$VERSION

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy Prisma schema first
COPY prisma ./prisma/

# Generate Prisma Client
RUN bunx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/').then(() => process.exit(0)).catch(() => process.exit(1))"

# Start script that runs migrations and starts server
CMD ["sh", "-c", "bunx prisma db push && bun run start"]
