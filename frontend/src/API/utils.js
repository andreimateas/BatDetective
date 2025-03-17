export const processLocations = (locations) => {
    return locations.map(location => {
        const longitude = parseFloat(location.longitude);
        const latitude = parseFloat(location.latitude);
        return {
            ...location, // Keep all other properties intact
            longitude: isNaN(longitude) ? 0 : longitude, // Replace NaN with 0
            latitude: isNaN(latitude) ? 0 : latitude,   // Replace NaN with 0
            dateAndTimeOfObservation: new Date(location.dateAndTimeOfObservation) // Convert date string to a Date object
        };
    });
};