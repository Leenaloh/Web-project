package com.webproject.backend.service.impl;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.Star;
import com.webproject.backend.service.serviceInterface.StarService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class StarServiceImpl implements StarService {

  private final JdbcTemplate jdbcTemplate;

  public StarServiceImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Cacheable(value = "starDetails", key = "#id")
  @Override
  public Star getStarById(String id) {

    String starSql =
        """
        SELECT id, name, birthyear
        FROM stars
        WHERE id = ?
        """;

    List<Star> stars =
        jdbcTemplate.query(
            starSql,
            new Object[] {id},
            (rs, rowNum) ->
                new Star(
                    rs.getString("id"),
                    rs.getString("name"),
                    rs.getObject("birthyear", Integer.class),
                    new ArrayList<>()));

    if (stars.isEmpty()) {
      return null;
    }

    Star star = stars.get(0);

    String moviesSql =
        """
        SELECT m.id, m.title, m.year, m.director, r.rating
        FROM stars_in_movies sim
        JOIN movies m ON m.id = sim.movieid
        LEFT JOIN ratings r ON r.movieid = m.id
        WHERE sim.starid = ?
        ORDER BY m.title
        """;

    List<Movie> movies =
        jdbcTemplate.query(
            moviesSql,
            new Object[] {id},
            (rs, rowNum) ->
                new Movie(
                    rs.getString("id"),
                    rs.getString("title"),
                    rs.getInt("year"),
                    rs.getString("director"),
                    rs.getObject("rating") != null ? rs.getDouble("rating") : null,
                    null,
                    List.of(),
                    List.of()));

    star.setMovies(movies);

    return star;
  }
}
