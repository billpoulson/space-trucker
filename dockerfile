# Use the official Node.js 18 base image
# FROM ubuntu:latest
FROM ubuntu:22.04
# Set the working directory inside the container
WORKDIR /app



COPY package.json package-lock.json ./
COPY packages/ ./packages/
RUN rm -rf /node_modules

# Update the package list and install necessary tools
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Add Node.js official APT repository and install Node.js

    RUN curl -fsSL https://deb.nodesource.com/setup_22.12 | bash - && \
    apt-get update && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
# RUN apt-get update
# RUN apt-get install sqlite3
# RUN npm install sqlite3 --force
RUN npm install
# RUN yarn build:types-model
# RUN yarn build:back-end

# WORKDIR /app/packages/backend-strapi
# Expose a port for your app (replace 1337 with your desired port)
EXPOSE 80

# Start the app
CMD [ "yarn", "workspace", "@jbinvoice/backend", "strapi", "develop" ]
