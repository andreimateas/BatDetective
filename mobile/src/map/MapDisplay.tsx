import React, {useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import {IonPage} from '@ionic/react';
import './MapDisplay.css';
import { Geolocation } from '@capacitor/geolocation';
import {Marker, Popup} from "react-leaflet";
interface MapPageProps {
    coordinates: [number, number]; // Define the expected prop type
    location: string;
    user: string;
}
//Pagina asta nu mai e folosita in aplicatie
const MapPage: React.FC<MapPageProps> = ({ coordinates, location, user }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [latitude,setLatitude] = useState<number>(46.79492089032197);
    const [longitude,setLongitude] = useState<number>(23.45357653390393);
    // Initialize the map inside useIonViewDidEnter hook

    useEffect(() => {
        const initializeMap = async ()=> {
            if (mapContainerRef.current) {
                const position = await Geolocation.getCurrentPosition();
                setLatitude(coordinates[0]);
                setLongitude(coordinates[1]);
                // Initialize Leaflet map
                const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13); // Set initial position and zoom level

                // Add OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                // Add a marker to the map
                // L.marker([51.505, -0.09]).addTo(map).bindPopup('A sample marker').openPopup();

                // Clean up map when the component unmounts
                return () => {
                    map.remove();
                };
            }
        }
        initializeMap();
    },[]);

    return (
        <IonPage className="map-container">
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        </IonPage>
    );
};

export default MapPage;
