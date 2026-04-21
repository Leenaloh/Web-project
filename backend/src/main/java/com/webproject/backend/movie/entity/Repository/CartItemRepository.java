package com.webproject.backend.movie.entity.Repository;

import com.webproject.backend.movie.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  @Query(
      """
           select ci
           from CartItem ci
           join fetch ci.movie m
           join fetch ci.customer c
           where c.id = :customerId
           order by m.title
           """)
  List<CartItem> findAllByCustomerId(Integer customerId);

  Optional<CartItem> findByIdAndCustomerId(Long id, Integer customerId);

  void deleteByCustomerId(Integer customerId);
}
