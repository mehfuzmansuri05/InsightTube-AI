import re 
from youtube_transcript_api import YouTubeTranscriptApi,TranscriptsDisabled,NoTranscriptFound
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def extract_video_id(url : str) -> str | None:

    pattern = r'(?:v=|/)([0-9A-Za-z_-]{11})'

    match = re.search(pattern,url)

    if match:

        return match.group(1)

    return None

def get_transcript(video_id : str) -> str | None:

    try:

        transcript_list = YouTubeTranscriptApi().fetch(video_id,languages=['en'])

        transcript = ' '.join(chunk.text for chunk in transcript_list)

        return transcript

    except (TranscriptsDisabled,NoTranscriptFound):

        return None

def create_chunks(transcript : str,video_id : str) -> list[Document]:

    document = Document(

        page_content = transcript,
        metadata = {

            'video_id' : video_id
        }
    )

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents([document])

    return chunks


