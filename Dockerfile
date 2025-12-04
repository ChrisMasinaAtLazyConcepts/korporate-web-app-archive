# Build stage

FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 80

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:80"]
