#!/bin/bash
# Setup OpenClaw Dashboard as a system service on macOS
# This allows the dashboard to run 24/7 and restart automatically

set -e

echo "🔧 Setting up OpenClaw Dashboard auto-start..."

# Create logs directory
mkdir -p /Users/tauly/.openclaw/workspace/openclaw-dashboard/logs

# Copy plist to LaunchAgents
PLIST_NAME="com.openclaw.dashboard.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="/Users/tauly/.openclaw/workspace/openclaw-dashboard/$PLIST_NAME"

echo "📋 Installing launch agent..."
cp "$PLIST_PATH" "$LAUNCH_AGENTS_DIR/"

# Load the service
echo "🚀 Loading service..."
launchctl load -w "$LAUNCH_AGENTS_DIR/$PLIST_NAME"

# Check status
if launchctl list | grep -q "com.openclaw.dashboard"; then
    echo "✅ Service installed successfully!"
    echo ""
    echo "📱 Dashboard is now running at: http://localhost:18790"
    echo ""
    echo "🌐 To create a public tunnel, run:"
    echo "   cloudflared tunnel --url http://localhost:18790"
    echo ""
    echo "📝 Useful commands:"
    echo "   Status: launchctl list | grep openclaw"
    echo "   Stop:   launchctl unload ~/Library/LaunchAgents/$PLIST_NAME"
    echo "   Start:  launchctl load ~/Library/LaunchAgents/$PLIST_NAME"
    echo "   Logs:   tail -f /Users/tauly/.openclaw/workspace/openclaw-dashboard/logs/dashboard.out"
else
    echo "❌ Failed to start service. Check logs:"
    echo "   cat /Users/tauly/.openclaw/workspace/openclaw-dashboard/logs/dashboard.err"
fi
