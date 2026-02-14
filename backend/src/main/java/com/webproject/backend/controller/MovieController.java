package com.webproject.backend.controller;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.MoviesPageState;
import com.webproject.backend.service.serviceInterface.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    /**
     * Search movies based on optional filtering conditions.
     *
     * @param title    optional movie title or partial title
     * @param year     optional release year
     * @param director optional director name
     * @param starName optional star name
     * @param page     page number for pagination (default is 1)
     * @param pageSize number of movies per page (default is 20)
     * @return MoviesPageState containing the list of matching movies and pagination information
     */
    @GetMapping
    public ResponseEntity<MoviesPageState> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String director,
            @RequestParam(required = false) String starName,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        MoviesPageState result =
                movieService.searchMovies(title, year, director, starName, page, pageSize);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/test")
public String testMovies() {
    return "Backend is working 🚀";
}


    /**
     * Browse movies by genre.
     *
     * @param genreId  genre identifier used to filter movies
     * @param page     page number for pagination (default is 1)
     * @param pageSize number of movies per page (default is 20)
     * @return MoviesPageState containing the list of movies filtered by genre
     */
    @GetMapping("/browseByGenre")
    public ResponseEntity<MoviesPageState> browseMoviesByGenre(
            @RequestParam Integer genreId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        MoviesPageState result =
                movieService.browseMoviesByGenre(genreId, page, pageSize);

        return ResponseEntity.ok(result);
    }

    /**
     * Browse movies by the first letter of the movie title.
     *
     * @param startsWith starting letter of the movie title
     * @param page       page number for pagination (default is 1)
     * @param pageSize   number of movies per page (default is 20)
     * @return MoviesPageState containing the list of movies that match the given starting letter
     */
    @GetMapping("/browseByFirstLetter")
    public ResponseEntity<MoviesPageState> browseMoviesByFirstLetter(
            @RequestParam String startsWith,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        MoviesPageState result =
                movieService.browseMoviesByFirstLetter(startsWith, page, pageSize);

        return ResponseEntity.ok(result);
    }

    /**
     * Retrieve a single movie by its unique identifier.
     *
     * @param id unique identifier of the movie
     * @return Movie object if found, otherwise returns 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        Movie movie = movieService.getMovieById(id);

        if (movie == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(movie);
    }
}
