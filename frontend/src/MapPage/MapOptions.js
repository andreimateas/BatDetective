import React, {useState} from "react";
import mapProvider from "./map-provider";

const MapOptions = ({ onTileLayerChange }) =>{
    const [url, setUrl] = useState(mapProvider.osm.url);
    const [attribution, setAttribution] = useState(mapProvider.osm.attribution);

    const switchToSatellite = () => {
        const newUrl = mapProvider.satellite.url;
        const newAttribution = mapProvider.satellite.attribution;
        setUrl(newUrl);
        setAttribution(newAttribution);
        onTileLayerChange(newUrl, newAttribution);
    };

    const switchToOsm = () => {
        const newUrl = mapProvider.osm.url;
        const newAttribution = mapProvider.osm.attribution;
        setUrl(newUrl);
        setAttribution(newAttribution);
        onTileLayerChange(newUrl, newAttribution);
    };

    return (
        <div className="map-types">
            <button className="map-type-button" onClick={() => switchToOsm()} >2D</button>
            <div className="vertical-line"></div>
            <button className="map-type-button" onClick={() => switchToSatellite()} >Satelit</button>
        </div>
    );
};
export default MapOptions;