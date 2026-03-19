package com.juanroy.lab6.repositories;

import com.juanroy.lab6.entities.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BookEntityRepository extends JpaRepository<BookEntity, Long> {
    BookEntity findById(long id);
}
