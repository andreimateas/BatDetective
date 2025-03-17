import React, {useEffect, useRef, useState} from "react";
import "./LandingPage.css";
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import { CiImageOn } from "react-icons/ci";
import {getAllLocations} from "../API/ApiCalls";
import mapProvider from "../MapPage/map-provider";
import "../MapPage/MapPage.css"
import MapOptions from "../MapPage/MapOptions";
import formatDateTime from "../Utils/DateFormat";

const LandingPage = () => {
    const center = {latit: 46.774399, longit: 23.600650};
    const ZOOM_LEVEL = 13;
    const mapRef = useRef();
    const [tileLayer, setTileLayer] = useState({
        url: mapProvider.osm.url,
        attribution: mapProvider.osm.attribution,
    });

    const handleTileLayerChange = (url, attribution) => {
        setTileLayer({ url, attribution });
    };

    const latMin = 46.73;
    const latMax= 46.83;
    const lngMin = 23.52;
    const lngMax = 23.7;
    const bounds = [
        //Cluj-Napoca
        [latMin, lngMin], // Sud-Vest
        [latMax, lngMax]  // Nord-Est
    ];
    const [locations,setLocations] = useState([]);

    const fetchLocations = () =>{
        getAllLocations().then(fetchedLocations => setLocations(fetchedLocations));
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <div className="homeWrapper">
            <MenuSideBar/>
            <div className="cardsContainer">
                {locations.map((location, index) => (
                    <div className="card" key={index}>
                        <div className="textGrouper">
                            <p>
                                <strong>Latitudine:</strong> {location.latitude}
                            </p>
                            <div className="divider"></div>
                            <p>
                                <strong>Longitudine:</strong> {location.longitude}
                            </p>
                        </div>

                        <div>
                            {location.description && <p className="location-description"><strong>Descriere: </strong>{location.description}</p>}

                            <div className="location-status">
                                <p><strong>Am văzut: </strong>{location.individualOrColony === "Colony" ? "Colonie" : "Individ"}</p>
                                {location.flying && <p><strong>Stare: </strong>În zbor</p>}
                                {location.moveOption && (
                                    <p><strong>Stare: </strong>{{
                                        "Standing": "Stând",
                                        "Entering": "Intrând",
                                        "Exiting": "Ieșind"
                                    }[location.moveOption]}</p>
                                )}
                            </div>

                            {location.typeOfBuilding && <p><strong>Tip Clădire: </strong>{location.typeOfBuilding}</p>}
                        </div>

                        {location.image && (
                            <div className="imageWrapper">
                                <CiImageOn className="homePageIcon"/>
                                <a
                                    href="photo"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newWindow = window.open('', '_blank');
                                        newWindow.document.write(`<img src="data:image/png;base64,${location.image}" alt="Previzualizare imagine" />`);
                                        newWindow.document.close();
                                    }}
                                    className="link"
                                >
                                    Previzualizează
                                </a>
                            </div>
                        )}
                        {location.dateAndTimeOfObservation && (
                            <span id="timeSpan"><i>{"Data observării: " + formatDateTime(location.dateAndTimeOfObservation)}</i></span>
                        )}
                        <br/>
                        {location.dateAndTimeOfAddingLocation && (
                            <span id="timeSpan"><i>{"Adaugată la " + formatDateTime(location.dateAndTimeOfAddingLocation)}</i></span>
                        )}
                    </div>
                ))}
            </div>
            <MapContainer className="mapContainer" center={[center.latit, center.longit]} zoom={ZOOM_LEVEL} ref={mapRef} minZoom={13} worldCopyJump maxBounds={bounds} maxBoundsViscosity={1.0}>
                <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />

                {locations.map((location, index) =>(
                    <Marker key={index} position = {[location.latitude,location.longitude]}></Marker>
                ))}
            </MapContainer>
            <MapOptions onTileLayerChange={handleTileLayerChange} />
        </div>
    );
};

export default LandingPage;