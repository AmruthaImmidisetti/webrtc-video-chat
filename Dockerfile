# Use Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build Next.js app
RUN npm run build

# Expose ports
EXPOSE 3000
EXPOSE 3001

# Start both frontend and socket server
CMD ["sh", "-c", "npm run socket & npm run start"]