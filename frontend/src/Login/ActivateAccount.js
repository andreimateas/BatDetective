    import React, {useEffect, useState} from "react";
    import './Login.css';
    import './Register.css';
    import { FaUser } from "react-icons/fa";
    import {useLocation, useNavigate} from 'react-router-dom';
    import axios from "axios";

    const ActivateAccount = () => {
        const navigate = useNavigate();
        const [code, setCode] = useState("");
        const [message, setMessage] = useState(null);
        const [isError, setIsError] = useState(false);
        const location = useLocation();


        useEffect(() => {
            if (location.state?.error) {
                setIsError(true);
                setMessage(location.state.error);
            }
        }, [location.state]);

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const response = await axios.put(`/batdetective/auth/enable/${code}`);

                if (!response.ok) {
                    console.log(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.data;
                console.log(data);
            } catch (error) {
                console.error("Eroare la trimiterea datelor:", error);
            }
            navigate("/login");
        };

        function goToRegister() {
            navigate("/register");
        }

        return (
            <div className='login-container'>
                <div className='logo'/>
                <div className={`reg-form-wrapper ${message ? (isError ? 'error' : 'success') : ''}`}>
                    <form onSubmit={handleSubmit}>

                        {message && (
                            <div className={`message ${isError ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}

                        <span className="text-mail" >
                            Un mesaj cu codul de activare a fost trimis pe adresa ta de e-mail. Nu uita sa iti verifici si casuta de spam. <br></br>
                        </span>

                        <span>Cod de activare:</span>
                        <div className='input-box' style={{width: "80%"}}>
                            <FaUser className='icon'/>
                            <input
                                type='text'
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder='Cod de activare'
                                required
                            />
                        </div>

                        <button id="activate" type='submit'>Activeaza cont</button>
                        <br></br>
                        <button type={"button"} onClick={goToRegister}>Inapoi</button>

                    </form>
                </div>
            </div>
        );
    };

    export default ActivateAccount;
