from models.models import (
    Document,
    DocumentMetadataFilter,
)
from pydantic import BaseModel
from typing import List, Optional


class UpsertRequest(BaseModel):
    documents: List[Document]


class UpsertResponse(BaseModel):
    ids: List[str]


class QuestionRequest(BaseModel):
    question: str


class QuestionResponse(BaseModel):
    question: str
    answer: str


class DeleteRequest(BaseModel):
    ids: Optional[List[str]] = None
    filter: Optional[DocumentMetadataFilter] = None
    delete_all: Optional[bool] = False


class DeleteResponse(BaseModel):
    success: bool
