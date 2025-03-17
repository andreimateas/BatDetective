import React, {FormEvent, useEffect, useState} from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonBadge,
    IonItem, IonModal, IonButtons, IonIcon, IonCard, IonInput, IonDatetime,
} from '@ionic/react';
import {useLocationContext} from "../utils/LocationsContext";

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
const Reports: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [showStartDatetime, setShowStartDatetime] = useState<boolean>(false);
    const [showEndDatetime, setShowEndDatetime] = useState<boolean>(false);
    const [locationSet,setLocation] = useState<string>('');
    const {allLocations} = useLocationContext();
    const handleStartDateChange = (e: any) => {
        setSelectedStartDate(e.detail.value);
        setShowStartDatetime(false);
    };
    const handleEndDateChange = (e:any) =>{
        setSelectedEndDate(e.detail.value);
        setShowEndDatetime(false);
    }

    useEffect(() => {
        if (selectedReport) {
            console.log('Selected Report Updated:', selectedReport);
            setShowModal(true);
        }
    }, [selectedReport]);


    const handleInputFocus1 = () => {
        setShowStartDatetime(true);  // Show the datetime picker when input is focused
    };
    const handleInputFocus2 = () =>{
        setShowEndDatetime(true);
    }
    const handleLocationChange = (e:any) =>{
        setLocation(e.detail.value);
    }
    const convertToCSV = (data: Location[]): string => {
        // Obținem antetul (cheile obiectului Location)
        const header = ["Latitude","Longitude", "Date","Description", "Flying", "Colony or Individual", "Move state"," Type of building"];

        // Transformăm fiecare obiect Location într-un array de string-uri
        const rows = data.map((location) => [
            location.latitude,
            location.longitude,
            location.dateAndTimeOfObservation,
            location.description,
            location.flying ? "Da" : "Nu", // Convertim boolean-ul într-un string
            location.individualOrColony,
            location.moveOption,
            location.typeOfBuilding,
            //location.image ? `"data:image/png;base64,${location.image}"` : ''
        ]);

        // Combinăm antetul cu datele și generăm conținutul CSV
        return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");



    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault(); // Previne comportamentul implicit al formularului

        // Example data to export
        // const data = [
        //     ["Data de inceput", "Data de final"], // header
        //     [selectedStartDate, selectedEndDate],     // row data
        // ];
        const data = allLocations.filter((location) => {
            let locationDate= new Date();
            if(location.dateAndTimeOfObservation)
              locationDate = new Date(location.dateAndTimeOfObservation);
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);

            return locationDate >= startDate && locationDate <= endDate;
        });
        // Convert data to CSV format
        const csvContent = convertToCSV(data);

        // Trigger CSV file download
        downloadCSV(csvContent);
    };

    // const convertToCSV = (data: string[][]): string => {
    //     return data.map(row => row.join(",")).join("\n");
    // };

    const downloadCSV = (csvContent: string) => {
        // Create a Blob object for the CSV content
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        // Create a link element
        const link = document.createElement("a");

        // Create an object URL for the Blob
        const url = URL.createObjectURL(blob);

        // Set the download attribute with a filename
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");

        // Append the link to the body (it will be invisible)
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up by removing the link element
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Revocăm URL-ul generat pentru a preveni scurgerile de memorie

    };

    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent className="page-content">
                <h2>Generare raport</h2>
                <form onSubmit={handleSubmit}>
                    <IonCard className={"Form"} >
                        <div style={{overflow:"scroll"}}>
                            <IonItem lines={"none"}>
                                <IonLabel style={{fontSize:"1.5rem", fontFamily:"Lora"}} position={"stacked"}>Locatii adaugate de la data</IonLabel>
                                <IonInput className={"textFields"}
                                    value={selectedStartDate}
                                    placeholder="Select a date"
                                    onIonFocus={handleInputFocus1}
                                    readonly
                                />

                                {/* IonDatetime picker */}
                                {showStartDatetime && (
                                    <IonDatetime
                                        value={selectedStartDate}
                                        onIonChange={handleStartDateChange}
                                        cancelText="Cancel"
                                        doneText="Select"
                                    />
                                )}
                                <IonLabel style={{fontSize:"1.5rem", fontFamily:"Lora"}} position={"stacked"}>Pana la data</IonLabel>
                                <IonInput className={"textFields"}
                                          value={selectedEndDate}
                                          placeholder="Select a date"
                                          onFocus={handleInputFocus2}
                                          readonly
                                />

                                {/* IonDatetime picker */}
                                {showEndDatetime && (
                                    <IonDatetime
                                        value={selectedEndDate}
                                        onIonChange={handleEndDateChange}
                                        cancelText="Cancel"
                                        doneText="Select"
                                    />
                                )}

                            </IonItem>
                        </div>

                    </IonCard>
                        <IonButton type="button" onClick={handleSubmit}>Genereaza</IonButton>

                </form>

            </IonContent>
        </IonPage>
);
};

export default Reports;
