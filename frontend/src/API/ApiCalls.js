import axios from "axios";
import {processLocations} from "./utils";
import {getAuthToken} from "./Authentication";

export const deleteLocation = async(idForDelete) =>{
    try {
        const token = getAuthToken();
        const response = await axios.delete("/api/locations/" + idForDelete ,{headers:{Authorization: 'Bearer ' + token}});
        if(response.status===204){
            console.log("Location deleted successfully!");
            return 'OK';
        }
    }catch (e){
        return e.response.data.message;
    }
}

export const getAllLocations = async() =>{
    try{
        const token = getAuthToken();
        const response = await axios.get("/api/locations", {headers: {Authorization: 'Bearer ' + token}});
        if(response.status === 200){
            const locations = response.data;
            return processLocations(locations);
        } else {
            console.error("Failed to fetch locations. Status:", response.status);
            return [];
        }
    } catch (e){
        console.error("An error occurred while fetching locations:", e);
        return [];
    }
}

export const getMyLocations = async() =>{
    try{
        const token = getAuthToken();
        const username = localStorage.getItem("username");
        const response = await axios.get(`/api/locations/username/` + username, {headers: {Authorization: 'Bearer ' + token}});
        if(response.status === 200){
            const locations = response.data;
            return processLocations(locations);
        } else {
            console.error("Failed to fetch locations. Status:", response.status);
            return [];
        }
    } catch (e){
        console.error("An error occurred while fetching locations:", e);
        return [];
    }
}