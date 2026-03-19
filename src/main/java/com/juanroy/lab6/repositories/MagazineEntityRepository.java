package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.MagazineEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MagazineEntityRepository extends JpaRepository<MagazineEntity, Long> {
    MagazineEntity findById(long id);
}
