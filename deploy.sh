#!/bin/bash

# Configuration
DOCKER_USERNAME="afoi"
IMAGE_NAME="frontend-app"
DEPLOYMENT_FILE="deployment.yaml"

echo "================================================"
echo "   Docker Build & Deploy Automation Script"
echo "================================================"
echo ""

# Extract the current tag from deployment file
CURRENT_TAG=$(grep -oP "image: ${DOCKER_USERNAME}/${IMAGE_NAME}:\K[^\s]+" "$DEPLOYMENT_FILE" | head -1)

if [ -z "$CURRENT_TAG" ]; then
    echo "❌ Error: Could not find image tag in $DEPLOYMENT_FILE"
    exit 1
fi

echo "📦 Current deployment tag: $CURRENT_TAG"
echo ""

# Step 1: Build the Docker image
echo "🔨 Step 1: Building Docker image..."
docker build -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${CURRENT_TAG}" .

if [ $? -ne 0 ]; then
    echo "❌ Error: Docker build failed"
    exit 1
fi

echo "✅ Image built successfully: ${DOCKER_USERNAME}/${IMAGE_NAME}:${CURRENT_TAG}"
echo ""

# Step 2: Check if image with same tag exists on Docker Hub
echo "🔍 Step 2: Checking if tag exists on Docker Hub..."
docker pull "${DOCKER_USERNAME}/${IMAGE_NAME}:${CURRENT_TAG}" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Tag ${CURRENT_TAG} already exists on Docker Hub"
    echo ""
    echo "📋 Since tag is the same, saving deployment file..."
    
    # Save deployment file with timestamp
    BACKUP_FILE="deployment-backup-$(date +%Y%m%d-%H%M%S).yaml"
    cp "$DEPLOYMENT_FILE" "$BACKUP_FILE"
    echo "✅ Deployment file saved as: $BACKUP_FILE"
    echo ""
    
    # Display the deployment file content
    echo "📄 Deployment file content:"
    echo "================================"
    cat "$DEPLOYMENT_FILE"
    echo "================================"
    echo ""
    echo "✅ Task completed: Deployment file exported"
    exit 0
else
    echo "🆕 Tag does not exist on Docker Hub"
fi

echo ""

# Step 3: Push to Docker Hub
echo "🚀 Step 3: Pushing image to Docker Hub..."
docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${CURRENT_TAG}"

if [ $? -eq 0 ]; then
    echo "✅ Image pushed successfully to Docker Hub"
    echo "🌐 Image available at: docker.io/${DOCKER_USERNAME}/${IMAGE_NAME}:${CURRENT_TAG}"
else
    echo "❌ Error: Failed to push image"
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"