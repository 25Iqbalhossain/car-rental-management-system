from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list)


class ChatCitation(BaseModel):
    id: str
    title: str


class ChatResponse(BaseModel):
    success: bool = True
    reply: str
    source: Literal["python", "fallback"] = "python"
    citations: list[ChatCitation] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
