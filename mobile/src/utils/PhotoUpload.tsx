import React, {useEffect, useRef, useState} from "react";
import {IonButton, IonContent, IonImg, IonItem, IonModal,} from "@ionic/react";
import "./PhotoUpload.css";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera"; // Link to the CSS file
interface PhotoUploadProps {
    handleImage: (img: File | null) => void;
    alreadyUploaded?: boolean;
    image?: string|null;
}
const PhotoUpload: React.FC<PhotoUploadProps> = ({handleImage,alreadyUploaded,image}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<null | string>(null);
    const [photo, setPhoto] = useState<null|File>(null);
    const [previewPhoto,setPreviewPhoto] = useState<string|undefined>("");
    const [showModal,setShowModal] = useState<boolean>(false);

    // Function to trigger file input when the upload box is clicked
    const handleBoxClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    useEffect(() => {
        if(image)
        {
            const base64prefix = "data:image/png;base64,"
            const base64string = base64prefix + image;
            setPreviewPhoto(base64string);
            setPhoto(new File([], 'photo.png', { type: 'image/png' }));
        }
    }, []);

    // Handle file selection
    const handlePreview = (file:any) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    //console.log("rezultat",reader.result);
                    setPreviewPhoto(reader.result as string); // Save the base64 image
                }
            };
            reader.readAsDataURL(file); // Convert the file to a base64 string
        }

    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            setPhoto(file); // Update the state with the selected file
            handlePreview(file)
            console.log(file)
            handleImage(file);
        }
        setSelectedFile("Photo Uploaded")
    };
    const handleTakePhoto = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 100, // Adjust quality as needed
                source: CameraSource.Camera, // Use the device's camera
                resultType: CameraResultType.DataUrl, // Return the result as a data URL (Base64)
            });

            const base64Response = await fetch(image.dataUrl!);
            const blob = await base64Response.blob();
            console.log(blob)
            const file = new File([blob], 'photo.png', { type: 'image/png' });
            if(image)
                handlePreview(file)
            setPhoto(file); // Set the photo as Base64 URL to display
            handleImage(file);
        } catch (error) {
            console.error('Camera error:', error);
        }

        setSelectedFile("Photo Uploaded")
        //console.log("S-a trimis la parinte poza:",photo);

    };
    return (

                <IonItem className={"uploadItem"} lines="none">
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center',width:"100%"}}>
                        <IonButton style={{position:"relative",bottom:"5px", padding: '0px',fontSize:"17px",width:"20vw",height:"5vh"}} expand="block" onClick={handleTakePhoto}>
                            Fotografiaza
                        </IonButton>

                    <p style={{margin:"10px",width:"6vw"}}>SAU</p>

                    <div  className="file-upload-box" onClick={handleBoxClick}>
                        <p>Incarca un fisier</p>
                    </div>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        className="file-input-hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                        {selectedFile && alreadyUploaded == undefined && (
                            <IonButton style={{position:"relative",marginLeft:"10px",bottom:"5px",width:"20vw",height:"5vh",fontSize:"17px"}} onClick={()=>{setShowModal(true)}}>Preview Photo</IonButton>
                        )}
                        {alreadyUploaded && (
                            <IonButton style={{position:"relative",marginLeft:"10px",bottom:"5px",width:"20vw",height:"5vh",fontSize:"17px"}} onClick={()=>{setShowModal(true)}}>Preview Photo</IonButton>
                        )}
                    </div>
                    {/* Modal to display the image */}
                    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                        <IonContent>
                            <IonImg src={previewPhoto} />
                            <IonButton
                                onClick={() => setShowModal(false)} // Close the modal
                                style={{
                                    margin: '10px',
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                Close
                            </IonButton>
                        </IonContent>
                    </IonModal>

                </IonItem>



    );
};

export default PhotoUpload;
