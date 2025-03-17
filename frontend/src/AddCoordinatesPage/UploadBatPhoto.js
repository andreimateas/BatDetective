import React, { useEffect, useRef, useState } from 'react';
import './UploadButton.css';

const PhotoUpload = ({ setUploadedPhoto, initialPhoto }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const textFileRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedPhoto(file);
            setUploadedPhoto(file);
        }
    };

    useEffect(() => {
        const endings = [".jpg", ".jpeg", ".png", ".gif"];
        const isPhoto = selectedPhoto && endings.some((ending) => selectedPhoto.name.toLowerCase().endsWith(ending));
        if (selectedPhoto && !isPhoto) {
            alert(`Nu poți adăuga un fișier care nu este o imagine! (${endings.join(", ")})`);
            setSelectedPhoto(null);
            setUploadedPhoto(null);
        } else if (selectedPhoto) {
            textFileRef.current.textContent = selectedPhoto.name;
        } else if (initialPhoto) {
            textFileRef.current.textContent = initialPhoto;
        } else {
            textFileRef.current.textContent = "Încarcă o fotografie";
        }
    }, [selectedPhoto, initialPhoto, setUploadedPhoto]);

    return (
        <div style={{ width: "70%" }}>
            <input type="file" id="file" onChange={handleFileChange} />
            <label htmlFor="file" id="file-label">
                <span ref={textFileRef} id="file-text">Încarcă o fotografie</span>
            </label>
        </div>
    );
};

export default PhotoUpload;
