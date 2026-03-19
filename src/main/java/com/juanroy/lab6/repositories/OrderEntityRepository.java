package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.OrderEntity;
import com.juanroy.lab6.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {
    OrderEntity getOrderEntitiesById(Long id);

    List<OrderEntity> findAllByUser(UserEntity user);
}
