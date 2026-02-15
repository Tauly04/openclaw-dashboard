"""
Chat Service - Connect to OpenClaw Gateway for real AI responses
"""
import os
import json
import asyncio
import websockets
from typing import Optional, List, Dict
from datetime import datetime

# OpenClaw Gateway configuration
GATEWAY_URL = os.environ.get('GATEWAY_URL', 'ws://127.0.0.1:18789')


class ChatService:
    """Service to handle chat interactions with OpenClaw Gateway"""
    
    def __init__(self):
        self.gateway_url = GATEWAY_URL
        self.pending_responses: Dict[str, asyncio.Future] = {}
        
    async def generate_response(self, user_message: str, conversation_history: List[Dict] = None) -> str:
        """
        Generate response by forwarding to OpenClaw main session.
        
        Args:
            user_message: The user's message
            conversation_history: List of previous messages for context
            
        Returns:
            The assistant's response from OpenClaw
        """
        try:
            # Try to connect to OpenClaw Gateway
            return await self._call_openclaw(user_message, conversation_history)
        except Exception as e:
            print(f"OpenClaw connection error: {e}")
            # Fallback to local response
            return await self._local_response(user_message)
    
    async def _call_openclaw(self, user_message: str, conversation_history: List[Dict] = None) -> str:
        """Connect to OpenClaw Gateway and send message"""
        try:
            # Build conversation context
            context = ""
            if conversation_history:
                # Format last 5 messages for context
                recent = conversation_history[-5:]
                for msg in recent:
                    role = "用户" if msg.get('role') == 'user' else "助手"
                    context += f"{role}: {msg.get('content', '')}\n"
            
            # Prepare the message with context
            if context:
                full_message = f"之前的对话:\n{context}\n当前消息: {user_message}"
            else:
                full_message = user_message
            
            # Connect to OpenClaw Gateway WebSocket
            uri = f"{self.gateway_url}/ws"
            
            async with websockets.connect(uri, ping_interval=None) as websocket:
                # Send message to OpenClaw
                message_payload = {
                    "type": "message",
                    "text": full_message,
                    "timestamp": datetime.utcnow().isoformat(),
                    "source": "openclaw-dashboard"
                }
                
                await websocket.send(json.dumps(message_payload))
                
                # Wait for response with timeout
                try:
                    response = await asyncio.wait_for(
                        websocket.recv(),
                        timeout=60.0
                    )
                    
                    # Parse response
                    data = json.loads(response)
                    return data.get("text", data.get("content", "收到回复但格式不正确"))
                    
                except asyncio.TimeoutError:
                    return "OpenClaw 响应超时，请稍后重试。"
                    
        except websockets.exceptions.ConnectionRefused:
            raise Exception("无法连接到 OpenClaw Gateway，请确认服务已启动")
        except Exception as e:
            raise Exception(f"OpenClaw 调用失败: {e}")
    
    async def _local_response(self, user_message: str) -> str:
        """Generate local AI response when OpenClaw is unavailable"""
        msg_lower = user_message.lower()
        
        # Help commands
        if any(word in msg_lower for word in ["help", "帮助", "?"]):
            return """🤖 **OpenClaw Dashboard 助手** (离线模式)

目前无法连接到 OpenClaw Gateway，但我可以帮你：

📊 **系统管理**
- 查看系统状态和性能
- 管理 Agent 和任务
- 监控 Gateway 运行状态

💡 **使用建议**
- 使用左侧导航切换功能
- 点击卡片查看详情
- 设置中可自定义界面

⚠️ **注意**：当前为离线模式，如需完整 AI 功能，请确保 OpenClaw Gateway 已启动。"""
        
        # Status queries
        if any(word in msg_lower for word in ["status", "状态", "gateway"]):
            return "📊 **系统状态** (离线模式)\n\nDashboard 正在运行，但无法连接到 OpenClaw Gateway。\n\n请检查：\n1. OpenClaw 是否已启动: `openclaw status`\n2. Gateway 地址是否正确\n3. 网络连接是否正常"
        
        # Greeting
        if any(word in msg_lower for word in ["hello", "hi", "你好", "嗨"]):
            return "你好！👋 我是 Dashboard 助手（离线模式）。\n\n⚠️ 当前无法连接到 OpenClaw Gateway。\n\n你可以：\n1. 检查 OpenClaw 是否已启动\n2. 使用 Dashboard 的功能面板\n3. 查看系统状态和任务"
        
        # Default intelligent response
        return f"我收到了你的消息：\"{user_message}\"\n\n⚠️ **当前为离线模式**\n\n无法连接到 OpenClaw Gateway。你可以：\n1. 检查 `openclaw status` 确认服务状态\n2. 使用 Dashboard 的其他功能\n3. 稍后再试\n\n或问我：系统状态、使用帮助、功能列表"


# Global chat service instance
chat_service = ChatService()
