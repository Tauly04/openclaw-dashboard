"""
Database configuration and models for OpenClaw Dashboard
"""
import os
from datetime import datetime
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool

# Get database URL from environment
DATABASE_URL = os.environ.get('DATABASE_URL')

# If using Render's DATABASE_URL (postgres://), convert to postgresql://
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

# Default to SQLite for local development
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./openclaw_dashboard.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool if DATABASE_URL.startswith('postgresql') else None,
    echo=False
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


# Models
class User(Base):
    """User model for authentication"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)


class ChatMessage(Base):
    """Chat message model for cross-device sync"""
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)  # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    session_id = Column(String, index=True, nullable=True)  # For grouping conversations
    created_at = Column(DateTime, default=datetime.utcnow)


class UserSettings(Base):
    """User settings for cross-device sync"""
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    language = Column(String, default='zh')  # 'zh' or 'en'
    bg_image = Column(Text, nullable=True)  # Base64 encoded image
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
