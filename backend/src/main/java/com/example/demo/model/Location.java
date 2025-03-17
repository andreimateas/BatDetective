package com.example.demo.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "locations")
@Data // Lombok generates getters, setters, toString, equals, and hashCode methods automatically
@NoArgsConstructor // Lombok generates a no-argument constructor
@AllArgsConstructor // Lombok generates a constructor with arguments for all fields
@Builder
public class Location {

    @Id
    private String id; // MongoDB will generate an ObjectId if this is left as null

    private String description;
    private String latitude;
    private String longitude;
    private byte[] image;
    // Automatically set when the location is created
    private LocalDateTime dateAndTimeOfAddingLocation;

    // Manually set by the user
    private LocalDateTime dateAndTimeOfObservation;

    // Additional attributes
    private String individualOrColony; // "Individual" or "Colony"
    private String flying; // "Flying" or ""
    private String moveOption;  // "Entering" or "Exiting" or "Standing" or ""
    private String typeOfBuilding;     // "..." or ""

    private String userId; // ID of the associated use
}
