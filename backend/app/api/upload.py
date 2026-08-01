from fastapi import APIRouter,HTTPException
from app.schemas.youtube import YouTubeURLRequest
from app.services.youtube_service import extract_video_id,get_transcript,create_chunks
from app.services.pinecone_service import store_chunks



router = APIRouter()

@router.post('/upload')
def upload_video_url(request : YouTubeURLRequest):

    video_id = extract_video_id(request.url)

    if video_id is None:

        raise HTTPException(
            status_code=400,
            detail='Invalid YouTube URL.'
        )

    transcript = get_transcript(video_id)

    if transcript is None:
        raise HTTPException(

            status_code=400,
            detail='Transcript not available.'
        )

    chunks = create_chunks(transcript,video_id)

    result = store_chunks(chunks,video_id)

    return {

        'video_id' : video_id,
        'transcrip' : transcript,
        'chunks' : chunks,
        'result' : result
    }