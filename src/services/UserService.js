import axios from "axios";

export const getUser = async (token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/users`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response)
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const updateUser = async (target, data, token) => {
    if (!data) {
        console.error("Data is missing. Unable process request.");
        throw new Error("Please provide the necessary data to proceed.");
    }

    try {
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/users/${target}`,
        data,
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
