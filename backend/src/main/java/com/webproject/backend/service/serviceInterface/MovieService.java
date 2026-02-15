package com.webproject.backend.service.serviceInterface;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.MoviesPageState;

public interface MovieService {
  MoviesPageState searchMovies(
      String title, Integer year, String director, String starName, int page, int pageSize);

  MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize);

  MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize);

  Movie getMovieById(String id);
}
