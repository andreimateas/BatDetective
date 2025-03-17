package com.example.demo.security.token;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends MongoRepository<UserToken, String> {  // Folosim String pentru ID, care este default în MongoDB
    // Căutare pe baza ID-ului utilizatorului
    @Query("{'user.id': ?0}")  // Folosim sintaxa MongoDB pentru a căuta pe baza ID-ului utilizatorului
    Optional<UserToken> findByUserId(@Param("id") Long id);

    // Căutare pe baza token-ului
    @Query("{'token': ?0}")  // Căutare pe baza token-ului
    Optional<UserToken> findByToken(@Param("token") String token);
}