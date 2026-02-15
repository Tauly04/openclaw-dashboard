#!/bin/bash
# Start OpenClaw Dashboard with auto-restarting tunnel
# This creates a public URL that stays active as long as your Mac is on

cd "$(dirname "$0")"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting OpenClaw Dashboard...${NC}"

# Activate virtual environment
source .venv/bin/activate

# Check if already running
if pgrep -f "python server.py" > /dev/null; then
    echo -e "${YELLOW}⚠️  Dashboard is already running${NC}"
    echo "Local: http://localhost:18790"
    
    # Check if tunnel is running
    if pgrep -f "cloudflared tunnel" > /dev/null; then
        echo -e "${YELLOW}Tunnel is already running${NC}"
        echo "Run 'cat logs/tunnel.url' to see the current URL"
    else
        echo -e "${BLUE}🌐 Starting tunnel...${NC}"
        ./start-tunnel.sh
    fi
    exit 0
fi

# Create logs directory
mkdir -p logs

# Kill any existing processes
pkill -f "python server.py" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true

sleep 2

# Start the server
echo -e "${BLUE}🖥️  Starting server...${NC}"
python server.py > logs/dashboard.out 2> logs/dashboard.err &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
for i in {1..30}; do
    if curl -s http://localhost:18790 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is running!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done

if ! curl -s http://localhost:18790 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Server may not have started properly${NC}"
    echo "Check logs: tail -f logs/dashboard.err"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Dashboard is ready!${NC}"
echo ""
echo -e "📱 ${BLUE}Local URL:${NC} http://localhost:18790"
echo ""

# Start tunnel in background
echo -e "${BLUE}🌐 Starting public tunnel...${NC}"
./start-tunnel.sh &

echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   - Dashboard runs in background"
echo "   - Tunnel URL will appear above ☝️"
echo "   - Data is saved to: openclaw_dashboard.db"
echo "   - To stop: pkill -f 'python server.py'"
echo "   - To see logs: tail -f logs/dashboard.out"
echo ""
