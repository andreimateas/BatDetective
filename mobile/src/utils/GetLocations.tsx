import {fetchLocations, fetchLocationsByUser, fetchLocationsByUsername} from "../api/BatColonyApi";
interface Location {
    id: string,
    latitude: string;
    longitude: string;
    dateAndTimeOfAddingLocation:string|null;
    dateAndTimeOfObservation:string|null;
    image:string|null;
    description:string;
    flying:string|null;
    individualOrColony:string;
    moveOption:null;
    typeOfBuilding:string|null;
    userId:string;

}
//Retrieves locations from server using one api endpoint or the other,depending on the value of userId
// export const getLocs = (userName: string | null): Promise<Location[]> => {
//     // Fetch data based on userId or return all locations
//     return new Promise<Location[]>((resolve) => {
//         if (userName) {
//             // Filter locations by userId if available
//             console.log(userName);
//             resolve(fetchLocationsByUsername(userName));
//         } else {
//             // Return all locations if no userId
//             console.log(userName);
//             resolve(fetchLocations());
//         }
//     });
// };
export const getLocs = async (userName: string | null) => {
    try {
        if (userName) {
            console.log(`Fetching locations for user: ${userName}`);
            let list = await fetchLocationsByUsername(userName);

            // Retry logic dacă lista este null
            let retryCount = 0;
            while (list == null && retryCount < 10) {  // Limitează numărul de încercări
                console.log(`Retrying to fetch locations for user: ${userName}... Attempt #${retryCount + 1}`);
                await new Promise(resolve => setTimeout(resolve, 3000));  // Așteaptă 3 secunde
                list = await fetchLocationsByUsername(userName);  // Încearcă din nou

                retryCount++;
            }

            if (list != null) {
                return list;  // Returnează locațiile obținute
            } else {
                console.error("Failed to fetch user-specific locations after retries");
                return [];  // Returnează un array gol dacă nu s-au obținut locații
            }
        } else {
            // Dacă nu există userName, obține toate locațiile
            console.log("Fetching all locations");
            let list = await fetchLocations();

            // Retry logic pentru toate locațiile
            let retryCount = 0;
            while (list == null && retryCount < 3) {  // Limitează numărul de încercări
                console.log(`Retrying to fetch all locations... Attempt #${retryCount + 1}`);
                await new Promise(resolve => setTimeout(resolve, 3000));  // Așteaptă 3 secunde
                list = await fetchLocations();  // Încearcă din nou să obții toate locațiile
                retryCount++;
            }

            if (list != null) {
                return list;  // Returnează locațiile obținute
            } else {
                console.error("Failed to fetch all locations after retries");
                return [];  // Returnează un array gol dacă nu s-au obținut locații
            }
        }
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];  // Returnează un array gol în cazul în care apare o eroare
    }
};

