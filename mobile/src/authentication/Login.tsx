import {
    IonButton,
    IonContent,
    IonGrid,
    IonInput,
    IonPage, IonText,
    IonTitle,
    IonToast,
} from "@ionic/react";
import React, {useCallback,useRef, useState} from "react";
import "./Login.css";
import {useHistory} from "react-router";
import {login} from "../api/AuthenticationApi";
import {Link} from "react-router-dom";
import {useRegistration} from "../utils/RegistrationContext";

interface LoginState {
    username?: string;
    password?: string;
}
const Login: React.FC = () => {
    const credentials = useRegistration()
    const history = useHistory();
    const [state,setState]=useState<LoginState>({});
    const {username,password}=state;
    const [loggedIn,setLoggedIn]=useState(false);
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

    function validateField(fieldValue:any, regexp:any){
        return regexp.test(fieldValue);
    }

    function validateUsername() {
        return username && validateField(username, /^[A-Za-z][A-Za-z0-9_]{7,29}$/);
    }

    function validatePassword() {
        return password && validateField(password, /^.{6,}$/);
    }

    function validateLoginFields() {
        if (!validateUsername()) {
            console.log("username validation error");
            anyError.current = true;
        }

        if (!validatePassword()) {
            console.log("password validation error");
            anyError.current = true;
        }
    }

    function parseJwt (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const handleLoginButton = useCallback(async () => {
        anyError.current = false;
        validateLoginFields();

        if (!anyError.current) {
            try {
                const token = await login(username!, password!);
                console.log("Login successful. Token:", token);
                const parsedToken = parseJwt(token);
                localStorage.setItem('token', token);
                console.log("Role: "+parsedToken["scope"]);
                localStorage.setItem('role', parsedToken["scope"]);
                setLoggedIn(true);
                history.push(`/home`);
            } catch (error: any) {

                console.error("Login failed:", error.message);

                setShowToast(true);
            }
        } else {
            console.log("Invalid login fields");
            setShowToast(true);
        }
    }, [username, password]);



    return (
        <IonPage>
            <IonContent className={"ionContent"} fullscreen>
                <IonGrid className={"logo"}></IonGrid>
                <IonGrid className={"loginContainer"}>
                    <IonInput className={"inputLogin"} label="Username " labelPlacement="floating" type="text" value={username} onIonInput={handleUsernameChange}>
                    </IonInput>
                    <IonInput className={"inputLogin"} label="Password " labelPlacement="floating" type="password" value={password} onIonInput={handlePasswordChange}>
                    </IonInput>
                    <IonButton id={"loginButton"} className={"loginButton"} onClick={handleLoginButton}>Log In</IonButton>

                    <IonText className={"forgotPasswordLink"}>Forgot password?    <Link className={"links"} to="/">Reset password</Link></IonText>
                    <IonText className={"signUpLink"}>Don't have an account?    <Link className={"links"} to="/register">Sign Up</Link></IonText>
                </IonGrid>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Incorrect username or password"
                    duration={3000}
                    position="bottom"
                    color="danger"
                />
            </IonContent>

        </IonPage>
    );
};

export default Login;
