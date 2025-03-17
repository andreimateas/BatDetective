package com.example.demo.controller;

import com.example.demo.model.Location;
import com.example.demo.model.User;
import com.example.demo.service.LocationService;
import com.example.demo.service.UserService;
import com.example.demo.utils.converter.LocationDtoConverter;
import com.example.demo.utils.dto.LocationDto;
import com.example.demo.utils.dto.requests.AddLocationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locations") // Base URL for Location API
public class LocationController {

    @Autowired
    private LocationService locationService;

    @Autowired
    private UserService userService;

    @Autowired
    private LocationDtoConverter locationDtoConverter;

    // Create a location using DTOs
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LocationDto> createLocation(
            @RequestPart(value = "description", required = false) String description,
            @RequestPart("latitude") String latitude,
            @RequestPart("longitude") String longitude,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart("dateAndTimeOfObservation") String dateAndTimeOfObservation,
            @RequestPart("individualOrColony") String individualOrColony,
            @RequestPart(value = "flying", required = false) String flying,
            @RequestPart(value = "moveOption", required = false) String moveOption,
            @RequestPart(value = "typeOfBuilding", required = false) String typeOfBuilding
    ) {
        // Convert dateAndTimeOfObservation to LocalDateTime
        LocalDateTime observationTime = LocalDateTime.parse(dateAndTimeOfObservation);

        // Convert MultipartFile to byte[]
        byte[] imageBytes = null;
        if (image != null) {
            try {
                imageBytes = image.getBytes();
            } catch (IOException e) {
                throw new RuntimeException("Error processing image file", e);
            }
        }

        // Get the authenticated user
        User user = userService.getUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        // Create a Location object
        Location location = Location.builder()
                .description(description)
                .latitude(latitude)
                .longitude(longitude)
                .image(imageBytes)
                .dateAndTimeOfObservation(observationTime)
                .individualOrColony(individualOrColony)
                .flying(flying)
                .moveOption(moveOption)
                .typeOfBuilding(typeOfBuilding)
                .userId(user.getId())
                .dateAndTimeOfAddingLocation(LocalDateTime.now())
                .build();

        // Save the location
        Location savedLocation = locationService.addLocation(location);

        // Convert to DTO and return
        LocationDto responseDto = locationDtoConverter.createFromEntity(savedLocation);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }


    // Get all locations
    @GetMapping
    public List<LocationDto> getAllLocations() {
        // Fetch all locations and convert to DTOs
        return locationService.getAllLocations().stream()
                .map(locationDtoConverter::createFromEntity)
                .collect(Collectors.toList());
    }

    // Get all locations for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LocationDto>> getLocationsByUserId(@PathVariable String userId) {
        // Fetch locations by userId and convert to DTOs
        List<LocationDto> locations = locationService.getLocationsByUserId(userId).stream()
                .map(locationDtoConverter::createFromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(locations);
    }
    @GetMapping("/username/{username}")
    public ResponseEntity<List<LocationDto>> getLocationsByUsername(@PathVariable String username) {
        // Fetch locations by userId and convert to DTOs
        List<LocationDto> locations = locationService.getLocationsByUsername(username).stream()
                .map(locationDtoConverter::createFromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(locations);
    }

    // Get location for a specific ID
    @GetMapping("/{locationId}")
    public ResponseEntity<LocationDto> getLocationById(@PathVariable String locationId) {
        // Fetch the location by ID and convert to DTO
        Location location = locationService.getLocationById(locationId);
        LocationDto locationDto = locationDtoConverter.createFromEntity(location);

        return ResponseEntity.ok(locationDto);
    }

    // Delete a location
    @DeleteMapping("/{locationId}")
    public ResponseEntity<Void> deleteLocation(@PathVariable String locationId) {
        locationService.deleteLocation(locationId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{locationId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LocationDto> updateLocation(
            @PathVariable String locationId,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String latitude,
            @RequestParam(required = false) String longitude,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) LocalDateTime dateAndTimeOfObservation,
            @RequestParam(required = false) String individualOrColony,
            @RequestParam(required = false) String flying,
            @RequestParam(required = false) String moveOption,
            @RequestParam(required = false) String typeOfBuilding
    ) throws IOException {
        // Retrieve the existing location to ensure certain fields remain unchanged
        Location existingLocation = locationService.getLocationById(locationId);

        if (existingLocation == null) {
            return ResponseEntity.notFound().build(); // Handle if location not found
        }

        // Get the authenticated user
        User user = userService.getUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        // Convert MultipartFile to byte array if present
        byte[] imageBytes = (image != null && !image.isEmpty()) ? image.getBytes() : existingLocation.getImage();

        // Create updated Location entity with new data while preserving certain fields
        Location updatedLocation = Location.builder()
                .id(existingLocation.getId()) // Preserve ID
                .description(description != null ? description : existingLocation.getDescription())
                .latitude(latitude != null ? latitude : existingLocation.getLatitude())
                .longitude(longitude != null ? longitude : existingLocation.getLongitude())
                .image(imageBytes)
                .dateAndTimeOfObservation(dateAndTimeOfObservation != null ? dateAndTimeOfObservation : existingLocation.getDateAndTimeOfObservation())
                .individualOrColony(individualOrColony != null ? individualOrColony : existingLocation.getIndividualOrColony())
                .flying(flying != null ? flying : existingLocation.getFlying())
                .moveOption(moveOption != null ? moveOption : existingLocation.getMoveOption())
                .typeOfBuilding(typeOfBuilding != null ? typeOfBuilding : existingLocation.getTypeOfBuilding())
                .dateAndTimeOfAddingLocation(existingLocation.getDateAndTimeOfAddingLocation()) // Preserve unchanged
                .userId(user.getId()) // Updated with authenticated user
                .build();

        // Update the location in the service
        Location savedLocation = locationService.updateLocation(locationId, updatedLocation);

        // Convert the saved location to DTO
        LocationDto responseDto = locationDtoConverter.createFromEntity(savedLocation);

        return ResponseEntity.ok(responseDto);
    }



}




