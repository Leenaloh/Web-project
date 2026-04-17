package com.webproject.backend.movie.entity.Repository;

import com.webproject.backend.movie.entity.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditCardRepository extends JpaRepository<CreditCard, String> {
}