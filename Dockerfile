# Use a Windows-based Node.js image as a base
FROM mcr.microsoft.com/windows/servercore:ltsc2019

# Set the working directory in the container
WORKDIR C:\app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port that your app runs on
EXPOSE 8080

# Command to run your application
CMD ["node", "src\\index.js"]