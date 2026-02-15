"""
Chat API - WebSocket and REST chat with persistent storage
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List
import json
import asyncio
from datetime import datetime
import uuid

from database import get_db, ChatMessage, UserSettings
from services.auth import AuthService
from services.chat_service import chat_service

router = APIRouter()

# Store active WebSocket connections
active_chats: Dict[str, WebSocket] = {}


@router.websocket("/chat")
async def chat_websocket(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    WebSocket endpoint for real-time chat with persistent storage.
    """
    await websocket.accept()
    
    # Get token from query params
    token = websocket.query_params.get("token")
    auth_service = AuthService()
    
    if not token:
        await websocket.send_json({
            "type": "error",
            "content": "Authentication required"
        })
        await websocket.close(code=1008)
        return
    
    # Verify token and get user
    try:
        payload = auth_service.verify_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid token")
        user_id = int(user_id)
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "content": "Invalid token"
        })
        await websocket.close(code=1008)
        return
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    active_chats[session_id] = websocket
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "system",
            "content": "你好！我是 OpenClaw 助手，有什么可以帮你的吗？",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Send chat history
        history = db.query(ChatMessage).filter(
            ChatMessage.user_id == user_id
        ).order_by(ChatMessage.created_at.asc()).limit(50).all()
        
        for msg in history:
            await websocket.send_json({
                "type": "history",
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at.isoformat()
            })
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "message":
                user_content = message.get("content", "").strip()
                if not user_content:
                    continue
                
                # Save user message to database
                db_message = ChatMessage(
                    user_id=user_id,
                    role="user",
                    content=user_content,
                    session_id=session_id
                )
                db.add(db_message)
                db.commit()
                
                # Send typing indicator
                await websocket.send_json({
                    "type": "typing",
                    "content": "thinking...",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
                # Generate response
                response = await generate_openclaw_response(user_content, user_id, db)
                
                # Save assistant response to database
                assistant_message = ChatMessage(
                    user_id=user_id,
                    role="assistant",
                    content=response,
                    session_id=session_id
                )
                db.add(assistant_message)
                db.commit()
                
                # Send response
                await websocket.send_json({
                    "type": "message",
                    "role": "assistant",
                    "content": response,
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Chat WebSocket error: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "content": f"Error: {str(e)}"
            })
        except:
            pass
    finally:
        if session_id in active_chats:
            del active_chats[session_id]
        try:
            await websocket.close()
        except:
            pass


async def generate_openclaw_response(user_message: str, user_id: int, db: Session) -> str:
    """Generate response from OpenClaw Agent using chat service."""
    # Get conversation history for context
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id
    ).order_by(ChatMessage.created_at.desc()).limit(10).all()
    
    conversation_history = [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(history)
    ]
    
    # Use chat service to generate response
    return await chat_service.generate_response(user_message, conversation_history)


# REST API endpoints
@router.get("/chat/history")
async def get_chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AuthService().get_current_user)
):
    """Get chat history for the current user"""
    user_id = current_user.get("id")
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id
    ).order_by(ChatMessage.created_at.desc()).limit(limit).all()
    
    return {
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at.isoformat()
            }
            for msg in reversed(messages)
        ]
    }


@router.delete("/chat/history")
async def clear_chat_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(AuthService().get_current_user)
):
    """Clear chat history for the current user"""
    user_id = current_user.get("id")
    
    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
    db.commit()
    
    return {"message": "Chat history cleared"}


# User settings endpoints
@router.get("/settings")
async def get_user_settings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(AuthService().get_current_user)
):
    """Get user settings"""
    user_id = current_user.get("id")
    
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    
    if not settings:
        # Create default settings
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "language": settings.language,
        "bg_image": settings.bg_image,
        "updated_at": settings.updated_at.isoformat() if settings.updated_at else None
    }


@router.put("/settings")
async def update_user_settings(
    language: str = None,
    bg_image: str = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AuthService().get_current_user)
):
    """Update user settings"""
    user_id = current_user.get("id")
    
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
    
    if language:
        settings.language = language
    if bg_image is not None:  # Allow empty string to clear
        settings.bg_image = bg_image
    
    db.commit()
    db.refresh(settings)
    
    return {
        "language": settings.language,
        "bg_image": settings.bg_image,
        "updated_at": settings.updated_at.isoformat() if settings.updated_at else None
    }
