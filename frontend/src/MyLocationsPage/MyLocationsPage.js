import React, {useEffect, useRef, useState} from "react";
import "../LandingPage/LandingPage.css";
import "./MyLocationsPage.css"
import MenuSideBar from "../MenuSideBar/MenuSideBar";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import {CiEdit, CiImageOn, CiTrash} from "react-icons/ci";
import "./ConfirmationDialog"
import ConfirmationDialog from "./ConfirmationDialog";
import {useNavigate} from 'react-router-dom';
import {deleteLocation, getMyLocations} from "../API/ApiCalls";
import mapProvider from "../MapPage/map-provider";
import MapOptions from "../MapPage/MapOptions";
import formatDateTime from "../Utils/DateFormat";
const MyLocationsPage = () => {
    const navigate = useNavigate();
    const center = {latit: 46.774399, longit: 23.600650};
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

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [idForDelete, setIdForDelete] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchLocations();
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchLocations = () => {
        return getMyLocations().then(fetchedLocations => setLocations(fetchedLocations));
    };

    const handleDelete = (id) => {
        setIsDialogOpen(true);
        setIdForDelete(id);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
        setIdForDelete(null);
    }

    const handleConfirm = async () => {
        setIsDialogOpen(false);
        const responseMessage = await deleteLocation(idForDelete);
        if(responseMessage==='OK'){
            setLocations((prevLocations) =>
                prevLocations.filter((location) => location.id !== idForDelete)
            );
        }
        console.log("Delete response: " + responseMessage);
    }

    const handleEdit = (index) => {
        const location = locations[index];
        navigate("/editLocation", {state: {location}});
    };

    return (
        <div className="homeWrapper">
            <MenuSideBar/>
            <div className="cardsContainer">
                {loading ? <div>Loading...</div> : locations.slice().reverse().map((location, index) => (
                    <div className="card" key={index}>
                        <div className="textAndButtonsGrouper">
                            <div className="textGrouper">
                                <p>
                                    <strong>Latitudine:</strong> {location.latitude}
                                </p>
                                <div className="divider"></div>
                                <p>
                                    <strong>Longitudine:</strong> {location.longitude}
                                </p>
                            </div>
                            <div id="editButtonDiv" onClick={() => handleEdit(index)}>
                                <CiEdit id="editIcon"></CiEdit>
                                <span>Editează</span>
                            </div>
                            <CiTrash id="deleteIcon" onClick={() => {
                                handleDelete(location.id)
                            }}></CiTrash>
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
            <MapContainer className="mapContainer" center={[center.latit, center.longit]} zoom={ZOOM_LEVEL} ref={mapRef}
                          minZoom={13} worldCopyJump maxBounds={bounds} maxBoundsViscosity={1.0}>
                <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
                {locations.map((location, index) => (
                    <Marker key={index} position={[location.latitude, location.longitude]}></Marker>
                ))}
            </MapContainer>
            <MapOptions onTileLayerChange={handleTileLayerChange} />
            <ConfirmationDialog
                show={isDialogOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default MyLocationsPage;