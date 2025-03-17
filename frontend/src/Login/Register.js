import React, {useEffect, useRef, useState} from "react";
import './Login.css';
import {FaMailBulk, FaUser} from "react-icons/fa";
import {FaLock, FaMessage} from "react-icons/fa6";
import {useLocation, useNavigate} from 'react-router-dom';
import {login} from "../API/Authentication";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
        return passwordRegex.test(password);
    };

    const samePasswords = (password, confPassword) => {
        return password === confPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setMessage("Introduceti o adresa valida de email!");
            setIsError(true);
            return;
        }

        if (username.trim() === "") {
            setMessage("Invalid username!");
            setIsError(true);
            return;
        }

        if (!validatePassword(password)) {
            setMessage("Password must be at least 8 characters and contain a number.");
            setIsError(true);
            return;
        }

        if (!samePasswords(password, confPassword)) {
            setMessage("Cele 2 parole trebuie sa coincida.");
            setIsError(true);
            return;
        }

        try {
            const response = await axios.post('/batdetective/auth/register', {
                username, password, email});

            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.data;
            console.log(data);
        } catch (error) {
            console.error("Eroare la trimiterea datelor:", error);
        }
        navigate('/activate');
    };

    function goToLogin() {
        navigate('/login');
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

                    <span style={{fontSize: '14px'}}>E-mail</span>
                    <div className='input-box'>
                        <FaMailBulk className='icon'/>
                        <input
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='E-mail'
                            required
                        />
                    </div>

                    <span style={{fontSize: '14px'}}>New username</span>
                    <div className='input-box'>
                        <FaUser className='icon'/>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='New username'
                            required
                        />
                    </div>

                    <span style={{fontSize: '14px'}}>New password</span>
                    <div className='input-box'>
                        <FaLock className='icon'/>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='New password'
                        />
                    </div>

                    <span style={{fontSize: '14px'}}>Confirm password</span>
                    <div className='input-box'>
                        <FaLock className='icon'/>
                        <input
                            type='password'
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                            required
                            placeholder='Confirm password'
                        />
                    </div>

                    <button type='submit'>Sign up</button>
                    <button type='button' onClick={goToLogin}>Ai deja un cont? Autentificare</button>

                </form>
            </div>
        </div>
    );
};

export default Register;
