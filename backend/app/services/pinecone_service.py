from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
import os
import time


load_dotenv()


embedding_model = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-2"
)


pc = Pinecone(
    api_key=os.getenv("PINECONE")
)


index = pc.Index("youtube-chatbot")


vector_store = PineconeVectorStore(
    embedding=embedding_model,
    index=index
)


def store_chunks(chunks: list[Document], video_id: str) -> None:

    batch_size = 90
    total_chunks = len(chunks)

    for start in range(0, total_chunks, batch_size):

        end = start + batch_size

        batch = chunks[start:end]

        ids = [
            f"{video_id}_{i}"
            for i in range(start, start + len(batch))
        ]

        vector_store.add_documents(
            documents=batch,
            ids=ids
        )

        if end < total_chunks:

            time.sleep(60)


def search_chunks(user_query: str, video_id: str) -> list[Document]:

    result = vector_store.similarity_search(
        user_query,
        k=4,
        filter={
            "video_id": {
                "$eq": video_id
            }
        }
    )

    return result