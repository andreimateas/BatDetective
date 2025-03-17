import React, {useEffect, useRef, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddCoordinatesForm from "../AddCoordinatesPage/AddCoordinatesForm";
import "../AddCoordinatesPage/CoordinatesPage.css"
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import mapProvider from "./map-provider";
import "../MapPage/MapPage.css"
import MapOptions from "./MapOptions";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPage = () => {
    const [markerPosition, setMarkerPosition] = useState(null);
    const [center, setCenter] = useState({lat: 46.76902781837645, lng: 23.597613573074344});
    const ZOOM_LEVEL = 16;
    const mapRef = useRef();
    const latMin = 46.73;
    const latMax= 46.83;
    const lngMin = 23.52;
    const lngMax = 23.7;
    const bounds = [
        //Cluj-Napoca
        [latMin, lngMin], // Sud-Vest
        [latMax, lngMax]  // Nord-Est
    ];

    const [tileLayer, setTileLayer] = useState({
        url: mapProvider.osm.url,
        attribution: mapProvider.osm.attribution,
    });

    const handleTileLayerChange = (url, attribution) => {
        setTileLayer({ url, attribution });
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat=position.coords.latitude;
                    const lng=position.coords.longitude;
                    setMarkerPosition({
                        lat: lat,
                        lng: lng,
                    });
                    setCenter({
                        lat: lat,
                        lng: lng,
                    })

                    if (mapRef.current) {
                        mapRef.current.flyTo([lat, lng], ZOOM_LEVEL);
                    }
                },
                (error) => {
                    alert(error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, []);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                updateMarker({lat,lng});
            },
        });
        return null;
    };

    const updateMarker = (value)=>{
        setMarkerPosition(value);
        if (mapRef.current) {
            mapRef.current.flyTo(value, ZOOM_LEVEL);
        }
    }

    return (
        <div className="add-location-div">
            <MenuSideBar/>
            <AddCoordinatesForm position={markerPosition} updateMarker={updateMarker}/>
            <MapContainer id="map-page" center={[center.lat, center.lng]} zoom={ZOOM_LEVEL} ref={mapRef} minZoom={13} worldCopyJump maxBounds={bounds} maxBoundsViscosity={1.0}>
                <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
                <MapClickHandler />
                {markerPosition && <Marker position={markerPosition}></Marker>}
            </MapContainer>
            <MapOptions onTileLayerChange={handleTileLayerChange} />
        </div>
    );
};

export default MapPage;