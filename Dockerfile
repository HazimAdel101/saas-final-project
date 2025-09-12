# ---------- Build stage ----------
    FROM node:22-alpine AS build
    WORKDIR /app
    
    # pnpm via Corepack
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Install deps (no postinstall yet)
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile --ignore-scripts
    
    # Bring in the rest of the source
    COPY . .
    
    # If you use Prisma, generate the client (safe: will no-op if no schema)
    RUN pnpm exec prisma generate || echo "No prisma schema, skipping"
    
    # Build Next.js (produces .next/standalone + .next/static)
    RUN pnpm build
    
    
    # ---------- Runtime stage ----------
    FROM node:22-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV HOSTNAME=0.0.0.0
    ENV PORT=3000
    
    # Copy the minimal server bundle + assets from build
    COPY --from=build /app/.next/standalone ./
    COPY --from=build /app/.next/static ./.next/static
    COPY --from=build /app/public ./public
    
    EXPOSE 3000
    CMD ["node", "server.js"]
    