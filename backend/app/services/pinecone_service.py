from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
import os
import time

load_dotenv()

embedding_model = GoogleGenerativeAIEmbeddings(model = 'gemini-embedding-2')

pc = Pinecone(

    api_key=os.getenv('PINECONE')
)

index = pc.Index('youtube-chatbot')

vector_store = PineconeVectorStore(

    embedding=embedding_model,
    index=index
)

def store_chunks(chunks : list[Document],video_id : str) -> None:

    batch_size = 90

    total_chunk = len(chunks)

    for start in range(0,total_chunk,batch_size):

        end = start + batch_size

        batch = chunks[start : end]

        ids = []

        for index in range(start,start + len(batch)):

            ids.append(f'{video_id}_{index}')

        vector_store.add_documents(

            documents=batch,
            ids = ids
        )

        if end < total_chunk:

            time.sleep(60)
            

def search_chunks(user_query : str, video_id : str) -> list[Document]:

    retriever = vector_store.as_retriever(
        search_type = 'similarity',
        kwargs={

            'k' : 4,

            'filter' : {

                'video_id' : video_id
            }
        }
    )

    result = retriever.invoke(

        user_query
    )

    return result