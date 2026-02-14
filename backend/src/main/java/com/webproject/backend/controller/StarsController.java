package com.webproject.backend.controller;

import com.webproject.backend.model.Star;
import com.webproject.backend.model.StarsPageState;
import com.webproject.backend.service.serviceInterface.StarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/stars")
public class StarsController {

    @Autowired
    private StarService starService;

    /**
     * Search stars based on optional filtering conditions.
     *
     * @param name     optional star name or partial name
     * @param birthYear optional birth year
     * @param movieTitle optional movie title to filter stars who appeared in that movie
     * @param page     page number for pagination (default is 1)
     * @param pageSize number of stars per page (default is 20)
     * @return StarsPageState containing the list of matching stars and pagination information
     */
    @GetMapping
    public ResponseEntity<StarsPageState> searchStars(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer birthYear,
            @RequestParam(required = false) String movieTitle,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize
    ) {
        StarsPageState result =
                starService.searchStars(name, birthYear, movieTitle, page, pageSize);

        return ResponseEntity.ok(result);
    }

    /**
     * Retrieve a single star by its unique identifier.
     *
     * @param id unique identifier of the star
     * @return Star object if found, otherwise returns 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Star> getStarById(@PathVariable String id) {
        Star star = starService.getStarById(id);

        if (star == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(star);
    }
}
