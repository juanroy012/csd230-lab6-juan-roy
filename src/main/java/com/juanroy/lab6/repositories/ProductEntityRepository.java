package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductEntityRepository extends JpaRepository<ProductEntity, Long> {
}
