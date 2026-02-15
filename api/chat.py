"""
Chat API - WebSocket chat with OpenClaw Agent
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import json
import asyncio
from datetime import datetime

router = APIRouter()

# Store active chat connections
active_chats: Dict[str, WebSocket] = {}

# Chat message history (in-memory, per session)
chat_history: Dict[str, List[dict]] = {}


@router.websocket("/chat")
async def chat_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat with OpenClaw Agent.
    
    Message format:
    {
        "type": "message" | "typing" | "status",
        "content": "user message",
        "timestamp": "ISO datetime"
    }
    """
    await websocket.accept()
    
    # Generate session ID
    session_id = str(id(websocket))
    active_chats[session_id] = websocket
    chat_history[session_id] = []
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "system",
            "content": "你好！我是 OpenClaw 助手，有什么可以帮你的吗？",
            "timestamp": datetime.now().isoformat()
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "message":
                user_content = message.get("content", "")
                
                # Store user message
                chat_history[session_id].append({
                    "role": "user",
                    "content": user_content,
                    "timestamp": datetime.now().isoformat()
                })
                
                # Send typing indicator
                await websocket.send_json({
                    "type": "typing",
                    "content": "thinking...",
                    "timestamp": datetime.now().isoformat()
                })
                
                # Simulate processing delay (will be replaced with actual OpenClaw integration)
                await asyncio.sleep(1)
                
                # Generate response (placeholder - will integrate with OpenClaw)
                response = await generate_openclaw_response(user_content, session_id)
                
                # Store assistant response
                chat_history[session_id].append({
                    "role": "assistant",
                    "content": response,
                    "timestamp": datetime.now().isoformat()
                }
                )
                
                # Send response
                await websocket.send_json({
                    "type": "message",
                    "role": "assistant",
                    "content": response,
                    "timestamp": datetime.now().isoformat()
                })
                
    except WebSocketDisconnect:
        # Clean up on disconnect
        if session_id in active_chats:
            del active_chats[session_id]
        if session_id in chat_history:
            del chat_history[session_id]
    except Exception as e:
        try:
            await websocket.send_json({
                "type": "error",
                "content": f"Error: {str(e)}",
                "timestamp": datetime.now().isoformat()
            })
            await websocket.close()
        except:
            pass
        finally:
            if session_id in active_chats:
                del active_chats[session_id]


async def generate_openclaw_response(user_message: str, session_id: str) -> str:
    """
    Generate response from OpenClaw Agent.
    This is a placeholder - will be integrated with actual OpenClaw main agent.
    """
    # Simple keyword-based responses for now
    msg_lower = user_message.lower()
    
    if "gateway" in msg_lower or "状态" in msg_lower:
        return "Gateway 状态可以通过 Dashboard 查看。目前系统运行正常。"
    
    if "agent" in msg_lower or "任务" in msg_lower:
        return "你可以在 Agent 控制面板查看和管理所有 Agent。"
    
    if "help" in msg_lower or "帮助" in msg_lower:
        return """我可以帮你：
- 查看系统状态
- 管理 Agent 任务
- 配置模型用量
- 执行快捷操作

请告诉我你需要什么帮助？"""
    
    if "hello" in msg_lower or "你好" in msg_lower:
        return "你好！我是 OpenClaw 助手，很高兴为你服务！"
    
    # Default response
    return f"我收到了你的消息：\"{user_message}\"\n\n目前我还在学习中，暂时只能回答一些预设问题。请使用 Dashboard 的功能来完成具体操作。"


@router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    return {
        "session_id": session_id,
        "messages": chat_history.get(session_id, [])
    }
