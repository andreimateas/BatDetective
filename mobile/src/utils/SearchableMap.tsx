import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonSearchbar, IonToolbar, IonTitle } from '@ionic/react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {LatLng, LatLngBounds} from 'leaflet';
import './SearchableMap.css'

// Fix the default icon issue with Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {Geolocation} from "@capacitor/geolocation";
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
interface Location {
    id: string,
    latitude: string;
    longitude: string;
    dateAndTimeOfAddingLocation:string|null;
    dateAndTimeOfObservation:string|null;
    image:File|string|null;
    description:string|null;
    flying:string|null;
    individualOrColony:string;
    moveOption:null;
    typeOfBuilding:string|null;
    userId:string;

}
// List of predefined locations
const locations = [
    { name: 'Centru', coords: [46.769379, 23.589954] },
    { name: 'Plopilor', coords: [46.768002, 23.572133] },
    { name: 'Zorilor', coords: [46.764649,23.587126] },
    { name: 'Marasti', coords: [46.772287, 23.602545] },
    { name: 'Mihai Viteazul', coords: [46.773876, 23.589199] },
];

interface MapProps{
    allLocations:Location[];
}
const SearchableMapWithDynamicSearch: React.FC<MapProps> = ({allLocations}) => {
    const [searchText, setSearchText] = useState('');
    const  defaultLocation={id:"",latitude:"46.77557731320677",longitude:"23.602768123414148",dateAndTimeOfAddingLocation:null,dateAndTimeOfObservation:null,image:null,
        description:"",flying:"",individualOrColony:"",moveOption:null,typeOfBuilding:"Residential",userId:""};
    const [selectedLocation, setSelectedLocation] = useState<Location>(defaultLocation);
    const [showMap,setShowMap] = useState(false);
    const [locations,setLocations] = useState<Location[]>(allLocations);
    const [userLatitude,setUserLatitude] = useState<string>("")
    const [userLongitude,setUserLongitude] = useState<string>("")
    // Dynamically update the map based on search input
    useEffect(() => {

        const getCoords=async ()=>{

            const fetchLocation = async () => {
                try {
                    const position = await Geolocation.getCurrentPosition();
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    defaultLocation.latitude = lat.toString();
                    //setUserLatitude(lat.toString());
                    //setUserLongitude(lng.toString());
                    defaultLocation.longitude = lng.toString();

                } catch (error) {
                    console.error("Error fetching location:", error);
                    // Fallback coordinates or logic
                }
            };

            fetchLocation();


        };
        getCoords();
        setShowMap(true);
        if (searchText) {
            const match = locations.find((location) =>
                location.id.toLowerCase().includes(searchText.toLowerCase())
            );
            if (match) {
                setSelectedLocation(match);
            } else {
                setSelectedLocation(defaultLocation); // Clear marker if no match is found
            }
        } else {
            setSelectedLocation(defaultLocation); // Clear marker if search is empty
        }
    }, [searchText]);

    return (

            <div>
                {/* Search Bar */}
                <div className="searchBar">
                <IonSearchbar  style={{'--border-radius': '10px'}}
                    value={searchText}
                    onIonChange={(e) => setSearchText(e.detail.value!)}
                    placeholder="Cauta locatie"
                    debounce={300}
                />
                </div>
                {/* Map */}
                <div className="harta2">
                    <MapContainer
                        center={[parseFloat(defaultLocation.latitude),parseFloat(defaultLocation.longitude)]} // Default center if no location selected
                        zoom={selectedLocation ? 13 : 13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* Marker for Selected Location */}
                        {searchText === '' && (locations.map((location, i) => {
                            const lat = parseFloat(location.latitude);
                            const lng = parseFloat(location.longitude);

                            if (!isNaN(lat) && !isNaN(lng)) {
                                return (
                                    <Marker key={i} position={[lat, lng]}>
                                        <Popup>
                                            Lat: {lat}, Lng: {lng}
                                        </Popup>
                                    </Marker>
                                );
                            }
                            return null;
                        }))}
                        {/*{selectedLocation && (*/}
                        {/*    <Marker position={[parseFloat(selectedLocation.latitude), parseFloat(selectedLocation.longitude)]}>*/}
                        {/*        <Popup>*/}
                        {/*            {selectedLocation.id} <br />*/}
                        {/*            Latitude: {parseFloat(selectedLocation.latitude)} <br />*/}
                        {/*            Longitude: {parseFloat(selectedLocation.longitude)}*/}
                        {/*        </Popup>*/}
                        {/*    </Marker>*/}
                        {/*)}*/}
                        {userLatitude && (
                            <MapUpdater coordinates={[parseFloat(userLatitude), parseFloat(userLongitude)]}/>)}


                    </MapContainer>
                </div>
            </div>

    );
};
const MapUpdater: React.FC<{ coordinates: number[] }> = ({coordinates}) => {
    const map = useMap();
    const currentZoom = map.getZoom()
    useEffect(() => {
        // var bounds=[[47.17016170759973, 23.89837227659752],  // Northeast corner
        //     [46.58236746050045, 22.85762591671522]]
        const bounds = new LatLngBounds(new LatLng(46.58236746050045, 22.85762591671522), new LatLng(47.17016170759973, 23.89837227659752));
        map.setMaxBounds(bounds);
        map.setMinZoom(13);
        map.setView([coordinates[0], coordinates[1]], currentZoom);
    }, [coordinates, map]);
    return null;
};
export default SearchableMapWithDynamicSearch;
