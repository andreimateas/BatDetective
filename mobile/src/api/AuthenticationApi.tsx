import axios from 'axios';
import {Role} from "./Role";
import {useRegistration} from "../utils/RegistrationContext";
import {useLocation} from "react-router-dom";
import {useLocationContext} from "../utils/LocationsContext";

const API_BASE_URL = "http://localhost:8080/batdetective/auth";

export const login = async (username: string, password: string): Promise<string> => {

    try {
        const url = `${API_BASE_URL}/login`;
        const response = await axios.post(url, {
            username,
            password,
        });
        return response.data.data;

    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401:
                    throw new Error('Unauthorized: Incorrect email or password.');
                case 403:
                    throw new Error('Forbidden: Login is restricted.');
                case 406:
                    throw new Error('Not Acceptable: Invalid response format.');
                default:
                    throw new Error(`Unexpected error: ${status}`);
            }
        } else {
            throw new Error('Network error or server not reachable.');
        }
    }
};

export const register = async (username: string, password: string, email: string): Promise<string> => {

    try {
        const url = `${API_BASE_URL}/register`;

        const response = await axios.post(url, {
            username,
            password,
            email,
        });
        return 'Registration successful';
    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401:
                    throw new Error('Unauthorized: You need to be authenticated first.');
                case 403:
                    throw new Error('Forbidden: Registration is not allowed for your role.');
                case 406:
                    throw new Error('Not Acceptable: Invalid request format.');
                case 500:
                    throw new Error('Internal Server Error: There was an issue with the server.');
                default:
                    throw new Error(`Unexpected error: ${status}`);
            }
        } else {
            throw new Error('Network error or server not reachable.');
        }
    }
};

export const enableUser = async (token: string) => {
    try {
        const url = `${API_BASE_URL}/enable/${token}`;
        const response = await axios.put(url);

        if (response.status === 200) {
            return "Account enabled successfully";
        }
    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401:
                    throw new Error("Unauthorized: Token is invalid or missing.");
                case 403:
                    throw new Error("Forbidden: Account cannot be enabled.");
                case 404:
                    throw new Error("Not Found: Token does not match any existing user.");
                case 406:
                    throw new Error("Not Acceptable: Invalid response format.");
                case 500:
                    throw new Error("Internal Server Error: There was an issue enabling the account.");
                default:
                    throw new Error(`Unexpected error: ${status}`);
            }
        } else {
            throw new Error("Network error or server not reachable.");
        }
    }
};