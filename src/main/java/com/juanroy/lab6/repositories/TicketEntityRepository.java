package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketEntityRepository extends JpaRepository<TicketEntity, Long> {
}

