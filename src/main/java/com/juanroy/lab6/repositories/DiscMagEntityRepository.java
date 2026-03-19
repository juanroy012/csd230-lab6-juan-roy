package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.DiscMagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscMagEntityRepository extends JpaRepository<DiscMagEntity, Long> {
    DiscMagEntity findById(long id);
}
