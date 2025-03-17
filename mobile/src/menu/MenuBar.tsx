import React, {useState} from "react";
import {IonIcon, IonLabel, IonSegment, IonSegmentButton, IonToolbar} from "@ionic/react";
import {useHistory} from "react-router";
import "./MenuBar.css";
import {barChart, homeOutline, locate, location} from "ionicons/icons";

const MenuBar: React.FC = () => {

    const history=useHistory();
    const [selectedSegment, setSelectedSegment] = useState<string>(sessionStorage.getItem('menuBar') || "home");

    const handleSegmentChange = (event: CustomEvent) => {
        const selectedValue = event.detail.value;
        if (selectedValue) {
            setSelectedSegment(selectedValue);
            sessionStorage.setItem('menuBar',selectedValue);
            history.push(`/${selectedValue}`);
        }
    };

    return (

        <IonToolbar class={"menuToolbar"}>
            <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
                <IonSegmentButton value="home">
                    <IonIcon icon={homeOutline}></IonIcon>
                    <IonLabel>Acasa</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="addLocation">
                    <IonIcon icon={locate}></IonIcon>
                    <IonLabel>Adauga locatie</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="myLocations">
                    <IonIcon icon={location}></IonIcon>
                    <IonLabel>Locatiile mele</IonLabel>
                </IonSegmentButton>
                {(localStorage.getItem("role") === "ADMIN") !== (localStorage.getItem("role") === "RESEARCHER") &&
                    <IonSegmentButton value="reportsPage">
                        <IonIcon icon={barChart}></IonIcon>
                        <IonLabel>Rapoarte</IonLabel>
                    </IonSegmentButton>}
            </IonSegment>
        </IonToolbar>

    );
};

export default MenuBar;