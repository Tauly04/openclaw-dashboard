# Dockerfile for OpenClaw Dashboard
FROM python:3.11-slim

WORKDIR /app

# Install Node.js for building frontend
RUN apt-get update && apt-get install -y nodejs npm curl && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend package files
COPY frontend/package*.json frontend/
RUN cd frontend && npm install

# Copy all files
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Expose port
EXPOSE 18790

# Start command
CMD ["python", "server.py"]
