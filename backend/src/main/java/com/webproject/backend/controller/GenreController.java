package com.webproject.backend.controller;

import com.webproject.backend.model.Genre;
import com.webproject.backend.service.serviceInterface.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/genres")
public class GenreController {

    @Autowired
    private GenreService genreService;

    /**.\gradlew bootRun 
     * Get all available genres.
     *
     * @return List of Genre objects
     */
    @GetMapping
    public ResponseEntity<List<Genre>> getAllGenres() {
        List<Genre> genres = genreService.getAllGenres();
        return ResponseEntity.ok(genres);
    }
}
