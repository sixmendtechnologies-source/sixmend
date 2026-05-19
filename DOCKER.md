# Docker Setup for Sixmend

This project has been dockerized for easy deployment and development.

## Files Created

- **Dockerfile** - Multi-stage build optimized for Next.js (builder + runtime)
- **.dockerignore** - Excludes unnecessary files from the Docker image
- **docker-compose.yml** - Docker Compose configuration for easy orchestration

## Building and Running

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the container
docker-compose down
```

The app will be available at `http://localhost:3000`

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t sixmend:latest .

# Run the container
docker run -p 3000:3000 sixmend:latest

# Run in detached mode
docker run -d -p 3000:3000 --name sixmend-app sixmend:latest
```

## Development

For development with hot reload, keep using the local setup:

```bash
npm install
npm run dev
```

Or use the Docker image with volume mounting:

```bash
docker run -p 3000:3000 -v $(pwd):/app -e NODE_ENV=development sixmend:latest npm run dev
```

## Features

- **Multi-stage build** - Reduces final image size by separating build and runtime
- **Alpine base** - Uses lightweight Alpine Linux images
- **Non-root user** - Runs as unprivileged `nextjs` user for security
- **Proper signal handling** - Uses dumb-init for graceful shutdown
- **Production optimized** - Includes only production dependencies in runtime image

## Image Size

Multi-stage build keeps the final image lean:
- Builder stage: ~1.5GB (includes build tools)
- Runtime stage: ~200-300MB (production only)

## Environment Variables

Customize the container behavior:

```bash
# Production
NODE_ENV=production

# Custom port
docker run -p 8080:3000 sixmend:latest
```

## Troubleshooting

**Port already in use:** Change the port mapping
```bash
docker run -p 8080:3000 sixmend:latest
```

**Container exits immediately:** Check logs
```bash
docker logs sixmend-app
```

**Rebuild without cache:**
```bash
docker build --no-cache -t sixmend:latest .
```
