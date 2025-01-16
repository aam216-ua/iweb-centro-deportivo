#!/bin/bash

# Configuration
BACKUP_DIR="iweb-portable"
IMAGES_FILE="docker-images.tar"

echo "Creating portable bundle..."

# Create backup directory
mkdir -p $BACKUP_DIR/.data

# Copy project files needed for the build
echo "Copying project files..."
mkdir -p $BACKUP_DIR/frontend $BACKUP_DIR/backend
cp -r frontend/* $BACKUP_DIR/frontend/ 2>/dev/null || echo "No frontend directory found"
cp -r backend/* $BACKUP_DIR/backend/ 2>/dev/null || echo "No backend directory found"
cp Dockerfile $BACKUP_DIR/
cp .dockerignore $BACKUP_DIR/ 2>/dev/null || echo "No .dockerignore found"

# Get the actual image names from currently running containers
echo "Identifying running containers and their images..."
POSTGRES_IMAGE=$(docker inspect iweb-postgres --format='{{.Config.Image}}' 2>/dev/null || echo "postgres:17-alpine")
PGADMIN_IMAGE=$(docker inspect iweb-pgadmin --format='{{.Config.Image}}' 2>/dev/null || echo "elestio/pgadmin:latest")
APP_IMAGE=$(docker inspect iweb-application --format='{{.Config.Image}}' 2>/dev/null)

# Build application if not already built
if [ -z "$APP_IMAGE" ]; then
    echo "Building application image..."
    docker compose build
    APP_IMAGE=$(docker inspect iweb-application --format='{{.Config.Image}}')
fi

# Save all Docker images
echo "Saving Docker images (this may take a while)..."
docker save \
  $POSTGRES_IMAGE \
  $PGADMIN_IMAGE \
  $APP_IMAGE \
  -o $BACKUP_DIR/$IMAGES_FILE

# Export database
echo "Exporting database..."
docker exec iweb-postgres pg_dump -U user database > $BACKUP_DIR/.data/dump.sql

# Copy necessary files
echo "Copying configuration files..."
cp .env $BACKUP_DIR/ 2>/dev/null || echo "No .env file found"
cp compose.yml $BACKUP_DIR/
cp -r .data/servers.json $BACKUP_DIR/.data/ 2>/dev/null || echo "No servers.json found"

# Create deploy script
cat > $BACKUP_DIR/deploy.sh << 'EOL'
#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "Docker Compose is not available. Please install Docker Compose first."
    exit 1
fi

echo "Loading Docker images (this may take a while)..."
docker load -i docker-images.tar

echo "Starting deployment..."

# Stop any existing containers and remove volumes
docker compose down -v

# Start fresh deployment
docker compose up -d postgres

# Wait for postgres to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 15

# Import the database dump
echo "Importing database..."
docker exec -i iweb-postgres psql -U user database < .data/dump.sql

# Start remaining services
echo "Starting all services..."
docker compose up -d

echo ""
echo "Deployment complete! Services should be available at:"
echo "Application: http://localhost:3000"
echo "PgAdmin: http://localhost:8080"
echo ""
echo "Default pgAdmin credentials:"
echo "Email: user@ua.es"
echo "Password: password"
EOL

# Make deploy script executable
chmod +x $BACKUP_DIR/deploy.sh

# Create readme file
cat > $BACKUP_DIR/README.md << 'EOL'
# IWeb Portable Deployment

This is a self-contained portable deployment package for the IWeb application.

## Requirements
- Docker installed on the target machine
- Docker Compose v2 or later
- At least 4GB of free disk space
- Ports 3000, 5432, and 8080 should be available

## Deployment Instructions
1. Copy this entire directory to the target machine
2. Open a terminal in this directory
3. Run: `./deploy.sh`

## Included Services
- Web Application (port 3000)
- PostgreSQL Database (port 5432)
- pgAdmin Interface (port 8080)

## Default Credentials
pgAdmin:
- Email: user@ua.es
- Password: password

## Troubleshooting
If you encounter any issues:
1. Make sure all required ports are available
2. Try running `docker compose down -v` to clean up any existing containers
3. Check the Docker logs using `docker compose logs`
4. Ensure you have sufficient disk space
5. Make sure Docker has permission to create and manage containers
EOL

# Create tar.gz of the entire bundle
echo "Creating final archive..."
tar -czf iweb-portable.tar.gz $BACKUP_DIR

# Cleanup
rm -rf $BACKUP_DIR

echo ""
echo "Bundle created successfully: iweb-portable.tar.gz"
echo "To deploy on a new machine:"
echo "1. Copy iweb-portable.tar.gz to the target machine"
echo "2. Extract: tar -xzf iweb-portable.tar.gz"
echo "3. cd iweb-portable"
echo "4. ./deploy.sh"
