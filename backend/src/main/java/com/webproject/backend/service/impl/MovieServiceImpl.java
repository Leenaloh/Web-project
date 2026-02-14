package com.webproject.backend.service.impl;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.MoviesPageState;
import com.webproject.backend.service.serviceInterface.MovieService;
import org.springframework.stereotype.Service;

@Service
public class MovieServiceImpl implements MovieService {

    @Override
    public MoviesPageState searchMovies(String title, Integer year, String director, String starName, int page, int pageSize) {
        return new MoviesPageState(); // TODO implement 
    }

    @Override
    public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {
        return new MoviesPageState(); 
    }

    @Override
    public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {
        return new MoviesPageState(); 
    }

    @Override
    public Movie getMovieById(String id) {
        return null; 
    }
}
