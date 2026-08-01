from fastapi import APIRouter
from app.schemas.question import QueryRequest
from app.services.pinecone_service import search_chunks
from app.services.llm_service import generate_answer
router = APIRouter()

@router.post('/chat')
def chat_request(request : QueryRequest):

    similar_chunk = search_chunks(

        request.user_query,
        request.video_id
    )

    result = generate_answer(similar_chunk,request.user_query)

    return {

        'result' : result
    }