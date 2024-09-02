import axios from "axios";
import { io } from "socket.io-client";

export const useSocketEngine = (channel) => {
    const socket = io("ws://localhost:4000", {
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: Infinity,
    });
    socket.emit("subscribe", channel);
    return socket;
}

export const useCreateEvent = async (data) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/event`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response;
    } catch (error) {
        return error;
    }
};

export const getEventChannels = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/event/channels`
        );
        return response;
    } catch (error) {
        return error;
    }
};

export const getEventCount = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/event/count`
        );
        return response;
    } catch (error) {
        return error;
    }
};

export const getEventStatistics = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/event/statistics`
        );
        return response;
    } catch (error) {
        return error;
    }
};