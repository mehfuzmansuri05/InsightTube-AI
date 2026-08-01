from pydantic import BaseModel

class QueryRequest(BaseModel):

    user_query : str
    video_id : str

