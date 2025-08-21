FROM node:16-bullseye

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y \
	libcairo2-dev \
	libjpeg-dev \
	libpango1.0-dev \
	libgif-dev \
	librsvg2-dev \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
