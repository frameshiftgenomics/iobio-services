FROM node:14-bullseye-slim as builder

# Source code is in /app
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy code
COPY . .

# Set environment variables
ENV NODE_ENV="production"

# Build client bundle
RUN npm run build

# Serve client bundle with nginx
FROM nginx

# Copy nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy index.html & favicon for nginx root directive
COPY ./server/views /usr/share/nginx/html

# Copy remaining static assets
COPY ./client/data /usr/share/nginx/html/data
COPY ./client/assets /usr/share/nginx/html/assets
COPY ./client/js/thirdparty /usr/share/nginx/html/js/thirdparty
COPY ./client/app/third-party /usr/share/nginx/html/app/third-party

# Copy client bundle from builder container
COPY --from=builder /app/client/dist /usr/share/nginx/html/dist

# Run nginx on port 80
EXPOSE 80
