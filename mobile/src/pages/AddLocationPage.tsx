import React, {useState, useEffect, useRef, FormEvent} from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonToast,
    IonInput,
    IonTextarea,
    IonCard,
    IonIcon,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonList,
    IonModal,
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import "./AddLocationPage.css"
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {cloudUploadOutline} from "ionicons/icons";
import PhotoUpload from "../utils/PhotoUpload";
import {createLocation} from "../api/BatColonyApi";
import {LatLng, LatLngBounds, LatLngExpression} from "leaflet";
import {meta} from "eslint-plugin-react/lib/rules/jsx-props-no-spread-multi";
import description = meta.docs.description;
import * as colorette from "colorette";
import {useAddLocationContext} from "../utils/AddLocationContext"; // Import Camera from Capacitor


const AddCoordinates: React.FC = () => {
    const [latitude,setLatitude] = useState<number>(0);//Latitude value for map coords
    const [longitude,setLongitude] = useState<number>(0);//Latitude value for map coords
    const {triggerRefresh} = useAddLocationContext();
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showMap,setShowMap] = useState<boolean>(false);
    const [coord, setCoord] = useState<LatLngExpression>(new LatLng(46.79492089032197, 23.45357653390393));
    const latitudeFormRef = useRef<HTMLIonInputElement>(null);//Latitude value from form
    const longitudeFormRef = useRef<HTMLIonInputElement>(null);//Longitude value from form
    const [errorMessage,setErrorMessage] = useState<string|null>("Both latitude and longitude must be numbers");
    const [detailsOfColony, setDetailsOfColony] = useState<string>('');//Other details that user can give about the colony
    const [showDatetime, setShowDatetime] = useState<boolean>(false);
    const [imageSelected, setImageSelected] = useState<File|string|undefined|null>('');
    const [selectedDate, setSelectedDate] = useState<string>('');//Date of observation of colony
    const [selectedLocation, setSelectedLocation] = useState<string>('');//Location of the colony

    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
        colonie: false,
        individ: false,
        inZbor: false,
        intrand: false,
        iesind: false
    }); // Checked items

    // Fetch coordinates when the component mounts
    useEffect(() => {

        const getCoords=async ()=>{

            const fetchLocation = async () => {
                try {
                    const position = await Geolocation.getCurrentPosition();
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    //setLatitude(lat);
                    //setLongitude(lng);
                    setCoord([lat, lng]);
                } catch (error) {
                    console.error("Error fetching location:", error);

                }
            };

            fetchLocation();
            if(latitude == 0 && longitude == 0)
                setCoord([46.76907072354072,23.588684610512495])
            setShowMap(true);

        };
        getCoords();
        setShowMap(true);
    }, []);

    const validateCoordinates = (latitude: number, longitude: number) => {
        const lat = latitude;
        const lng = longitude;

        // Validate Latitude and Longitude
        if (isNaN(lat) || isNaN(lng)) {
            setErrorMessage("Both latitude and longitude must be valid numbers.");
            return false;
        }

        if (lat < -90 || lat > 90) {
            setErrorMessage("Latitude must be between -90 and 90.");
            return false;
        }

        if (lng < -180 || lng > 180) {
            setErrorMessage("Longitude must be between -180 and 180.");
            return false;
        }
        // If all conditions are met, clear error message and return true
        setErrorMessage(null);
        return true;
    };
    const handleMapClick = (event:any)=>{
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        if(latitudeFormRef.current && longitudeFormRef.current)
        {
            latitudeFormRef.current.value = lat;
            longitudeFormRef.current.value = lng;
        }
        setCoord([lat, lng]);


    }
    // Handle "Add Coordinates" button (if any additional action is required)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const latitude = parseFloat(latitudeFormRef.current?.value as string);
        const longitude = parseFloat(longitudeFormRef.current?.value as string);
        console.log(latitude, longitude);
        if(validateCoordinates(latitude,longitude)) {
            const coordinates = new LatLng(latitude,longitude);
            setCoord(coordinates);
            setToastMessage("Coordinates added successfully!");
            setShowToast(true);
        }
        else alert(errorMessage);
        console.log("trimite la server")
        console.log(latitude, longitude)
        console.log(detailsOfColony)
        console.log(imageSelected)
        console.log(selectedDate)
        console.log("Colonie",checkedItems['colonie'])
        console.log("Individ",checkedItems['individ'])
        console.log("Flying",checkedItems['inZbor'])
        console.log("Intrand",checkedItems['intrand'])
        console.log("Iesind",checkedItems['iesind'])
        console.log(selectedLocation)
        let individualOrColony:string;
        if(checkedItems['colonie'])
            individualOrColony ='Colonie'
        else
            individualOrColony ='Individ'
        let flying:string = "";
        if(checkedItems['inZbor'])
            flying = "Flying"
        let moveOption:string = ""
        if(checkedItems['intrand'])
            moveOption = "Entering"
        else moveOption  ="Exiting"

        const newLocation = {
            description: detailsOfColony,
            latitude:latitude,
            longitude:longitude,
            image:imageSelected,
            dateAndTimeOfObservation:selectedDate,
            individualOrColony:individualOrColony,
            flying:flying,
            moveOption:moveOption,
            typeOfBuilding:selectedLocation,

        };

        createLocation(newLocation)
            .then(data => {console.log('Location Created:', data);triggerRefresh();})
            .catch(err => console.error('Error Creating Location:', err));
        console.log("s-a trimis")
    };


    const handleDetailsChange = (event:any) => {
        if(event.target)
            setDetailsOfColony(event.target.value);
    };
    const handleDateChange = (detail:any)=>{
        setSelectedDate(detail.detail.value);
        setShowDatetime(false);


    }
    const handleInputFocus = () => {
        setShowDatetime(true);  // Show the datetime picker when input is focused
    };
    const handleSelection= (e:any)=>{
        setSelectedLocation(e);
    }
    const handleCheckboxChange = (key:string)=>{
        setCheckedItems((prevState)=>({
            ...prevState,
                [key]: !prevState[key],
        }));
        console.log(checkedItems);
    }
    const handleImage =(img: File | null) =>{
        console.log("A pus imaginea",img)
        setImageSelected(img)
       // console.log(imageSelected)
    }
    return (
        <IonPage>
            <IonContent className="page-content" >

            <h2>Adaugare locatie</h2>

                <form  onSubmit={handleSubmit} encType={"multipart/form-data"}>
                    <IonCard className={"Form"}>
                        <IonItem lines={"none"} style={{display:"flex",flexDirection:"column",alignItems:"stretch",overflow:"auto",height:"100%"}} >
                            <div className={"horizontalInputs"}>

                                <div>

                                <IonLabel style={{fontSize:"1.5rem", fontFamily:"Lora"}} className={"labels"} position="stacked">Latitude</IonLabel>
                                <IonInput className={"textFields"}
                                    name="latitude"
                                    ref={latitudeFormRef}
                                    placeholder="Latitudine"
                                    required
                                />
                                </div>
                                <div>

                                <IonLabel style={{fontSize:"1.5rem", fontFamily:"Lora"}} className={"labels"} position="stacked">Longitude</IonLabel>
                                <IonInput className={"textFields"}
                                    name="longitude"
                                    ref={longitudeFormRef}
                                    placeholder="Longitudine"
                                    required
                                />
                                </div>

                            </div>
                            <IonInput className={"textFields"}
                                      value={selectedDate}
                                      placeholder="Select a date"
                                      onIonFocus={handleInputFocus}
                                      readonly
                            />
                            <IonSelect
                                value={selectedLocation}
                                placeholder="Locatia"
                                onIonChange={(e) => handleSelection(e.detail.value)}
                            >
                                <IonSelectOption value="bloc_locuinte">Bloc locuinte</IonSelectOption>
                                <IonSelectOption value="parc">Parc</IonSelectOption>
                                <IonSelectOption value="cladire_birouri">Cladire birouri</IonSelectOption>
                            </IonSelect>

                            <IonList lines={"none"} style={{display:"flex",justifyContent:"space-between"}}>
                                <IonItem>
                                    <IonLabel style={{margin:"2px"}}>Colonie</IonLabel>
                                    <IonCheckbox
                                        checked={checkedItems.colonie}
                                        disabled={checkedItems.individ}
                                        onIonChange={() => handleCheckboxChange('colonie')}
                                    />
                                </IonItem>
                                <IonItem>
                                    <IonLabel style={{margin:"2px"}}>Individ</IonLabel>
                                    <IonCheckbox
                                        checked={checkedItems.individ}
                                        disabled={checkedItems.colonie}
                                        onIonChange={() => handleCheckboxChange('individ')}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel style={{margin:"2px"}}>In zbor</IonLabel>
                                    <IonCheckbox
                                        checked={checkedItems.inZbor}
                                        onIonChange={() => handleCheckboxChange('inZbor')}
                                    />
                                </IonItem>

                            </IonList>

                            <IonList lines = "none" style={{display:"flex",justifyContent:"space-between"}}>

                                <IonItem>
                                    <IonLabel style={{margin:"2px"}}>I-am vazut intrand</IonLabel>
                                    <IonCheckbox
                                        checked={checkedItems.intrand}
                                        disabled={checkedItems.iesind}
                                        onIonChange={() => handleCheckboxChange('intrand')}
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonLabel style={{margin:"2px"}}>I-am vazut iesind</IonLabel>
                                    <IonCheckbox
                                        checked={checkedItems.iesind}
                                        disabled={checkedItems.intrand}
                                        onIonChange={() => handleCheckboxChange('iesind')}
                                    />
                                </IonItem>
                            </IonList>

<div>
                        <PhotoUpload handleImage={handleImage}></PhotoUpload>
                            <IonItem lines={"none"}>
                                <IonLabel style={{  fontSize: "1.5rem", fontFamily:"Lora" }} className={"labels"} position="stacked">Alte informatii</IonLabel>
                                <IonInput type={"text"} className={"textFields"}
                                          value={detailsOfColony}
                                          onIonInput={handleDetailsChange}
                                          placeholder="Alte informatii"
                                />
                            </IonItem></div>
                        </IonItem>
    {showDatetime && (
        <IonModal className={"dateModal"} isOpen={showDatetime} onDidDismiss={() => setShowDatetime(false)}>
        <IonDatetime
            value={selectedDate}
            onIonChange={handleDateChange}
            cancelText="Cancel"
            doneText="Select"
        />
        </IonModal>
    )}



                </IonCard>

                <IonButton expand="block" type="button" onClick={handleSubmit}>
                    Salveaza
                </IonButton>
            </form>


                <h2>Your Location</h2>
                {showMap ? (
                    <div className="harta">
                        <MapContainer
                            center={[latitude, longitude]}
                             zoom={15}
                            style={{height: "100%", width: "100%",}}

                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapClickHandler onClick={handleMapClick}/>
                            <MapUpdater coordinates={coord}/>
                            <Marker position={coord}>
                                <Popup>
                                    This is a pin on the map.
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                ) : (
                    <p>Loading map...</p>
                )}
                <IonToast
                    isOpen={showToast}
                    message={toastMessage}
                    duration={2000}
                    onDidDismiss={() => setShowToast(false)}
                />

            </IonContent>
        </IonPage>
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

export default AddCoordinates;
