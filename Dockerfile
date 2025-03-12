# Use the official Node.js image as a base
FROM node:20

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxi6 \
    libxtst6 \
    libnss3-tools \
    fonts-liberation \
    libappindicator3-1 \
    libu2f-udev \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port that your app runs on
EXPOSE 8080

# Command to run your application
CMD ["node", "src/index.js"]