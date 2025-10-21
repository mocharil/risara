# Docker Deployment Guide - Risara Demo

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

### Using Docker directly

```bash
# Build the image
docker build -t risara-demo .

# Run the container with dummy data
docker run -d \
  --name risara-demo \
  -p 3000:3000 \
  -e USE_DUMMY_DATA=true \
  -e NEXT_PUBLIC_USE_DUMMY_DATA=true \
  risara-demo

# View logs
docker logs -f risara-demo

# Stop and remove
docker stop risara-demo
docker rm risara-demo
```

## Configuration

### Environment Variables

The application supports the following environment variables:

#### Dummy Data Mode (Default in Docker)
```bash
USE_DUMMY_DATA=true
NEXT_PUBLIC_USE_DUMMY_DATA=true
```

When enabled, the application uses enhanced dummy data for:
- 3,500 news articles (25% high urgency)
- 1,500 TikTok posts (30% high urgency)
- Network analysis with 6 clusters
- Executive summaries and AI analysis
- Regional maps with accurate Jakarta boundaries

#### MongoDB Configuration (Optional)
```bash
MONGODB_URI=mongodb://username:password@host:port/database
MONGODB_DB=risara
```

Required collections:
- `news` - News articles
- `tiktok` - TikTok posts
- `insight_news` - AI-generated news insights
- `insight_tiktok` - AI-generated TikTok insights

#### Gemini AI Configuration (Optional)
```bash
GEMINI_PROJECT_ID=your-gcp-project-id
GEMINI_CREDS_PATH=/app/credentials/skilled-compass.json
```

To use real Gemini AI instead of dummy data:
1. Uncomment the volumes section in `docker-compose.yml`
2. Place your `skilled-compass.json` credentials file in the project root
3. Set `USE_DUMMY_DATA=false`

## Multi-Stage Build

The Dockerfile uses a multi-stage build process:

1. **deps** - Install production dependencies only
2. **builder** - Build the Next.js application
3. **runner** - Final lightweight image with built application

Benefits:
- Smaller image size (~150MB vs 1GB+)
- Faster deployment
- Better layer caching
- Security (no build tools in production)

## Health Check

The application includes a health check endpoint at `/api/health`

```bash
# Check application health
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-21T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

Docker automatically monitors this endpoint every 30 seconds.

## Security Features

- **Non-root user**: Application runs as `nextjs` user (UID 1001)
- **Minimal base image**: Uses Alpine Linux for smaller attack surface
- **No secrets in image**: Credentials mounted as volumes
- **Production dependencies only**: Dev dependencies excluded from final image

## Development vs Production

### Development (Local)
```bash
npm install
npm run dev
```

### Production (Docker)
```bash
docker-compose up -d
```

## Troubleshooting

### Container fails to start
```bash
# Check logs
docker-compose logs risara-app

# Common issues:
# 1. Port 3000 already in use
docker-compose down
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows

# 2. Build cache issues
docker-compose build --no-cache
```

### Image size too large
```bash
# Check image size
docker images risara-demo

# Should be ~150-200MB
# If larger, ensure .dockerignore is working:
docker build --progress=plain . 2>&1 | grep "COPY"
```

### Credentials not working
```bash
# Ensure credentials are mounted correctly
docker exec -it risara-demo ls -la /app/credentials/

# Check environment variables
docker exec -it risara-demo env | grep GEMINI
```

## Performance Optimization

The Docker setup includes several optimizations:

1. **Layer caching**: Dependencies cached separately from source code
2. **Standalone output**: Next.js builds minimal standalone server
3. **Multi-stage build**: Final image contains only runtime essentials
4. **Health checks**: Automatic container restart on failure

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t risara-demo:${{ github.sha }} .

      - name: Run health check
        run: |
          docker run -d -p 3000:3000 --name test risara-demo:${{ github.sha }}
          sleep 10
          curl -f http://localhost:3000/api/health || exit 1
          docker stop test
```

## Resource Limits

For production deployments, consider setting resource limits:

```yaml
services:
  risara-app:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Logs

View application logs:
```bash
# All logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f risara-app
```

## Backup Strategy

If using MongoDB instead of dummy data:

```bash
# Backup MongoDB
docker exec risara-mongodb mongodump --out /backup

# Restore MongoDB
docker exec risara-mongodb mongorestore /backup
```

## Support

For issues related to:
- Application features: Check main README.md
- Docker setup: This file
- Credentials: Contact GCP admin
- MongoDB: Check MongoDB documentation
