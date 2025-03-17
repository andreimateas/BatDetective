import React, {useCallback, useRef, useState} from "react";
import {IonButton, IonContent, IonGrid, IonInput, IonPage, IonText, IonTitle, IonToast} from "@ionic/react";
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import "./EmailVerification.css";
import {enableUser} from "../api/AuthenticationApi";

const EmailVerification: React.FC = () => {

    const history = useHistory();
    const [token, setToken]=useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    function handleTokenChange(e: any) {
        setToken(e.detail.value || "");
    }
    const handleConfirmationButton= useCallback(async()=> {
        if (!token) {
            setToastMessage("Token is required.");
            setShowToast(true);
            return;
        }
        try {
            const result = await enableUser(token);
            setToastMessage("Account enabled successfully");
            setShowToast(true);

            setTimeout(() => {
                history.push("/login");
            }, 3000);

        } catch (error: any) {
            setToastMessage(error.message);
            setShowToast(true);
        }
    },[token]);

    return (
        <IonPage>
            <IonContent className={"ionContent"} fullscreen>
                <IonTitle className={"verificationTitle"}>Email Verification</IonTitle>
                <IonGrid className={"tokenContainer"}>
                    <IonText>Please check your email and enter the verification code to enable your account. </IonText>
                    <IonInput className={"inputToken"} label="" labelPlacement="floating" type="text" value={token} onIonInput={handleTokenChange}>
                    </IonInput>
                    <IonButton id={"confirmationButton"} className={"loginButton"} onClick={handleConfirmationButton}>Confirm</IonButton>
                    <IonText className={"signUpLink"}><Link className={"links"} to="/register">Back to previous page</Link></IonText>
                </IonGrid>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="bottom"
                    color={toastMessage.includes("success") ? "success" : "danger"}
                />
            </IonContent>

        </IonPage>
    );
};

export default EmailVerification;
