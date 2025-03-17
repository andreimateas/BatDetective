import {IonButton, IonContent, IonGrid, IonInput, IonPage, IonText, IonTitle, IonToast,} from "@ionic/react";
import React, {useCallback, useRef, useState} from "react";
import {useHistory} from "react-router";
import "./Register.css";
import {register} from "../api/AuthenticationApi";
import {Role} from "../api/Role";
import {Link} from "react-router-dom";

interface RegisterState {
    username?: string;
    password?: string;
    email?: string;
    role?: Role;
}
const Register: React.FC = () => {

    const history = useHistory();
    const [state,setState]=useState<RegisterState>({});
    const {username,password, email, role}=state;
    const anyError = useRef(false);
    const [showToast, setShowToast] = useState(false);

    const handleUsernameChange = useCallback((e: any) => setState({
        ...state,
        username: e.detail.value || ''
    }), [state]);

    const handlePasswordChange = useCallback((e: any) => setState({
        ...state,
        password: e.detail.value || ''
    }), [state]);

    const handleEmailChange = useCallback((e: any) => setState({
        ...state,
        email: e.detail.value || ''
    }), [state]);

    const handleRoleChange = useCallback((e: any) => setState({
        ...state,
        role: e.detail.value || Role.ADMIN
    }), [state]);


    function validateField(fieldValue:any, regexp:any){
        return regexp.test(fieldValue);
    }

    function validateUsername() {
        return username && validateField(username, /^[A-Za-z][A-Za-z0-9_]{7,29}$/);
    }

    function validatePassword() {
        return password && validateField(password, /^.{6,}$/);
    }

    function validateEmail(){
        return email && validateField(email, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    }

    function validateRegisterFields() {
        if (!validateUsername()) {
            console.log("username validation error");
            anyError.current = true;
        }

        if (!validatePassword()) {
            console.log("password validation error");
            anyError.current = true;
        }

        if (!validateEmail()) {
            console.log("email validation error");
            anyError.current = true;
        }
    }

    const handleRegisterButton = useCallback(async () => {
        anyError.current = false;
        validateRegisterFields();

        if (!anyError.current) {
            try {
                const result = await register(username!, password!, email!);

                if (result === "Registration successful") {
                    console.log("Registration successful");
                    history.push("/emailVerification");
                }
            } catch (error: any) {
                console.error("Registration failed:", error.message);
                setShowToast(true);
            }
        }else{
            console.log("Invalid registration fields");
            setShowToast(true);
        }

    }, [username, password, email, role]);

    return (
        <IonPage>
            <IonContent className={"ionContent"} fullscreen>
                <IonGrid className={"logo"}></IonGrid>
                <IonGrid className={"registerContainer"}>
                    <IonInput className={"inputRegister"} label="Username " labelPlacement="floating" type="text"
                              value={username} onIonInput={handleUsernameChange}>
                    </IonInput>
                    <IonInput className={"inputRegister"} label="Email " labelPlacement="floating" type="email"
                              placeholder={"email@domain.com"} value={email} onIonInput={handleEmailChange}>
                    </IonInput>
                    <IonInput className={"inputRegister"} label="Password " labelPlacement="floating" type="password"
                              value={password} onIonInput={handlePasswordChange}>
                    </IonInput>

                    <IonButton id={"registerButton"} className={"registerButton"} onClick={handleRegisterButton}>Sign
                        Up</IonButton>

                    <IonText className={"logInLink"}>Already have an account? <Link className={"links"} to="/login">Log In</Link></IonText>
                </IonGrid>



                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Incorrect fields"
                    duration={3000}
                    position="bottom"
                    color="danger"
                />
            </IonContent>

        </IonPage>
    );
};

export default Register;
