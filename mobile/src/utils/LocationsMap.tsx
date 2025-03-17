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
import * as sea from "node:sea";
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


interface MapProps{
    allLocations:Location[];
}
const LocationsMap: React.FC<MapProps> = ({allLocations}) => {
    const [searchText, setSearchText] = useState('');
    const  defaultLocation={id:"",latitude:"46.769379",longitude:"23.5899542",dateAndTimeOfAddingLocation:null,dateAndTimeOfObservation:null,image:null,
        description:"",flying:"",individualOrColony:"",moveOption:null,typeOfBuilding:"Residential",userId:""};
    const [selectedLocation, setSelectedLocation] = useState<Location>(defaultLocation);
    const [showMap,setShowMap] = useState(false);
    const [locations,setLocations] = useState<Location[]>(allLocations);
    const [userLatitude,setUserLatitude] = useState<string>("")
    const [userLongitude,setUserLongitude] = useState<string>("")

    // Dynamically update the map based on search input
    useEffect(() => {


        setLocations(allLocations)
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
    }, [allLocations,searchText]);


    return (

        <div>
            {/* Search Bar */}
            <div className="searchBar">
                <IonSearchbar  style={{'--border-radius': '10px'}}
                               value={searchText}
                               onIonInput={(e) => setSearchText(e.detail.value!)}
                               placeholder="Cauta locatie"
                               debounce={1000}
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
                    {(locations.map((location, i) => {
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

                        <MapUpdater coordinates={[parseFloat(defaultLocation.latitude), parseFloat(defaultLocation.longitude)]} allLocations={allLocations} />
                    {searchText != '' && <MapSearch searchTerm={searchText}></MapSearch>}

                </MapContainer>
            </div>
        </div>

    );
};

const RefreshMap:React.FC = () => {
    const map = useMap(); // Get the Leaflet map instance

    useEffect(() => {
        // Example: Automatically refresh after 1 second
        setTimeout(() => {
            if (map) {
                map.invalidateSize(); // Refresh the map
            }
        }, 1000);
    }, []);
    return null;
};



interface MapSearchProps{
    searchTerm:string|number|boolean
}
const MapSearch:React.FC<MapSearchProps> =  (searchTerm) => {
    let map = useMap();
    const [marker, setMarker] = useState<L.Marker | null>(null);
    let [lastSearch, setLastSearch] = useState<string | number | boolean>("");
    const fetchSearch = async()=> {
        if (!searchTerm) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchTerm.searchTerm
                )}`
            );
            const results = await response.json();

            if (results.length > 0) {
                const {lat, lon, display_name} = results[0];
                // Move the map to the searched location
                map.setView([lat, lon], 15);

                // Add or update marker

                    // const newMarker = L.marker([lat, lon])
                    //     .addTo(map)
                    //     .bindPopup(display_name)
                    //     .openPopup();
                    // newMarker.setPopupContent(display_name)
                    // setMarker(newMarker);


            } else {
                alert('Location not found!');
            }
        } catch (error) {

            console.error('Error fetching location:', error);
        }
    }
    if (searchTerm.searchTerm !== lastSearch) {
        console.log({ searchTerm });
        fetchSearch()
        setLastSearch(searchTerm.searchTerm);

        // Call API here
    }

    return null;
};

const MapUpdater: React.FC<{ coordinates: number[],allLocations:Location[] }> = ({coordinates,allLocations}) => {
    const map = useMap();
    const currentZoom = map.getZoom()
    useEffect(() => {
        // var bounds=[[47.17016170759973, 23.89837227659752],  // Northeast corner
        //     [46.58236746050045, 22.85762591671522]]
        const bounds = new LatLngBounds(new LatLng(46.58236746050045, 22.85762591671522), new LatLng(47.17016170759973, 23.89837227659752));
        map.setMaxBounds(bounds);
        map.setMinZoom(13);
        map.setView([coordinates[0], coordinates[1]], currentZoom);
    }, [coordinates, map, allLocations]);
    return null;
};
export default LocationsMap;
