import axios from 'axios';
import jwt from 'jsonwebtoken';

class ApiService {
    baseUrl: string;
    constructor() {
        this.baseUrl = 'http://localhost:3000'; // Set your base API URL here
    }

    // Placeholder function to check if the access token is expired
    isTokenExpired = (token: any) => {
        try {
            const decodedToken = jwt.decode(token);
            if (!decodedToken || !decodedToken.exp) {
                // Token is not valid or doesn't have an expiration time
                return true;
            }

            // Get the current time in seconds
            const currentTime = Math.floor(Date.now() / 1000);

            // Compare the expiration time with the current time
            return decodedToken.exp < currentTime;
        } catch (error) {
            // An error occurred while decoding the token
            console.error('Error decoding token:', error);
            return true; // Treat as expired if there's an error
        }
    };



    // Function to refresh access token
    refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('accesToken');
            const response = await axios.post(`${this.baseUrl}/api/refresh-token`, {
                refreshToken,
            });

            const newAccessToken = response.data.accessToken;

            // Update the stored access token
            localStorage.setItem('accesToken', newAccessToken);

            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
    };


    // Function to fetch merchandise data
    async fetchMerchandiseData(accessToken: any) {
        const isExpired = this.isTokenExpired(accessToken);

        if (isExpired) {
            console.log('Access token is expired');
            //This will Hit our Api Again and refresh the token Silently
            this.refreshAccessToken();
        } 
        
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.get(`${this.baseUrl}/api/merchandise`, config);
            return response.data;
        } catch (error) {
            console.error('Error fetching merchandise data:', error);
            throw error;
        }
    }

    // Function to insert new data
    async insertData(accessToken: any, newData: any) {
        const isExpired = this.isTokenExpired(accessToken);

        if (isExpired) {
            console.log('Access token is expired');
            //This will Hit our Api Again and refresh the token Silently
            this.refreshAccessToken();
        } 
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.post(`${this.baseUrl}/api/merchandise`, newData, config);
            return response.data;
        } catch (error) {
            console.error('Error inserting data:', error);
            throw error;
        }
    }

    // Function to update data
    async updateData(accessToken: any, recordId: any, editedData: any) {
        const isExpired = this.isTokenExpired(accessToken);

        if (isExpired) {
            console.log('Access token is expired');
            //This will Hit our Api Again and refresh the token Silently
            this.refreshAccessToken();
        } 
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.put(`${this.baseUrl}/api/merchandise/${recordId}`, editedData, config);
            return response.data;
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    // Function to delete data
    async deleteData(accessToken: any, recordId: any) {
        const isExpired = this.isTokenExpired(accessToken);

        if (isExpired) {
            console.log('Access token is expired');
            //This will Hit our Api Again and refresh the token Silently
            this.refreshAccessToken();
        } 
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            await axios.delete(`${this.baseUrl}/api/merchandise/${recordId}`, config);
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}

export default new ApiService();
