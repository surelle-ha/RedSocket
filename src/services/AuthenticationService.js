import axios from "axios";

export const useLogin = async (data) => {
    if (!data) {
        console.error("Data is missing for the login process.");
        throw new Error("Please provide the necessary data to proceed with the login.");
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/login`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status !== 200) {
            console.error('Failed to log in:', response);
            throw new Error(response.data.message || 'Unknown error occurred during login.');
        }

        console.log("Login successful:", response);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const useRegister = async (data) => {
	if (!data) {
		console.error("Data is missing for the registration process.");
		return;
	}
    console.log(data)

	try {
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/register`,
			data,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return response;
	} catch (error) {
        return error.response.data.message;
	}
};

export const useLogout = async (token) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/logout`,
            {}, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
            }
        );
        console.log(response);
        return response.data;
    } catch (error) {
        console.log("Network error:", error);
    }
}

export const useValidateToken = async (token) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/auth/session/${token}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
            }
        );
        return response.status === 200;
    } catch (error) {
        return false;
    }
}
