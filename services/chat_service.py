"""
Chat Service - Connect to OpenClaw Gateway for real AI responses
"""
import os
import requests
import json
from typing import Optional, Dict, Any
from datetime import datetime

# OpenClaw Gateway configuration
GATEWAY_URL = os.environ.get('GATEWAY_URL', 'http://localhost:3000')
GATEWAY_TOKEN = os.environ.get('GATEWAY_TOKEN', '')


class ChatService:
    """Service to handle chat interactions with OpenClaw Gateway"""
    
    def __init__(self):
        self.gateway_url = GATEWAY_URL
        self.gateway_token = GATEWAY_TOKEN
        self.session = requests.Session()
        
    async def generate_response(self, user_message: str, conversation_history: list = None) -> str:
        """
        Generate response from OpenClaw Agent.
        
        Args:
            user_message: The user's message
            conversation_history: List of previous messages for context
            
        Returns:
            The assistant's response
        """
        try:
            # Try to call OpenClaw Gateway if available
            if self._is_gateway_available():
                return await self._call_gateway(user_message, conversation_history)
            else:
                # Fallback to local AI response
                return await self._local_response(user_message)
        except Exception as e:
            print(f"Chat service error: {e}")
            return await self._local_response(user_message)
    
    def _is_gateway_available(self) -> bool:
        """Check if OpenClaw Gateway is available"""
        try:
            response = self.session.get(
                f"{self.gateway_url}/health",
                timeout=2
            )
            return response.status_code == 200
        except:
            return False
    
    async def _call_gateway(self, user_message: str, conversation_history: list = None) -> str:
        """Call OpenClaw Gateway API"""
        try:
            payload = {
                "message": user_message,
                "context": conversation_history or [],
                "timestamp": datetime.utcnow().isoformat()
            }
            
            headers = {}
            if self.gateway_token:
                headers["Authorization"] = f"Bearer {self.gateway_token}"
            
            response = self.session.post(
                f"{self.gateway_url}/api/chat",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "Gateway 没有返回有效回复")
            else:
                return f"Gateway 错误 (状态码: {response.status_code})"
                
        except Exception as e:
            raise Exception(f"Gateway call failed: {e}")
    
    async def _local_response(self, user_message: str) -> str:
        """Generate local AI response when gateway is unavailable"""
        msg_lower = user_message.lower()
        
        # Help commands
        if any(word in msg_lower for word in ["help", "帮助", "?"]):
            return """🤖 **OpenClaw Dashboard 助手**

我可以帮你：

📊 **系统管理**
- 查看系统状态和性能
- 管理 Agent 和任务
- 监控 Gateway 运行状态

🛠️ **快捷操作**
- 执行常用命令
- 查看日志和告警
- 管理用户设置

💡 **使用建议**
- 使用左侧导航切换功能
- 点击卡片查看详情
- 设置中可自定义界面

有什么我可以帮你的吗？"""
        
        # Status queries
        if any(word in msg_lower for word in ["status", "状态", "gateway"]):
            return "📊 **系统状态**\n\nDashboard 正在正常运行。你可以在首页查看实时状态，包括：\n- CPU 和内存使用率\n- Gateway 连接状态\n- 运行中的 Agent 数量\n- 活跃任务数"
        
        # Agent queries
        if any(word in msg_lower for word in ["agent", "任务", "task"]):
            return "🤖 **Agent 管理**\n\n你可以通过 Dashboard 管理 OpenClaw Agent：\n- 查看所有 Agent 状态\n- 启动/停止 Agent\n- 查看 Agent 日志\n- 分配任务给 Agent"
        
        # Feature matrix
        if any(word in msg_lower for word in ["feature", "功能", "matrix"]):
            return "🎯 **功能矩阵**\n\n点击左侧的「功能矩阵」按钮可以查看所有可用功能：\n- 📊 仪表盘 - 系统概览\n- 🤖 Agent - Agent管理\n- 🧰 工具箱 - 实用工具\n- ⚡ 自动化 - 工作流\n- ⚙️ 设置 - 系统配置"
        
        # Greeting
        if any(word in msg_lower for word in ["hello", "hi", "你好", "嗨"]):
            return "你好！👋 我是 OpenClaw Dashboard 助手。\n\n我可以帮你：\n- 解答使用问题\n- 提供功能指导\n- 协助系统管理\n\n有什么可以帮你的吗？"
        
        # Default intelligent response
        return f"我收到了你的消息：\"{user_message}\"\n\n💡 目前我连接的是 Dashboard 本地助手。如需更强大的 AI 功能，请确保 OpenClaw Gateway 已启动并配置正确。\n\n你可以问我：\n- 系统状态\n- Agent 管理\n- 功能列表\n- 使用帮助"


# Global chat service instance
chat_service = ChatService()
