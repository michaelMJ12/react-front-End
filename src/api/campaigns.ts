import axios from 'axios';
import { Campaign } from '../models/Campaign';
import { BudgetSums } from '../models/BudgetSums';

// Base URLs for Campaign and Authentication APIs
const CAMPAIGN_API_URL = 'http://127.0.0.1:8000/api';
const AUTH_API_URL = 'http://127.0.0.1:8000/api/auth';

// Function to set authorization header with bearer token
export const getAuthHeaders = () => {
    const access_token = localStorage.getItem('authToken');
    return {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    };
};

// ** Campaign API Functions **

// Fetch all campaigns
export const fetchCampaigns = async (): Promise<Campaign[]> => {
    const response = await axios.get(`${CAMPAIGN_API_URL}/campaigns`, getAuthHeaders());
    return response.data;
};

// Create or Update a campaign
export const createOrUpdateCampaign = async (campaign: Campaign): Promise<void> => {
    if (campaign.id) {
        await axios.put(`${CAMPAIGN_API_URL}/campaigns/${campaign.id}`, campaign, getAuthHeaders());
    } else {
        await axios.post(`${CAMPAIGN_API_URL}/create`, campaign, getAuthHeaders());
    }
};

// Delete a campaign by id
export const deleteCampaign = async (id: number): Promise<void> => {
    await axios.delete(`${CAMPAIGN_API_URL}/campaigns/${id}`, getAuthHeaders());
};

// Fetch a single campaign by id
export const getCampaignById = async (id: number): Promise<Campaign> => {
    const response = await axios.get(`${CAMPAIGN_API_URL}/campaigns/${id}`, getAuthHeaders());
    return response.data;
};

// ** Authentication API Functions **

export interface AuthCredentials {
    name?: string; // Made optional for reusability
    email: string;
    password: string;
    password_confirmation?: string;
    role?: string;
}

interface AuthResponse {
    token: string;
}

// Login API request
export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
    });
    const access_token = response.data.access_token;
    if (access_token) localStorage.setItem('authToken', access_token); // Store token for subsequent requests
    return response.data;
};

// Signup API request with authorization
export const signup = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post(
            `${AUTH_API_URL}/register`, // Signup endpoint
            credentials, 
            getAuthHeaders() // Include token in headers
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(`Signup failed: ${error.response.data.message}`);
        }
        throw new Error(`An unexpected error occurred: ${error.message}`);
    }
};

// Get the currently authenticated user's account details
export const getUserAccount = async (): Promise<any> => {
    const response = await axios.get(`${AUTH_API_URL}/profile`, getAuthHeaders());
    return response.data;
};

// Logout API request
export const logout = async (token?: string): Promise<void> => {
    await axios.post(`${AUTH_API_URL}/logout`, {}, getAuthHeaders());
    localStorage.removeItem('authToken');
};

// ** Dashboard API Functions **

// Fetch budget sums
export const fetchBudgetSums = async (): Promise<BudgetSums> => {
    const response = await axios.get(`${CAMPAIGN_API_URL}/budget-sums`, getAuthHeaders());
    return response.data as BudgetSums;
};

// Fetch records by month
export const fetchRecordsByMonth = async (month: string): Promise<any> => {
    const response = await axios.get(`${CAMPAIGN_API_URL}/records-by-month?month=${month}`, getAuthHeaders());
    return response.data;
};
