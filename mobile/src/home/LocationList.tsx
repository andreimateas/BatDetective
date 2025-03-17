import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonCard,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonIcon,
    IonPopover,
    IonModal,
    IonInput,
    IonTextarea,
    IonButton,
} from '@ionic/react';
import {ellipsisVertical} from "ionicons/icons";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {deleteLocation, fetchLocations, fetchLocationsByUser, updateLocation} from "../api/BatColonyApi"
import PhotoUpload from "../utils/PhotoUpload";
import {LatLng, LatLngBounds, LatLngExpression} from "leaflet";
import {getLocs} from "../utils/GetLocations";
import {useAddLocationContext} from "../utils/AddLocationContext";
import {all} from "axios";
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


interface LocationListProps {
    editable: boolean; // Accept the `editable` prop
    allLocations: Location[]
    update?:boolean
    setUpdate?: Dispatch<SetStateAction<boolean>>
}

const LocationList: React.FC<LocationListProps> =  ({editable,allLocations,update,setUpdate}) => {
    const  defaultLocation={id:"",latitude:"46.1932",longitude:"24.96077",dateAndTimeOfAddingLocation:null,dateAndTimeOfObservation:null,image:"",
        description:"",flying:"",individualOrColony:"",moveOption:null,typeOfBuilding:"Residential",userId:""};
    //console.log(allLocations)
    const [locations, setLocations] = useState<Location[]>(allLocations); // Start with the first 2

    const [imageSelected,setImageSelected] = useState<File|null|string>(new File([], 'photo.png', { type: 'image/png' }));
    const [hasMore, setHasMore] = useState(true); // Tracks if more data is available
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(-1);
    const [selectedLocation, setSelectedLocation] = useState<Location>(defaultLocation);
    const [mapCoords,setCoords] =  useState<LatLngExpression>(new LatLng(0,0));
    const [newDetails, setNewDetails] = useState<string|null>(null);
    const [newLatitude, setNewLatitude] = useState<string>("");
    const [newLongitude, setNewLongitude] = useState<string>("");
    const [index,setIndex] = useState<number>(0);
    const [popoverState, setPopoverState] = useState<{
        show: boolean;
        event: React.MouseEvent | undefined;
        index: number ;
    }>({ show: false, event: undefined, index: -1 });
    useEffect(() => {
        setLocations(allLocations);
    }, [allLocations]);
    const handleOpenPopover = (event: React.MouseEvent, index: number) => {
        event.persist();
        setPopoverState({ show: true, event, index });
    };

    const handleClosePopover = () => {
        setPopoverState({ show: false, event: undefined, index: -1 });
    };
    const loadMoreLocations = (event: CustomEvent<void>) => {
        setTimeout(() => {
            const nextLocations = allLocations.slice(locations.length, locations.length + 5); // Load next 5 items
            setLocations((prevLocations) => [...prevLocations, ...nextLocations]);

            // Check if we've loaded all locations
            if (locations.length + nextLocations.length >= allLocations.length) {
                setHasMore(false); // No more items to load
            }

            // Complete the infinite scroll event
            (event.target as HTMLIonInfiniteScrollElement).complete();
        }, 1000); // Simulate network delay
    };
    const handleEdit = (index: number) => {
        console.log("Index "+index)
        setSelectedLocation(allLocations[index]);
        setCoords(new LatLng(parseFloat(allLocations[index].latitude), parseFloat(allLocations[index].longitude)))
        setNewLongitude(allLocations[index].longitude)
        setNewLatitude(allLocations[index].latitude)
        setSelectedLocationIndex(index);
        setShowEditModal(true);
        setIndex(index);
        handleClosePopover();
    };
    const handleDelete = () => {
        setShowDeleteModal(true);
        setSelectedLocationIndex(popoverState.index);
        handleClosePopover();
    };
    const confirmDelete = async () => {
        if (selectedLocationIndex !== null) {
            const colonyId = locations[selectedLocationIndex].id;
            console.log("Deleting location:", locations[selectedLocationIndex]);

            try {
                // Call the API to delete the colony
                await deleteLocation(colonyId)
                    .then(()=>{
                    if(setUpdate)
                    {
                        setUpdate(!update);
                    }
                    });

                // Remove the deleted location from the local state
                //const updatedLocations = locations.filter((_, index) => index !== selectedLocationIndex);
                //setLocations(updatedLocations);

                console.log("Colony deleted and local state updated.");
            } catch (error) {
                console.error("Failed to delete colony:", error);
            }
        }
        setShowDeleteModal(false);
    };

    const handleSave = () => {
        console.log("Save changes:", selectedLocation);
        console.log("Selected location:", selectedLocationIndex);
        const colonyId = locations[selectedLocationIndex].id;
        console.log(selectedLocation.id)
        console.log(selectedLocation.latitude,selectedLocation.longitude);
        console.log(selectedLocation.description);
        console.log(selectedLocation.image);
        console.log(selectedLocation.dateAndTimeOfAddingLocation);
        console.log(selectedLocation.individualOrColony);
        console.log(selectedLocation.flying);
        console.log(selectedLocation.moveOption);
        const updatedLocationData = {
            id: selectedLocation.id,
            description: newDetails,
            latitude: newLatitude,
            longitude: newLongitude,
            image: imageSelected? imageSelected: selectedLocation.image,
            dateAndTimeOfObservation: selectedLocation.dateAndTimeOfObservation,
            dateAndTimeOfAddingLocation : selectedLocation.dateAndTimeOfAddingLocation,
            individualOrColony: selectedLocation.individualOrColony,
            flying: selectedLocation.flying,
            moveOption: selectedLocation.moveOption,
            typeOfBuilding: selectedLocation.typeOfBuilding,
            userId:selectedLocation.userId
        };
        console.log("Se trimite cererea pentru update",updatedLocationData);

        updateLocation(colonyId, updatedLocationData)
            .then(data => {console.log('Location Updated:', data);
                if (setUpdate) {
                    setUpdate(!update);
                }})
            .catch(err => console.error('Error Updating Location:', err));
        console.log("S-a trimis cererea pentru update")

        locations[index].latitude = updatedLocationData.longitude;
        locations[index].longitude = updatedLocationData.latitude;
        setShowEditModal(false);
    };
    const handleNewImage=async (img: File | null)=>
    {
        console.log(img)
        setImageSelected(img)
        // console.log(imageSelected)

    }
    const handleMapClick = (event:any)=>{
        console.log("Click")
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        selectedLocation.latitude = lat;
        selectedLocation.longitude = lng;
        setNewLatitude(lat)
        setNewLongitude(lng)
        setCoords([lat,lng])

    }
    return (<div>
            <p>Lista locatiilor</p>
            <IonList style={{background:"#B9BDC1"}}>
                {locations.map((location, index) => (
                    <IonCard key={index} style={{ borderRadius: '15px', marginBottom: '10px' }}>
                        <IonCardContent>
                            <IonLabel>
                                <IonText>
                                    <strong>Latitudine:</strong> {location.latitude}
                                </IonText>{' '}
                                |{' '}
                                <IonText>
                                    <strong>Longitudine:</strong> {location.longitude}
                                </IonText>
                            </IonLabel>
                            <IonText color="medium">
                                <p>Adăugată la {location.dateAndTimeOfAddingLocation}</p>
                            </IonText>
                            {/* Menu Icon */}
                            {editable ?(<IonIcon
                                    icon={ellipsisVertical}
                                    slot="end"
                                    className="menu-icon"
                                    style={{
                                        fontSize: "20px",
                                        position: "absolute",
                                        top: "16px",
                                        right: "16px",
                                        cursor: "pointer",
                                    }}
                                    onClick={(event) => handleOpenPopover(event, index)}
                                />
                            ) : null}
                        </IonCardContent>
                    </IonCard>
                ))}

            </IonList>
            {/* Popover for Edit/Delete */}
            <IonPopover
                isOpen={popoverState.show}
                event={popoverState.event}
                onDidDismiss={handleClosePopover}
            > <IonList>
                {editable && (
                    <IonItem button onClick={() => handleEdit(popoverState.index!)}>
                        <IonLabel>Edit</IonLabel>
                    </IonItem>
                )}
                <IonItem button onClick={handleDelete}>
                    <IonLabel>Delete</IonLabel>
                </IonItem>
            </IonList>
            </IonPopover>
            {/* Edit Modal */}
            <IonModal className={"modalStyle"} isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
                <div style={{padding: "16px"}}>
                    <h2>Editare locație</h2>
                    <div style={{display: "flex", gap: "16px", marginBottom: "16px"}}>
                        <IonInput className={"modalStyleIonInput"}
                                  placeholder="Latitudine"
                                  value={selectedLocation.latitude}
                                  onIonInput={(e) => {
                                      if (e.detail.value)
                                          setNewLatitude(e.detail.value);
                                  }
                                  }
                        />
                        <IonInput className="modalStyleIonInput"
                                  placeholder="Longitudine"
                                  value={selectedLocation.longitude}
                                  onIonInput={(e) => {
                                      if (e.detail.value)
                                          setNewLongitude(e.detail.value);
                                  }
                                  }
                        />
                    </div>
                    {/*<IonInput className="modalStyleIonInput"*/}
                    {/*          placeholder="image.png"*/}
                    {/*          value={selectedLocation?.image || ""}*/}
                    {/*          onIonChange={(e) =>*/}
                    {/*              setSelectedLocation({*/}
                    {/*                  ...selectedLocation!,*/}
                    {/*                  image: e.detail.value!,*/}
                    {/*              })*/}
                    {/*          }*/}
                    {/*          style={{ marginBottom: "16px" }}*/}
                    {/*/>*/}
                    <IonItem style={{border: "1px solid black", borderRadius: "10px"}}>
                        <PhotoUpload handleImage={handleNewImage} alreadyUploaded={true}
                                     image={allLocations[index]? allLocations[index].image:""}></PhotoUpload>
                    </IonItem>

                    <IonTextarea className="modalStyleIonInput"
                                 placeholder="Alte informații"
                                 value={selectedLocation.description}
                                 onIonInput={(e: any) => {
                                     setNewDetails(e.detail.value)
                                 }
                                 }
                                 style={{marginBottom: "16px"}}
                    />
                    <IonButton expand="block" onClick={handleSave}>
                        Salvează
                    </IonButton>
                    <MapContainer
                        center={mapCoords}
                        zoom={12}
                        style={{height: "100%", width: "100%",}}
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/*<Marker position={mapCoords}>*/}
                        {/*    <Popup>*/}
                        {/*        This is a pin on the map.*/}
                        {/*    </Popup>*/}
                        {/*</Marker>*/}
                        <Marker
                            position={mapCoords}
                        >
                            <Popup>
                                Location : ({selectedLocation.latitude}, {selectedLocation.longitude})
                            </Popup>
                        </Marker>
                        <MapClickHandler onClick={handleMapClick}/>
                        <MapUpdater coordinates={mapCoords}/>

                    </MapContainer>

                    <IonButton onClick={()=>{setShowEditModal(false)}} >
                        Close
                    </IonButton>
                </div>
            </IonModal>
            {/* Delete Confirmation Modal */}
            <IonModal
                isOpen={showDeleteModal}
                onDidDismiss={() => setShowDeleteModal(false)}
                className="smallModal"
            >
                <div style={{overflow:"scroll",display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",alignItems:"center", padding: "16px", textAlign: "center" }}>
                    <h2>Confirm Delete</h2>
                    <p>Esti sigur ca vrei sa stergi aceasta locatie?Actiunea este ireversibila si vei pierde accesul la locatie.</p>
                    <div style={{ display: "flex",flexWrap:"wrap", justifyContent: "space-around", marginTop: "16px" }}>
                        <IonButton style={{width:"45%",textTransform:"capitalize","--background":"#F24822", "--border-radius":"20px"}} onClick={confirmDelete}>
                            Sterge
                        </IonButton>
                        <IonButton style={{width:"45%",textTransform:"capitalize","--background":"white",color:"black","--border-radius":"20px"}} onClick={() => setShowDeleteModal(false)}>Anuleaza</IonButton>
                    </div>
                </div>
            </IonModal>
            <IonInfiniteScroll
                threshold="100px"
                onIonInfinite={loadMoreLocations}
                disabled={!hasMore} // Disable if no more items to load
            >
                <IonInfiniteScrollContent
                    loadingSpinner="bubbles"
                    loadingText="Se încarcă mai multe locații..."
                ></IonInfiniteScrollContent>
            </IonInfiniteScroll>
        </div>

    );
};

const MapClickHandler: React.FC<{ onClick: (event: any) => void }> = ({onClick}) => {
    const map = useMap(); // This gives you access to the map instance

    useEffect(() => {
        // Register the map click event
        const handleClick = (event: any) => {
            onClick(event);
        };

        // Attach event listener for map clicks
        map.on('click', handleClick);

        // Clean up the event listener when the component is unmounted or map changes
        return () => {
            map.off('click', handleClick);
        };
    }, [map, onClick]);

    return null; // This component doesn't render anything, it only listens to the map events
};
const MapUpdater: React.FC<{ coordinates: LatLngExpression }> = ({coordinates}) => {
    const map = useMap();
    const currentZoom = map.getZoom()
    useEffect(() => {
        // var bounds=[[47.17016170759973, 23.89837227659752],  // Northeast corner
        //     [46.58236746050045, 22.85762591671522]]
        const bounds = new LatLngBounds(new LatLng(46.58236746050045, 22.85762591671522), new LatLng(47.17016170759973, 23.89837227659752));
        map.setMaxBounds(bounds);
        map.setMinZoom(13);
        map.setView(coordinates, currentZoom);
    }, [coordinates, map]);
    return null;
};
export default LocationList;
