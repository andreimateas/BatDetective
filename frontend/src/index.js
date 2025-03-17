import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Login/Login";
import MapPage from "./MapPage/MapPage";
import LandingPage from "./LandingPage/LandingPage";
import MyLocationsPage from "./MyLocationsPage/MyLocationsPage";
import EditLocationPage from "./EditLocationPage/EditLocationPage";
import ReportsPage from "./ReportsPage/ReportsPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import Register from "./Login/Register";
import ActivateAccount from "./Login/ActivateAccount";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/activate" element={<ActivateAccount />} />
                <Route path="/" element={<Login />} />
                <Route path="/map" element={<ProtectedRoute> <MapPage/> </ProtectedRoute>} />
                <Route path="/app" element={<ProtectedRoute> <App /> </ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute> <LandingPage/> </ProtectedRoute>}/>
                <Route path="/myLocations" element={<ProtectedRoute> <MyLocationsPage/> </ProtectedRoute>}/>
                <Route path="/editLocation" element={<ProtectedRoute> <EditLocationPage/> </ProtectedRoute>}/>
                <Route path="/reports" element={<ProtectedRoute> <ReportsPage/> </ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
