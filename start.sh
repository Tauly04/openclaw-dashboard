#!/bin/bash
# Start OpenClaw Dashboard with persistent tunnel

cd "$(dirname "$0")"

# Activate virtual environment
source .venv/bin/activate

# Kill existing processes
pkill -f "python server.py" 2>/dev/null
pkill -f "cloudflared tunnel" 2>/dev/null

sleep 2

# Start the server
echo "🚀 Starting OpenClaw Dashboard..."
python server.py &
SERVER_PID=$!

sleep 5

# Start cloudflare tunnel
echo "🌐 Starting tunnel..."
cloudflared tunnel --url http://localhost:18790 --metrics localhost:45678 &
TUNNEL_PID=$!

echo ""
echo "✅ Dashboard started!"
echo "📱 Local: http://localhost:18790"
echo "🌐 Check the tunnel URL above (wait 10 seconds for it to appear)"
echo ""
echo "Press Ctrl+C to stop"

# Wait for interrupt
trap "kill $SERVER_PID $TUNNEL_PID 2>/dev/null; exit" INT
wait
