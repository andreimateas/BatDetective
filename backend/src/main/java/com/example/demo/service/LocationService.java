package com.example.demo.service;

import com.example.demo.model.Location;
import com.example.demo.model.User;
import com.example.demo.repository.ILocationsRepository;
import com.example.demo.repository.IUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private ILocationsRepository locationsRepository;

    @Autowired
    private IUsersRepository usersRepository;

    // Get all locations
    public List<Location> getAllLocations() {
        return locationsRepository.findAll();
    }

    // Create location
    public Location addLocation(Location location) {
        // Validate that the user exists
        String userId = location.getUserId();
        if (!usersRepository.existsById(userId)) {
            throw new IllegalArgumentException("User with ID " + userId + " does not exist.");
        }

        // Handle the new logic for "Flying" and other fields
        if ("Flying".equalsIgnoreCase(location.getFlying())) {
            location.setMoveOption("");
            location.setTypeOfBuilding("");
        } else {
            // If not "Flying," ensure moveOption and typeOfBuilding are set correctly
            location.setFlying("");
        }

        // Set the current date and time if not already set
        if (location.getDateAndTimeOfAddingLocation() == null) {
            location.setDateAndTimeOfAddingLocation(LocalDateTime.now());
        }

        // Save the location
        return locationsRepository.save(location);
    }

    // Get location for specific user
    public List<Location> getLocationsByUserId(String userId) {
        return locationsRepository.findByUserId(userId);
    }
    public List<Location> getLocationsByUsername(String username) {
        List<Location> loc =locationsRepository.findAll();
        List<Location> l = new ArrayList<>();
        System.out.println("locatii pt username: "+username);
        for(Location location:loc){
            String userId = location.getUserId();
            boolean ex = usersRepository.existsById(userId);
            if(ex) {
                Optional<User> user = usersRepository.findById(userId);
                System.out.println("compar " + user.get().getUsername() + " cu " + username);
                if (Objects.equals(user.get().getUsername(), username)) {
                    l.add(location);
                }
            }
        }
        return l;
    }

    // Get specific location
    public Location getLocationById(String locationId) {
        return locationsRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location with ID " + locationId + " not found."));
    }

    // Delete specific location
    public void deleteLocation(String locationId) {
        locationsRepository.deleteById(locationId);
    }

    // Update specific location
    public Location updateLocation(String locationId, Location updatedLocation) {
        return locationsRepository.findById(locationId).map(location -> {
            location.setDescription(updatedLocation.getDescription());
            location.setLatitude(updatedLocation.getLatitude());
            location.setLongitude(updatedLocation.getLongitude());
            location.setDateAndTimeOfObservation(updatedLocation.getDateAndTimeOfObservation());
            location.setDateAndTimeOfAddingLocation(updatedLocation.getDateAndTimeOfAddingLocation());
            location.setImage(updatedLocation.getImage());
            location.setIndividualOrColony(updatedLocation.getIndividualOrColony());

            // Handle new logic for "Flying" and other fields
            if ("Flying".equalsIgnoreCase(updatedLocation.getFlying())) {
                location.setMoveOption("");
                location.setTypeOfBuilding("");
                location.setFlying("Flying");
            } else {
                location.setFlying("");
                location.setMoveOption(updatedLocation.getMoveOption());
                location.setTypeOfBuilding(updatedLocation.getTypeOfBuilding());
            }

            location.setUserId(updatedLocation.getUserId());
            return locationsRepository.save(location);
        }).orElseThrow(() -> new RuntimeException("Location not found with id: " + locationId));
    }
}
