import {IonContent, IonPage, IonTitle} from '@ionic/react';
import './Home.css';
import React, {useEffect, useState} from "react";
import "./Home.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import SearchableMap from "../utils/SearchableMap";
import LocationList from "./LocationList";
import {getLocs} from "../utils/GetLocations";
import {fetchLocations} from "../api/BatColonyApi";
import LocationsMap from "../utils/LocationsMap";
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
// const allLocations: Location[] = await getLocs(null)
const Home: React.FC = () => {
    var allLocations:Location[] = useLocationContext().allLocations;
    const [latitude,setLatitude] = useState<number>(0);
    const [longitude,setLongitude] = useState<number>(0);
    const  defaultLocation={id:"",latitude:"46.1932",longitude:"24.96077",dateAndTimeOfAddingLocation:null,dateAndTimeOfObservation:null,image:null,
        description:"",flying:"",individualOrColony:"",moveOption:null,typeOfBuilding:"Residential",userId:""};

    const [locations, setLocations] = useState<Location[]>(allLocations);
    const [showMap,setShowMap] = useState<boolean>(false);
    useEffect(() => {
        setLocations(allLocations);
        setShowMap(true);

    }, [allLocations]);

    return (
    <IonPage>
        <IonContent className={"page-content"}>
            {/*<IonTitle className={"homeTitle"}>Welcome to your</IonTitle>*/}
            {/*<IonTitle className={"homeTitle2"}>Bat Detective account!</IonTitle>*/}

            {showMap ? (<LocationsMap allLocations={locations}></LocationsMap>) : (
                <p>Loading map...</p>
            )}
            <LocationList editable={false} allLocations={locations}></LocationList>


        </IonContent>
    </IonPage>
    );
};

export default Home;
