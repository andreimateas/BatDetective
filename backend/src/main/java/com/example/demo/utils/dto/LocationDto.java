package com.example.demo.utils.dto;

import java.time.LocalDateTime;

public record LocationDto(
        String id,
        String description,

        String latitude,
        String longitude,
        byte[] image,
        LocalDateTime dateAndTimeOfAddingLocation,
        String userId,
        LocalDateTime dateAndTimeOfObservation,
        String individualOrColony,
        String flying,
        String moveOption,
        String typeOfBuilding
) {
}
