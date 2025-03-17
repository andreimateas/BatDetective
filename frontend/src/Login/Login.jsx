import React, {useEffect, useState} from "react";
import './Login.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import {useLocation, useNavigate} from 'react-router-dom';
import {login} from "../API/Authentication";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const location = useLocation();

    // Validation functions
    /*const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };*/

    useEffect(() => {
        if (location.state?.error) {
            setIsError(true);
            setMessage(location.state.error);
        }
    }, [location.state]);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (username.trim() === "") {
            setMessage("Invalid username!");
            setIsError(true);
            return;
        }

        /*if (!validatePassword(password)) {
            setMessage("Password must be at least 8 characters and contain a number.");
            setIsError(true);
            return;
        }*/

        const responseMessage = await login(username, password, rememberMe);
        if(responseMessage.trim()==='OK'){
            setMessage("Login successful! Redirecting...");
            setIsError(false);
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } else{
            setMessage("Login failed: " + responseMessage.substring(responseMessage.indexOf(":")+2));
            setIsError(true);
        }
    };

    function goToRegister() {
        navigate('/register');
    }

    return (
        <div className='login-container'>
            <div className='logo'/>
            <div className={`form-wrapper ${message ? (isError ? 'error' : 'success') : ''}`}>
                <form onSubmit={handleSubmit}>

                    {message && (
                        <div className={`message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <span>Username</span>
                    <div className='input-box'>
                        <FaUser className='icon'/>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username'
                            required
                        />
                    </div>

                    <span>Password</span>
                    <div className='input-box'>
                        <FaLock className='icon'/>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='Password'
                        />
                    </div>
                    <div className='remember'>
                        <label>
                            <input type='checkbox'
                                      checked={rememberMe}
                                      onChange={(e) => setRememberMe(e.target.checked)}/>
                            Remember me</label>
                    </div>

                    <button type='submit'>Log in</button>

                    <button type='button' onClick={goToRegister}>Esti utilizator nou? Inregistreaza-te aici</button>

                </form>
            </div>
        </div>
    );
};

export default Login;
