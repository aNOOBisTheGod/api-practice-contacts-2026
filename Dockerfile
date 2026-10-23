FROM node:22-bookworm-slim AS nodebase
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
FROM mongo:8.0
COPY --from=nodebase /usr/local/bin/node /usr/local/bin/node
WORKDIR /app
COPY --from=nodebase /app/node_modules ./node_modules
COPY server.cjs package.json ./
COPY public ./public
COPY start.sh ./start.sh
ENV HOST=0.0.0.0 PORT=10000 MONGODB_URI=mongodb://127.0.0.1:27028 DEMO_SEED=1 NODE_OPTIONS=--max-old-space-size=96
EXPOSE 10000
ENTRYPOINT []
CMD ["bash", "start.sh"]
