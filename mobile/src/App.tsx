import {Redirect, Route, useLocation} from 'react-router-dom';
import {
    IonApp,
    IonContent,
    IonFooter,
    IonPage,
    IonRouterOutlet,
    IonToolbar,
    setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';
import Login from "./authentication/Login";
import React from "react";
import MapCoordinatesPage from "./pages/AddLocationPage";
import "leaflet"
import MapPage from "./map/MapDisplay";
import 'leaflet/dist/leaflet.css';
import MenuBar from "./menu/MenuBar";
import ReportsPage from "./pages/ReportsPage";
import Reports from "./pages/ReportsPage";
import MyLocationsPage from "./pages/MyLocationsPage";
import Home from "./home/Home";
import Register from "./authentication/Register";
import EmailVerification from "./authentication/EmailVerification";
import {RegistrationProvider} from "./utils/RegistrationContext";
import AddCoordinatesPage from "./pages/AddLocationPage";
import AddLocationPage from "./pages/AddLocationPage";
import {AddLocationProvider} from "./utils/AddLocationContext";
import {LocationsProvider} from "./utils/LocationsContext"; // Add Leaflet's CSS

setupIonicReact();

const App: React.FC = () => {
    return (

        <IonApp>
            <IonReactRouter>
                    <AppContent />
            </IonReactRouter>
        </IonApp>
    );
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const loginRoutes = ["/login","/register", "/emailVerification"];

    return (
        <IonPage>
            <IonContent>

            <IonRouterOutlet>

                <Route path="/login" component={Login} exact={true} />
                <Route path="/register" component={Register} exact={true} />
                <Route path="/emailVerification" component={EmailVerification} exact={true} />
                <LocationsProvider>
                    <Route path="/home" component={Home} exact={true} />
                    <AddLocationProvider>
                        <Route path="/addLocation" component={AddLocationPage} exact={true} />
                        <Route path="/mapDisplay" component={MapPage} exact={true} />
                        <Route path="/myLocations" component={MyLocationsPage} exact={true} />
                    </AddLocationProvider>

                <Route path="/reportsPage" component={Reports} exact={true} />
                </LocationsProvider>
                <Route exact path="/">
                    <Redirect to="/login" />
                </Route>
            </IonRouterOutlet>

            </IonContent>
            {!loginRoutes.includes(location.pathname) && (
                <IonFooter>
                    <IonToolbar>
                        <MenuBar />
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default App;
