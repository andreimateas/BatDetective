import axios from 'axios';

export const deleteLocation = async (locationId: string): Promise<void> => {
    const API_ENDPOINT = `http://localhost:8080/api/locations/${locationId}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        };

        const response = await axios.delete(API_ENDPOINT, { headers });

        if (response.status === 200 || response.status === 204) {
            console.log('Location deleted successfully');
        } else {
            console.error('Unexpected response:', response);
            throw new Error('Unexpected response from server');
        }
    } catch (error: any) {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 401:
                    console.error('Unauthorized: Please log in to delete a location.');
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to delete this location.');
                    break;
                case 404:
                    console.error('Not Found: Location with the given ID does not exist.');
                    break;
                case 500:
                    console.error('Internal Server Error: An issue occurred while deleting the location.');
                    break;
                default:
                    console.error(`Unexpected error: ${status}`);
            }
        } else {
            console.error('Network or other error:', error);
        }

        throw error;
    }
};

export const createLocation = async (locationData:any) => {
    const API_ENDPOINT = 'http://localhost:8080/api/locations';
    //console.log("A ajuns la endpoint")
    try {
        const formData = new FormData();

        // Append non-file data (if available)
        formData.append('latitude', locationData.latitude);
        formData.append('longitude', locationData.longitude);
        formData.append('dateAndTimeOfObservation', locationData.dateAndTimeOfObservation);
        formData.append('individualOrColony', locationData.individualOrColony);
        formData.append('typeOfBuilding', locationData.typeOfBuilding);
        if (locationData.description) formData.append('description', locationData.description);
        if (locationData.flying) formData.append('flying', locationData.flying);
        if (locationData.moveOption) formData.append('moveOption', locationData.moveOption);

        // Append the image file (if available)
        if (locationData.image) {
            formData.append('image', locationData.image);  // The field name 'image' must match what the backend expects
        }
        console.dir(formData,null);
        // Ensure all necessary headers are included, for example:
        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        };

        const response = await axios.post(API_ENDPOINT, formData, { headers });
        //console.log(response);
        if (response.status === 201) {
            //console.log('Location created successfully:', response.data);
            return response.data; // Return the created location data
        } else {
            console.error('Unexpected response:', response);
            throw new Error('Unexpected response from server');
        }
    } catch (error:any) {
        if (error.response) {
            // Handle different error codes
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized: Please log in to create a location.');
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to create a location.');
                    break;
                case 406:
                    console.error('Not Acceptable: Invalid request data.');
                    break;
                case 500:
                    console.error('Internal Server Error: Something went wrong on the server.');
                    //console.log(error.response);
                    break;
                default:
                    console.error('An unknown error occurred:', error.response);
            }
        } else {
            console.error('Network or other error:', error);
        }
        throw error; // Re-throw the error for further handling
    }
};
export const updateLocation = async (locationId:string, updatedData:any) => {
    const API_ENDPOINT = `http://localhost:8080/api/locations/${locationId}`;

    try {
        const formData = new FormData();

        // Append non-file data (if available)
        formData.append('locationId', locationId);
        formData.append('latitude', updatedData.latitude);
        formData.append('longitude', updatedData.longitude);
        formData.append('dateAndTimeOfObservation', updatedData.dateAndTimeOfObservation);
        formData.append('individualOrColony', updatedData.individualOrColony);
        formData.append('typeOfBuilding', updatedData.typeOfBuilding);
        if (updatedData.description) formData.append('description', updatedData.description);
        if (updatedData.flying) formData.append('flying', updatedData.flying);
        if (updatedData.moveOption) formData.append('moveOption', updatedData.moveOption);

        // Append the image file (if available)
        if (updatedData.image) {
            formData.append('image', updatedData.image);  // The field name 'image' must match what the backend expects
        }
        console.dir(formData,null);
        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        };

        const response = await axios.put(API_ENDPOINT, formData, { headers });

        if (response.status === 200) {
            console.log('Location updated successfully:', response.data);
            return response.data; // Return the updated location data
        } else {
            console.error('Unexpected response:', response);
            throw new Error('Unexpected response from server');
        }
    } catch (error:any) {
        if (error.response) {
            // Handle different error codes
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized: Please log in to update the location.');
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to update this location.');
                    break;
                case 404:
                    console.error('Not Found: The location does not exist.');
                    break;
                case 406:
                    console.error('Not Acceptable: Invalid request data.');
                    break;
                case 500:
                    console.error('Internal Server Error: Something went wrong on the server.');
                    break;
                default:
                    console.error('An unknown error occurred:', error.response);
            }
        } else {
            console.error('Network or other error:', error);
        }
        throw error; // Re-throw the error for further handling
    }
};
export async function fetchLocations() {
    const url = 'http://localhost:8080/api/locations'; // Replace with the actual API URL
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized: Please log in.');
            if (response.status === 403) throw new Error('Forbidden: You cannot access this resource.');
            if (response.status === 500) throw new Error('Server error. Please try again later.');
            throw new Error(`Unexpected error: ${response.statusText}`);
        }

        const locations = await response.json();
        console.log('Fetched locations:', locations);
        return locations; // Directly return the array as it is already in the desired format
    } catch (error:any) {
        console.error('Error fetching locations:', error.message);
        return null;
    }
}
export async function fetchLocationsByUser(userId: string) {
    const url = `http://localhost:8080/api/locations/user/${userId}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized: Please log in.');
            if (response.status === 403) throw new Error('Forbidden: You cannot access this resource.');
            if (response.status === 404) throw new Error('Not Found: The requested resource does not exist.');
            if (response.status === 500) throw new Error('Server error. Please try again later.');
            throw new Error(`Unexpected error: ${response.statusText}`);
        }

        const locations = await response.json();
        console.log('Fetched locations:', locations);
        return locations; // Return the fetched locations (array)

    } catch (error: any) {
        console.error('Error fetching locations:', error.message);
        return []; // Return an empty array in case of an error
    }
}
export async function fetchLocationsByUsername(userName: string) {
    const url = `http://localhost:8080/api/locations/username/${userName}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized: Please log in.');
            if (response.status === 403) throw new Error('Forbidden: You cannot access this resource.');
            if (response.status === 404) throw new Error('Not Found: The requested resource does not exist.');
            if (response.status === 500) throw new Error('Server error. Please try again later.');
            throw new Error(`Unexpected error: ${response.statusText}`);
        }

        const locations = await response.json();
        console.log('Fetched locations:', locations);
        return locations; // Return the fetched locations (array)

    } catch (error: any) {
        console.error('Error fetching locations:', error.message);

        return null;
    }
}
