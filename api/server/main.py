from typing import Optional
import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, Body, UploadFile
import os

from models.api import (
    DeleteRequest,
    DeleteResponse,
    QuestionRequest,
    QuestionResponse,
    UpsertRequest,
    UpsertResponse,
    DocumentsResponse,
)
from datastore.factory import get_datastore
from services.file import get_document_from_file
from services.extract_query import extract_query_from_question
from services.answer_question import answer_question

from models.models import DocumentMetadata, Source, Query
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

ORIGINS = os.environ.get("ORIGINS", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post(
    "/upsert-file",
    response_model=UpsertResponse,
)
async def upsert_file(
    file: UploadFile = File(...),
    metadata: Optional[str] = Form(None),
):
    try:
        metadata_obj = (
            DocumentMetadata.parse_raw(metadata)
            if metadata
            else DocumentMetadata(source=Source.file)
        )
    except:
        metadata_obj = DocumentMetadata(source=Source.file)

    metadata_obj.name = file.filename

    document = await get_document_from_file(file, metadata_obj)

    try:
        ids = await datastore.upsert([document])
        return UpsertResponse(ids=ids)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"str({e})")


@app.get(
    "/documents",
    response_model=DocumentsResponse,
)
async def documents():
    try:
        documents = await datastore.list_documents()
        return DocumentsResponse(documents=documents)
    except Exception as e:
        if "Query was not successful!" in str(e):
            return DocumentsResponse(documents=[])

        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@app.post(
    "/upsert",
    response_model=UpsertResponse,
)
async def upsert(
    request: UpsertRequest = Body(...),
):
    try:
        ids = await datastore.upsert(request.documents)
        return UpsertResponse(ids=ids)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@app.post(
    "/question",
    response_model=QuestionResponse,
)
async def query_main(
    request: QuestionRequest = Body(...),
):
    try:
        query = extract_query_from_question(request.question)
        results = await datastore.query([Query(query=query)])
        contexts = [result.results[0].text for result in results]
        answer = answer_question(request.question, contexts)
        return QuestionResponse(question=request.question, answer=answer)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@app.delete(
    "/delete",
    response_model=DeleteResponse,
)
async def delete(
    request: DeleteRequest = Body(...),
):
    if not (request.ids or request.filter or request.delete_all):
        raise HTTPException(
            status_code=400,
            detail="One of ids, filter, or delete_all is required",
        )
    try:
        success = await datastore.delete(
            ids=request.ids,
            filter=request.filter,
            delete_all=request.delete_all,
        )
        return DeleteResponse(success=success)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@app.on_event("startup")
async def startup():
    global datastore
    datastore = await get_datastore()


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
