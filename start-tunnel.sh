#!/bin/bash
# Start Cloudflare tunnel and save URL to file

cd "$(dirname "$0")"
mkdir -p logs

echo "🌐 Creating public tunnel..."
echo "   (This may take 10-20 seconds...)"

# Kill existing tunnel
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 2

# Start tunnel and capture URL
cloudflared tunnel --url http://localhost:18790 --metrics localhost:45678 2>&1 > logs/tunnel.log &
TUNNEL_PID=$!

# Wait for tunnel URL
for i in {1..30}; do
    sleep 1
    URL=$(grep -o "https://[a-z0-9-]*\.trycloudflare\.com" logs/tunnel.log | head -1)
    if [ -n "$URL" ]; then
        echo ""
        echo "========================================"
        echo "🎉 PUBLIC URL READY!"
        echo "========================================"
        echo ""
        echo "🔗 $URL"
        echo ""
        echo "👤 Login: admin / admin123"
        echo "💬 Chat: Click the bubble icon on left"
        echo ""
        echo "⚠️  This URL is temporary. It will change when you restart."
        echo "   For a permanent URL, deploy to a cloud service."
        echo "========================================"
        echo ""
        echo "$URL" > logs/tunnel.url
        echo "Tunnel PID: $TUNNEL_PID" > logs/tunnel.pid
        break
    fi
    echo -n "."
done

if [ -z "$URL" ]; then
    echo ""
    echo "❌ Failed to create tunnel"
    echo "Check logs: cat logs/tunnel.log"
fi
