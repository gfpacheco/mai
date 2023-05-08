from typing import Optional
import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, Body, UploadFile
from fastapi.staticfiles import StaticFiles
import os

from api.models.api import (
    DeleteRequest,
    DeleteResponse,
    QuestionRequest,
    QuestionResponse,
    UpsertRequest,
    UpsertResponse,
    DocumentsResponse,
)
from api.datastore.factory import get_datastore
from api.services.file import get_document_from_file
from api.services.answer_question import answer_question

from api.models.models import DocumentMetadata, Source, Query
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

api = FastAPI()
app.mount("/api", api)

app.mount("/", StaticFiles(directory="app/dist", html=True), name="static")


@api.post(
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


@api.get(
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


@api.post(
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


@api.post(
    "/question",
    response_model=QuestionResponse,
)
async def query_main(
    request: QuestionRequest = Body(...),
):
    try:
        results = await datastore.query([Query(query=request.question)])
        contexts = [result.results[0].text for result in results]
        answer = answer_question(request.question, contexts)
        return QuestionResponse(question=request.question, answer=answer)
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Service Error")


@api.delete(
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
    print("Starting up...")
    global datastore
    datastore = await get_datastore()


def start():
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
