package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.CartEntity;
import com.juanroy.lab6.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartEntityRepository extends JpaRepository<CartEntity, Long> {
    void removeById(Long id);

    CartEntity findByUser(UserEntity user);

}
