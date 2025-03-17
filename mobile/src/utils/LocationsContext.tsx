import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";
import {getLocs} from "./GetLocations";
interface Location {
    id: string,
    latitude: string;
    longitude: string;
    dateAndTimeOfAddingLocation:string|null;
    dateAndTimeOfObservation:string|null;
    image:string|null;
    description:string|null;
    flying:string|null;
    individualOrColony:string;
    moveOption:null;
    typeOfBuilding:string|null;
    userId:string;
}
interface LocationsContextProps {
    allLocations: Location[];
    setLocations: (newLocations: Location[]) => void;
    userLocations: Location[];
    setULocations: (newLocations: Location[]) => void;
}

const LocationsContext = createContext<LocationsContextProps | undefined>(undefined);
export {LocationsContext};
export const LocationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allLocations, setAllLocations] = useState<Location[]>([]);
    const [userLocations, setULocations] = useState<Location[]>([]);

    // Funcție pentru a actualiza locațiile globale
    const setLocations = (newLocations: Location[]) => {
        setAllLocations(newLocations);
    };


    const setUserLocations = (newLocations: Location[]) => {
        setULocations(newLocations);
    };
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                console.log("trying")
                // Obține tokenul din localStorage
                const token = localStorage.getItem("token");

                // Obține toate locațiile
                const allLocs = await getLocs(null);
                setAllLocations(allLocs);

                const decodedToken: any = jwtDecode(token? token:"");

                // Obține locațiile utilizatorului
                const userLocs = await getLocs(decodedToken.sub);
                setUserLocations(userLocs);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setTimeout(() => {
                    fetchLocations();
                }, 3000);
            }
        };
        console.log("wowowow")
        fetchLocations();
    }, []); // Se execută o singură dată la montare

    return (
        <LocationsContext.Provider value={{ allLocations, setLocations, userLocations, setULocations }}>
            {children}
        </LocationsContext.Provider>
    );
};

// Custom hook pentru utilizarea contextului
 export const useLocationContext = () => {
    const context = useContext(LocationsContext);
    if (!context) {
        throw new Error("useLocationContext must be used within a LocationsProvider");
    }
    return context;
};