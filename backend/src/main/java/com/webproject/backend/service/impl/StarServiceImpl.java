package com.webproject.backend.service.impl;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.Star;
import com.webproject.backend.service.serviceInterface.StarService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class StarServiceImpl implements StarService {

  private final JdbcTemplate jdbcTemplate;

  public StarServiceImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

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
        SELECT m.id, m.title, m.year, m.director
        FROM movies m
        JOIN stars_in_movies sim ON m.id = sim.movieId
        WHERE sim.starId = ?
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
                    null,
                    List.of(),
                    List.of()));

    star.setMovies(movies);
    return star;
  }
}
