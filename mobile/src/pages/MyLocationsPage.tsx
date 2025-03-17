import React, {useState, useEffect, useRef} from 'react';
import {
    IonPage,
    IonContent,
    IonToast,
    IonSearchbar,
    IonToolbar,
    IonHeader,
    IonIcon,
    IonPopover,
    IonList,
    IonItem,
    IonLabel,
    IonModal,
    IonInput,
    IonTextarea, IonButton,
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import "./MyLocationsPage.css"
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {ellipsisVertical} from "ionicons/icons";
import LocationList from "../home/LocationList";
import {fetchLocationsByUser} from "../api/BatColonyApi";
import {getLocs} from "../utils/GetLocations";
import SearchableMap from "../utils/SearchableMap";
import {useRegistration} from "../utils/RegistrationContext";
import {useLocation} from "react-router-dom";
import LocationsMap from "../utils/LocationsMap";
import {jwtDecode} from "jwt-decode";
import {useAddLocationContext} from "../utils/AddLocationContext";
import {useLocationContext} from "../utils/LocationsContext";


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

// const token = localStorage.getItem("token");
// const decodedToken = jwtDecode(token? token:"");
// var allLocations: Location[] =await getLocs(decodedToken.sub? decodedToken.sub : null);
const MyLocationsPage: React.FC = () => {
    var allLocations = useLocationContext().userLocations;
    const { refresh } = useAddLocationContext();
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showMap,setShowMap] = useState<boolean>(false);
    const [locationList,setLocations] = useState<Location[]|null>(null);
    const [update,setUpdate] = useState<boolean>(false);
    // Function to fetch locations
    const fetchLocations = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token? token:"");
        const username =decodedToken.sub ? decodedToken.sub : null;
        if (username) {
            const fetchedLocations = await getLocs(username);
            setLocations(fetchedLocations);
            setShowMap(true);
        }
    };

    useEffect(() => {

        // if (location.pathname === '/myLocations') {
        //     fetchLocations(); // Trigger fetch when the route is '/myLocations'
        // }
        fetchLocations()
        setShowMap(true)
        setLocations(allLocations)
        console.log(update)
        console.log(refresh)
    }, [update,refresh]); // Runs whenever the location changes




    return (
         <IonPage>
            <IonContent className="page-content">

                {showMap ? (

                    <LocationsMap allLocations={locationList? locationList:allLocations}></LocationsMap>

                ) : (
                    <p>Loading map...</p>
                )}
                {locationList && locationList.length > 0 ? (
                <LocationList editable={true} allLocations={locationList? locationList:allLocations} update={update} setUpdate={setUpdate}></LocationList>
                ):(<div style={{display:"flex",flexDirection:"row", alignItems:"center",justifyContent:"center"}}>
                        <p>Loading list of locations</p>
                        <div className="spinner"></div>
                    </div> // Show the spinner while locations are being loaded
                    )}
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={2000}
                    onDidDismiss={() => setShowToast(false)}
                />

            </IonContent>
        </IonPage>


)



};

export default MyLocationsPage;