import axios from "axios";

export const useCheckRedis = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/check/redis`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            connection: response.data.connection === 1,
            message: response.data.message || 'No message provided'
        };
    } catch (error) {
        return {
            connection: false,
            message: 'Failed to check redis connection.'
        };
    }
};