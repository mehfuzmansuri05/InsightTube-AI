import axios from "axios";
import { API_BASE_URL } from "../constants/config";

export async function uploadVideo(url) {

    const response = await axios.post(
        `${API_BASE_URL}/upload`,
        {
            url: url
        }
    );

    return response.data.video_id;
}


export async function askQuestion(videoId, userQuery) {

    const response = await axios.post(
        `${API_BASE_URL}/chat`,
        {
            video_id: videoId,
            user_query: userQuery
        }
    );

    return response.data.result;
}