# First Stage: Build the application and include all necessary dependencies for Puppeteer
FROM --platform=linux/amd64 node:20.11.0 AS builder
WORKDIR /app

# Copy package.json and lock file from the correct directory
COPY iam/package.json iam/package-lock.json* ./
RUN npm install

# Copy Prisma schema and generate Prisma client
COPY iam/prisma ./prisma/
RUN npx prisma generate


# Copy the rest of the application files
COPY iam ./

# Build the application
RUN npm run build

# Second Stage: Setup the runtime environment with only the necessary files and binaries
FROM --platform=linux/amd64 node:20.11.0
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
