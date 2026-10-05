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

    raw_transcript = ''

    try:

        api = YouTubeTranscriptApi()

        transcript_list = api.list(video_id)

        found = False

        for transcript in transcript_list:

            if found:
                break

            elif transcript.is_generated == False and transcript.language_code == 'en':
                raw_transcript = transcript.fetch()
                break

            elif transcript.is_generated == True and transcript.language_code == 'en':
                raw_transcript = transcript.fetch()
                break
            elif transcript.is_translatable:
                for language in transcript.translation_languages:
                    if language.language_code == 'en':
                        script = transcript.translate('en')
                        raw_transcript = script.fetch()
                        found = True
                        break

        transcript = ' '.join(chunk.text for chunk in raw_transcript)

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


