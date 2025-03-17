package com.example.demo.repository;

import com.example.demo.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ILocationsRepository extends MongoRepository<Location, String> {
    // You can define custom queries if needed, for example:
    // User findByEmail(String email);
    List<Location> findByUserId(String userId);
}
