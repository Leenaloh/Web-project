package com.webproject.backend.movie.entity.Repository;

import com.webproject.backend.movie.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, String> {
}