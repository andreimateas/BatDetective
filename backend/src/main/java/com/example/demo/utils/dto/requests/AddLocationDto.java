package com.example.demo.utils.dto.requests;

import java.time.LocalDateTime;

public record AddLocationDto(
        String description,
        String latitude,
        String longitude,
        byte[] image,
        LocalDateTime dateAndTimeOfObservation,
        String individualOrColony,
        String flying, // Updated field: "Flying" or ""
        String moveOption, // Updated field: "Entering", "Exiting", "Stationary", or ""
        String typeOfBuilding // Building type or ""
) {
}


