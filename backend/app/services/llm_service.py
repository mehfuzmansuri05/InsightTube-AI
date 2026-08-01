from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

model = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.5
)


prompt = PromptTemplate(
    template="""
      You are a helpful assistant.
      Answer ONLY from the provided transcript context.
      If the context is insufficient, just say you don't know.

      {context}
      Question: {question}
    """,
    input_variables = ['context', 'question']
)

parser = StrOutputParser()

def generate_answer(raw_context : list[Document],user_query : str) -> str:

    context = ' '.join(text.page_content for text in raw_context)

    chain = prompt | model | parser 

    result = chain.invoke({

        'context' : context,
        'question' : user_query
    })


    return result