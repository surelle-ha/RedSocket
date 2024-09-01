import axios from "axios";

export const useValidateState = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/check/database`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const response1 = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/check/redis`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            connection: (response.data.connection === 1) && (response1.data.connection === 1),
            message: response.data.message || response1.data.message || 'No message provided'
        };
    } catch (error) {
        return {
            connection: false,
            message: 'Installation Failed. Reinstallation required to continue.'
        };
    }
};

export const useStartMigration = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/migrate`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return true;
    } catch (error) {
        return false;
    }
};

export const useCreateAdministrator = async (data) => {
    if (!data) {
		console.error("Data is missing for the registration process.");
		return;
	}

	try {
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_API_URL}/installer/create/administrator`,
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
}

export const useUpdateDatabase = async (data) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/update/database`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return true;
    } catch (error) {
        return false;
    }
};

export const useCheckDatabase = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/check/database`,
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
            message: 'Failed to check database connection.'
        };
    }
};

export const useUpdateRedis = async (data) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/installer/update/redis`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return true;
    } catch (error) {
        return false;
    }
};

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
