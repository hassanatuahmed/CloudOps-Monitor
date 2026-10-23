FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY src/ ./src/
USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
