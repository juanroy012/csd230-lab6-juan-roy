package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUsername(String username);
}

