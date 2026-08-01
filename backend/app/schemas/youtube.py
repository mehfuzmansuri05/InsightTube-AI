from pydantic import BaseModel

class YouTubeURLRequest(BaseModel):

    url : str