from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq


load_dotenv()


model = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.5
)


ANSWER_GENERATION_PROMPT = PromptTemplate(
    template="""
You are a RAG-based assistant for answering questions about a YouTube video.

Your ONLY source of information is the provided transcript context.

Follow these rules carefully:

1. First, determine whether the user's question is related to the topic or information discussed in the transcript context.

2. If the question is clearly unrelated to the transcript or video topic, do NOT answer it using your general knowledge.

   Instead, respond:
   "I don't know. This question is not related to this video."

3. If the question is related to the transcript topic, check whether the provided context contains enough information to answer it.

4. If the context contains relevant information that can answer the question, answer the question using ONLY that information.

5. You may combine information from multiple retrieved chunks to form the answer.

6. Do NOT require the exact words of the question to appear in the transcript. Understand the meaning of the question and use relevant information from the context.

7. If the question is related to the video but the provided context does not contain enough information to answer it, respond:
   "I don't know. The provided transcript does not contain enough information to answer this question."

8. Never use your own knowledge, outside information, assumptions, or guesses.

9. Never add facts that are not supported by the transcript.

10. Keep the answer clear, concise, and directly related to the user's question.

Transcript Context:
{context}

User Question:
{question}

Answer:
""",
    input_variables=["context", "question"]
)


parser = StrOutputParser()


def generate_answer(raw_context: list[Document], user_query: str) -> str:

    context = " ".join(
        text.page_content
        for text in raw_context
    )

    chain = ANSWER_GENERATION_PROMPT | model | parser

    result = chain.invoke({
        "context": context,
        "question": user_query
    })

    return result


TRANSCRIPT_CLEANING_PROMPT = PromptTemplate(
    template="""
You are a transcript cleaning assistant for a RAG-based YouTube chatbot.

Your task is to clean the provided raw YouTube transcript and return a clear,
readable version of the same transcript.

IMPORTANT:
You are ONLY cleaning the transcript.
You are NOT summarizing, rewriting, explaining, or adding information.

Follow these rules carefully:

1. PRESERVE THE ORIGINAL MEANING
- Do not change the meaning of the transcript.
- Do not add any new information.
- Do not remove important information.
- Do not invent facts, examples, explanations, or conclusions.
- Do not make assumptions about unclear statements.

2. REMOVE SPEECH NOISE
Remove unnecessary speech artifacts such as:
- "uh"
- "um"
- "hmm"
- unnecessary "you know"
- unnecessary filler words
- repeated words caused by speech mistakes
- accidental sentence repetitions
- obvious speech-to-text noise

3. IMPROVE READABILITY
- Fix obvious punctuation problems.
- Add commas, periods, question marks, and paragraph breaks where appropriate.
- Join fragmented sentences when their meaning is clear.
- Make the transcript easier to read while keeping the original meaning.

4. PRESERVE IMPORTANT INFORMATION
Do NOT remove or modify:
- Technical terms
- Programming concepts
- Code
- Commands
- Function names
- Class names
- Variable names
- Library names
- Framework names
- API names
- Product names
- Company names
- Person names
- Numbers
- Dates
- Statistics
- Formulas
- URLs
- File names
- Error messages
- Definitions
- Examples
- Important instructions

5. TECHNICAL CONTENT
If the transcript contains technical content:
- Preserve technical terminology.
- Do not replace technical terms with simpler words.
- Do not change code or commands.
- Do not invent technical explanations.
- Preserve the original technical meaning.

6. REPETITION
Remove unnecessary repeated words or sentences caused by speaking mistakes.

However, keep repetition if it contains additional information or meaningful emphasis.

7. UNCLEAR CONTENT
If something is unclear:
- Do not guess.
- Do not hallucinate missing information.
- Preserve the available information as accurately as possible.

8. ORDER AND CONTEXT
- Keep the original order of information.
- Keep related sentences together.
- Preserve important context.
- Do not summarize.
- Do not convert the transcript into notes or bullet points unless the original content is clearly a list.

9. RAG REQUIREMENT
This cleaned transcript will be divided into chunks and stored in a vector database.

Therefore:
- Preserve important context.
- Do not remove useful information.
- Do not create summaries instead of the original content.
- Make each part readable and meaningful for later retrieval.

10. OUTPUT
Return ONLY the cleaned transcript.

Do not include:
- "Here is the cleaned transcript"
- explanations
- summaries
- comments
- analysis
- markdown code fences
- any text outside the cleaned transcript

RAW TRANSCRIPT:

{transcript}
""",
    input_variables=["transcript"]
)


def clean_transcript(raw_transcript: str) -> str:

    chain = TRANSCRIPT_CLEANING_PROMPT | model | parser

    result = chain.invoke({
        "transcript": raw_transcript
    })

    return result