//package com.example.demo.utils.converter;
//
//import com.example.demo.model.Location;
//import com.example.demo.utils.dto.LocationDto;
//import com.example.demo.utils.dto.requests.AddLocationDto;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class LocationDtoConverter implements Converter<Location, LocationDto> {
//
//    @Override
//    public Location createFromDto(LocationDto dto) {
//        return Location.builder()
//                .id(dto.id())
//                .description(dto.description())
//                .latitude(dto.latitude())
//                .longitude(dto.longitude())
//                .image(dto.image())
//                .dateAndTimeOfObservation(dto.dateAndTimeOfObservation())
//                .individualOrColony(dto.individualOrColony())
//                .stationaryOrFlying(dto.stationaryOrFlying())
//                .enteringOrExiting(dto.enteringOrExiting())
//                .typeOfBuilding(dto.typeOfBuilding())
//                .build();
//    }
//
//    @Override
//    public LocationDto createFromEntity(Location entity) {
//        return new LocationDto(
//                entity.getId(),
//                entity.getDescription(),
//                entity.getLatitude(),
//                entity.getLongitude(),
//                entity.getImage(),
//                entity.getDateAndTimeOfAddingLocation(),
//                entity.getUserId(),
//                entity.getDateAndTimeOfObservation(),
//                entity.getIndividualOrColony(),
//                entity.getStationaryOrFlying(),
//                entity.getEnteringOrExiting(),
//                entity.getTypeOfBuilding()
//        );
//    }
//
//    public Location createFromAddLocationDto(AddLocationDto addLocationDto) {
//        return Location.builder()
//                .description(addLocationDto.description())
//                .latitude(addLocationDto.latitude())
//                .longitude(addLocationDto.longitude())
//                .image(addLocationDto.image())
//                .dateAndTimeOfObservation(addLocationDto.dateAndTimeOfObservation())
//                .individualOrColony(addLocationDto.individualOrColony())
//                .stationaryOrFlying(addLocationDto.stationaryOrFlying())
//                .enteringOrExiting(addLocationDto.enteringOrExiting())
//                .typeOfBuilding(addLocationDto.typeOfBuilding())
//                .dateAndTimeOfAddingLocation(null) // This will be set automatically when saved
//                .build();
//    }
//}

package com.example.demo.utils.converter;

import com.example.demo.model.Location;
import com.example.demo.utils.dto.LocationDto;
import com.example.demo.utils.dto.requests.AddLocationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LocationDtoConverter implements Converter<Location, LocationDto> {

    @Override
    public Location createFromDto(LocationDto dto) {
        // Construct Location entity from DTO
        return Location.builder()
                .id(dto.id())
                .description(dto.description())
                .latitude(dto.latitude())
                .longitude(dto.longitude())
                .image(dto.image())
                .dateAndTimeOfObservation(dto.dateAndTimeOfObservation())
                .individualOrColony(dto.individualOrColony())
                .flying(dto.flying()) // Updated field
                .moveOption(dto.moveOption()) // Updated field
                .typeOfBuilding(dto.typeOfBuilding()) // Updated field
                .build();
    }

    @Override
    public LocationDto createFromEntity(Location entity) {
        // Construct DTO from Location entity
        return new LocationDto(
                entity.getId(),
                entity.getDescription(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getImage(),
                entity.getDateAndTimeOfAddingLocation(),
                entity.getUserId(),
                entity.getDateAndTimeOfObservation(),
                entity.getIndividualOrColony(),
                entity.getFlying(), // Updated field
                entity.getMoveOption(), // Updated field
                entity.getTypeOfBuilding() // Updated field
        );
    }

    public Location createFromAddLocationDto(AddLocationDto addLocationDto) {
        // Construct Location entity from AddLocationDto
        Location location = Location.builder()
                .description(addLocationDto.description())
                .latitude(addLocationDto.latitude())
                .longitude(addLocationDto.longitude())
                .image(addLocationDto.image())
                .dateAndTimeOfObservation(addLocationDto.dateAndTimeOfObservation())
                .individualOrColony(addLocationDto.individualOrColony())
                .flying(addLocationDto.flying()) // Updated field
                .moveOption(addLocationDto.moveOption()) // Updated field
                .typeOfBuilding(addLocationDto.typeOfBuilding()) // Updated field
                .dateAndTimeOfAddingLocation(null) // This will be set automatically when saved
                .build();

        // Handle logic for "Flying"
        if ("Flying".equalsIgnoreCase(location.getFlying())) {
            location.setMoveOption(""); // Clear moveOption
            location.setTypeOfBuilding(""); // Clear typeOfBuilding
        } else {
            location.setFlying(""); // Ensure flying is cleared if not "Flying"
        }

        return location;
    }
}

