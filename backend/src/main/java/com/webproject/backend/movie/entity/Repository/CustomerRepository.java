package com.webproject.backend.movie.entity.Repository;

import com.webproject.backend.movie.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("""
           select c
           from Customer c
           join fetch c.creditCard
           where c.id = :customerId
           """)
    Optional<Customer> findWithCreditCardById(Integer customerId);
}