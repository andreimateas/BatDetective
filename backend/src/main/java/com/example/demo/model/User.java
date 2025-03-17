package com.example.demo.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data // Lombok generates getters, setters, toString, equals, and hashCode methods automatically
@NoArgsConstructor // Lombok generates a no-argument constructor
@AllArgsConstructor // Lombok generates a constructor with arguments for all fields
@Builder
public class User {

    @Id
    private String id; // MongoDB will generate an ObjectId if this is left as null

    private String username;
    @Indexed(unique = true, collation = "en_US")
    private String email;
    private String password;
    private Role role;
    private boolean isEnabled;


}
