import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import AddCoordinatesForm from "../AddCoordinatesPage/AddCoordinatesForm";
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import "../AddCoordinatesPage/CoordinatesPage.css"
import "../MapPage/MapPage.css"
import mapProvider from "../MapPage/map-provider";
import MapOptions from "../MapPage/MapOptions";
import EditCoordinatesForm from "./EditCoordinatesForm";


const EditLocationPage = () => {
    const { state } = useLocation();
    const location = state?.location || {};

    const [lat, setLat] = useState(location.latitude || 0);
    const [lng, setLng] = useState(location.longitude || 0);
    const [center, setCenter] = useState({lat: lat, lng: lng});

    const [markerPosition, setMarkerPosition] = useState(center);
    const ZOOM_LEVEL = 13;
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
                setLat(lat);
                setLng(lng);
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
        <div className="add-location-div" >
            <MenuSideBar />
            <EditCoordinatesForm
                id={location.id}
                position={markerPosition}
                updateMarker={updateMarker}
                initialDescription={location.description}
                initialImg={location.image}
                initialDate={location.dateAndTimeOfObservation}
                initialBatTypeOption={location.individualOrColony}
                initialFlyOption={location.flying}
                initialMoveOption={location.moveOption}
                initialPlaceOption={location.typeOfBuilding}
            />
            <MapContainer id="map-page" center={[lat, lng]} zoom={ZOOM_LEVEL} ref={mapRef} minZoom={13} worldCopyJump maxBounds={bounds} maxBoundsViscosity={1.0}>
                <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
                <MapClickHandler />
                {markerPosition && <Marker position={markerPosition}></Marker>}
            </MapContainer>
            <MapOptions onTileLayerChange={handleTileLayerChange} />
        </div>
    );
};

export default EditLocationPage;
