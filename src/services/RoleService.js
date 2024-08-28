import axios from "axios";

export const getRole = async (token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/roles`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};