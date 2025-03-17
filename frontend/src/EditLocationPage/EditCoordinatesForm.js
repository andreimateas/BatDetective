import UploadBatPhoto from "../AddCoordinatesPage/UploadBatPhoto";
import React, {useEffect, useRef, useState} from "react";
import "../AddCoordinatesPage/CoordinatesPage.css";
import {getAuthToken} from "../API/Authentication";
import DatePicker from "react-datepicker";
import {FiCalendar} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const EditCoordinatesForm = ({
                                 id,
                                 position,
                                 updateMarker,
                                 initialDescription,
                                 initialImg,
                                 initialDate,
                                 initialBatTypeOption,
                                 initialMoveOption,
                                 initialFlyOption,
                                 initialPlaceOption
                             }) => {
    const updatePositionMarker = updateMarker;
    const [lat, setLat] = useState(position?.lat || 0);
    const [lng, setLng] = useState(position?.lng || 0);
    const [photo, setPhoto] = useState(initialImg || null);
    const [text, setText] = useState(initialDescription || "");
    const inputLatRef = useRef(null);
    const inputLngRef = useRef(null);
    const [date, setDate] = useState(initialDate || null);
    const [batTypeOption, setBatTypeOption] = useState(initialBatTypeOption || "Colony")
    const [moveOption, setMoveOption] = useState(initialMoveOption || "Entering")
    const [flyOption, setFlyOption] = useState(initialFlyOption || false)
    const [placeOption, setPlaceOption] = useState(initialPlaceOption || "")

    const placeOptionRef = useRef(null);
    const enterOptionRef = useRef(null);
    const leaveOptionRef = useRef(null);
    const standOptionRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState([]);

    const latMin = 46.732;
    const latMax = 46.810;
    const lngMin = 23.532;
    const lngMax = 23.655;
    const navigate = useNavigate()
    const setUploadedPhoto = (photo) => {
        setPhoto(photo);
    }

    const handleChange = (event) => {
        setText(event.target.value);
    };

    useEffect(() => {
        setLat(position?.lat || 0);
        setLng(position?.lng || 0);
    }, [position]);

    useEffect(() => {
        if (lat === 0)
            inputLatRef.current.value = "";
        else
            inputLatRef.current.value = lat;
        if (lng === 0)
            inputLngRef.current.value = "";
        else
            inputLngRef.current.value = lng;
    }, [lat, lng]);

    useEffect(() => {
        // if (initialDate) {
        //     const formattedDate = new Date(initialDate).toISOString().slice(0, 16);
        //     setDate(formattedDate);
        // }
        if (initialDate) {
            const year = initialDate.getFullYear();
            const month = String(initialDate.getMonth() + 1).padStart(2, '0');
            const day = String(initialDate.getDate()).padStart(2, '0');
            const hours = String(initialDate.getHours()).padStart(2, '0');
            const minutes = String(initialDate.getMinutes()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            setDate(formattedDate);
        }

        if(flyOption){
            setMoveOption(null);
            setPlaceOption("");
            placeOptionRef.current.disabled = true;
            enterOptionRef.current.disabled = true;
            leaveOptionRef.current.disabled = true;
            standOptionRef.current.disabled = true;
            if (errorMessage)
                setErrorMessage((prevState) => {
                    if (prevState)
                        prevState.pop()
                })
        } else {
            setMoveOption(moveOption);
            placeOptionRef.current.disabled = false;
            enterOptionRef.current.disabled = false;
            leaveOptionRef.current.disabled = false;
            standOptionRef.current.disabled = false;
            }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let localErrors = [];
        setErrorMessage(localErrors);

        const formData = new FormData();
        if (latMin <= lat && lat <= latMax && lngMin <= lng && lng <= lngMax) {
            formData.append('latitude', lat);
            formData.append('longitude', lng);
        } else {
            alert(
                'Coordonate invalide!\n' +
                'Valorile trebuie să fie în următoarele intervale:\n' +
                '- Latitudine: [' + latMin + ' - ' + latMax + ']\n' +
                '- Longitudine: [' + lngMin + ' - ' + lngMax + ']'
            );
            return;
        }

        if (photo) {
            formData.append('image', photo);
        } else {
            formData.append('image', null);
        }

        if (text) {
            formData.append('description', text);
        } else {
            formData.append('description', "");
        }

        if (date) {
            formData.append('dateAndTimeOfObservation', `${date}:00`);
        } else {
            localErrors.push("dateError");
        }

        formData.append("individualOrColony", batTypeOption)

        if (flyOption) {
            formData.append("flying", "Flying");
            formData.append("typeOfBuilding", "");
            formData.append("moveOption", "");
        } else {
            formData.append("flying", "");

            if (placeOption !== "") {
                formData.append("typeOfBuilding", placeOption);
            } else {
                localErrors.push("placeError");
            }

            formData.append("moveOption", moveOption);
        }

        if (localErrors.length > 0) {
            setErrorMessage(localErrors);
            return;
        }

        try {
            const token = getAuthToken();
            const response = await fetch(`/api/locations/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,
            });

            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            navigate('/myLocations');
        } catch (error) {
            console.error("Eroare la trimiterea datelor:", error);
        }
    };


    const handleInputChange = (event) => {
        let value = event.target.value;
        const lastChar = value.charAt(value.length - 1);
        const firstChar = value.charAt(0);
        if (firstChar === ".") {
            value = value.slice(0, -1);
            event.target.value = value;
        }
        if (!/^[0-9.-]$/.test(lastChar)) {
            value = value.slice(0, -1);
            event.target.value = value;
        }
        if (lastChar === "-" && value.length > 1) {
            value = value.slice(0, -1);
            event.target.value = value;
        }
        if (value.slice(0, value.length - 1).includes(".") && lastChar === ".") {
            value = value.slice(0, -1);
            event.target.value = value;
        }
    };

    const handleLatChange = (event) => {
        handleInputChange(event);
        if (event.target.value === "-")
            updatePositionMarker({lat: -0, lng: lng});
        else
            updatePositionMarker({lat: event.target.value, lng: lng});
    };

    const handleLngChange = (event) => {
        handleInputChange(event);
        if (event.target.value === "-")
            updatePositionMarker({lat: lat, lng: -0});
        else
            updatePositionMarker({lat: lat, lng: event.target.value});
    };

    const handleDateChange = (selectedDate) =>{
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const hours = String(selectedDate.getHours()).padStart(2, '0');
            const minutes = String(selectedDate.getMinutes()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            setDate(formattedDate);
            console.log(date)
        }
    }

    const handleBatTypeChange = (event) => {
        setBatTypeOption(event.target.value)
    }

    const handleMoveChange = (event) => {
        setMoveOption(event.target.value)
        setFlyOption(false);
    }

    const handleFlyChange = (event) => {
        setFlyOption(event.target.checked)
        if (event.target.checked) {
            setMoveOption(null);
            setPlaceOption("");
            placeOptionRef.current.disabled = true;
            enterOptionRef.current.disabled = true;
            leaveOptionRef.current.disabled = true;
            standOptionRef.current.disabled = true;
            if (errorMessage)
                setErrorMessage((prevState) => {
                    if (prevState)
                        prevState.pop()
                })
        } else {
            setMoveOption("Entering");
            placeOptionRef.current.disabled = false;
            enterOptionRef.current.disabled = false;
            leaveOptionRef.current.disabled = false;
            standOptionRef.current.disabled = false;
        }
    }

    const handlePlaceChange = (event) => {
        setPlaceOption(event.target.value);
    }


    return (
        <form onSubmit={handleSubmit} id="add-coordinates-form">
            <div id="add-coordinates-form-div">
                <span className="title">Detalii locație</span>
                <div className="input-div">
                    <label htmlFor="lat-input" className="coordinates-span">Latitudine</label>
                    <input
                        className="coord-input"
                        type="text"
                        onChange={handleLatChange}
                        ref={inputLatRef}
                        placeholder="Latitudine"
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="lng-input" className="coordinates-span">Longitudine</label>
                    <input
                        className="coord-input"
                        type="text"
                        onChange={handleLngChange}
                        ref={inputLngRef}
                        placeholder="Longitudine"
                    />
                </div>

                <div className="input-div">
                    <label className="coordinates-span">
                        Data observării
                    </label>
                    <div className="calendar-input-container">
                        <DatePicker
                            selected={date ? new Date(date) : null}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="Selectează o dată"
                            customInput={<input type="text" readOnly className="calendar-input" />}
                            calendarClassName="calendar-popover"
                        />
                        <FiCalendar size={20} className="calendar-logo"/>
                    </div>
                    {errorMessage && errorMessage.includes("dateError") &&
                        <small style={{color: "red", fontSize: "0.6rem"}}>Acest câmp este obligatoriu.</small>}
                </div>

                <div className="input-div" style={{flexDirection: "row"}}>
                    <label className="coordinates-span">
                        Am văzut
                    </label>
                    <label style={{paddingLeft: "8rem"}}>
                        <span className="coordinates-span">Colonie</span>
                        <input className="radioBtn"
                            type="radio"
                            value="Colony"
                            checked={batTypeOption === "Colony"}
                            onChange={handleBatTypeChange}
                        />
                    </label>
                    <label style={{paddingLeft: "6rem"}}>
                        <span className="coordinates-span">Individ</span>
                        <input className="radioBtn"
                            type="radio"
                            value="Individual"
                            checked={batTypeOption === "Individual"}
                            onChange={handleBatTypeChange}
                        />
                    </label>
                </div>

                <div className="input-div" style={{flexDirection: "row"}}>
                    <label style={{marginBottom: "0"}}>
                        <span className="coordinates-span">În zbor</span>
                        <input id="flyCheckbox"
                            type="checkbox"
                            checked={flyOption}
                            onChange={handleFlyChange}
                        />
                    </label>
                </div>

                <div className="input-div" style={{flexDirection: "row"}}>
                    <label className="coordinates-span">
                        <div className="dropdown-div">
                            <span className="coordinates-span">Tip locuință</span>
                            <select id="dropdown" className="dropdown" value={placeOption} onChange={handlePlaceChange}
                                    ref={placeOptionRef}>
                                <option value="">-- Selectează --</option>
                                <option value="Bloc de locuințe">Bloc de locuințe</option>
                                <option value="Casă">Casă</option>
                                <option value="Clădire industrială">Clădire industrială</option>
                                <option value="Biserică">Biserică</option>
                                <option value="Altele">Altele</option>
                            </select>
                            {errorMessage && errorMessage.includes("placeError") &&
                                <small style={{color: "red", fontSize: "0.6rem"}}>Acest câmp este obligatoriu.</small>}
                        </div>
                    </label>

                    <label style={{paddingLeft: "2.4rem"}}>
                        <span className="coordinates-span">Intrând</span>
                        <input className="radioBtn"
                            type="radio"
                            value="Entering"
                            ref={enterOptionRef}
                            checked={moveOption === "Entering"}
                            onChange={handleMoveChange}
                        />
                    </label>
                    <label style={{paddingLeft: "2.4rem"}}>
                        <span className="coordinates-span">Stând</span>
                        <input className="radioBtn"
                            type="radio"
                            value="Standing"
                            ref={standOptionRef}
                            checked={moveOption === "Standing"}
                            onChange={handleMoveChange}
                        />
                    </label>
                    <label style={{paddingLeft: "2.4rem"}}>
                        <span className="coordinates-span">Ieșind</span>
                        <input className="radioBtn"
                            type="radio"
                            value="Exiting"
                            ref={leaveOptionRef}
                            checked={moveOption === "Exiting"}
                            onChange={handleMoveChange}
                        />
                    </label>
                </div>


                <UploadBatPhoto initialPhoto={photo} setUploadedPhoto={setUploadedPhoto}/>
                <div className="input-div">
                    <label className="coordinates-span">
                        Alte informații
                    </label>
                    <textarea
                        id="bat-description-textarea"
                        value={text}
                        onChange={handleChange}
                        placeholder={"Alte informații"}
                    ></textarea>
                </div>

                <button type={"submit"} id="send-coordinates-button">Salvează</button>
            </div>
        </form>
    );
};

export default EditCoordinatesForm;
