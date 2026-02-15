#!/bin/bash
# Deploy to Koyeb (free, no credit card required)

set -e

echo "🚀 Deploying OpenClaw Dashboard to Koyeb..."

# Check if koyeb CLI is installed
if ! command -v koyeb &> /dev/null; then
    echo "Installing Koyeb CLI..."
    curl -fsSL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
    export PATH="$PATH:$HOME/.koyeb/bin"
fi

# Login to Koyeb (opens browser)
echo "Please login to Koyeb..."
koyeb login

# Create app if not exists
koyeb app init openclaw-dashboard || echo "App already exists"

# Deploy
echo "Deploying..."
koyeb service create \
  --app openclaw-dashboard \
  --name web \
  --type web \
  --env "PYTHON_VERSION=3.11.0" \
  --env "SERVER_HOST=0.0.0.0" \
  --env "SERVER_PORT=8000" \
  --port 8000:http \
  --git github.com/Tauly04/openclaw-dashboard \
  --git-branch master \
  --instance-type free \
  --build-command "pip install -r requirements.txt && cd frontend && npm install && npm run build" \
  --docker-command "python server.py"

echo "✅ Deployment complete!"
echo "Check your app at: https://app.koyeb.com"
