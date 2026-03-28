package com.webproject.backend.service.impl;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.MoviesPageState;
import com.webproject.backend.service.serviceInterface.MovieService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class MovieServiceImpl implements MovieService {

  private final JdbcTemplate jdbcTemplate;

  public MovieServiceImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public MoviesPageState searchMovies(
      String title, Integer year, String director, String starName, int page, int pageSize) {

    int offset = (page - 1) * pageSize;

    StringBuilder dataSql =
        new StringBuilder(
            """
            SELECT DISTINCT m.id, m.title, m.year, m.director, r.rating
            FROM movies m
            LEFT JOIN ratings r ON m.id = r.movieId
            LEFT JOIN stars_in_movies sim ON m.id = sim.movieId
            LEFT JOIN stars s ON sim.starId = s.id
            WHERE 1=1
            """);

    StringBuilder countSql =
        new StringBuilder(
            """
            SELECT COUNT(DISTINCT m.id)
            FROM movies m
            LEFT JOIN stars_in_movies sim ON m.id = sim.movieId
            LEFT JOIN stars s ON sim.starId = s.id
            WHERE 1=1
            """);

    List<Object> dataParams = new ArrayList<>();
    List<Object> countParams = new ArrayList<>();

    if (title != null && !title.isEmpty()) {
      dataSql.append(" AND LOWER(m.title) LIKE LOWER(?)");
      countSql.append(" AND LOWER(m.title) LIKE LOWER(?)");
      dataParams.add("%" + title + "%");
      countParams.add("%" + title + "%");
    }

    if (year != null) {
      dataSql.append(" AND m.year = ?");
      countSql.append(" AND m.year = ?");
      dataParams.add(year);
      countParams.add(year);
    }

    if (director != null && !director.isEmpty()) {
      dataSql.append(" AND LOWER(m.director) LIKE LOWER(?)");
      countSql.append(" AND LOWER(m.director) LIKE LOWER(?)");
      dataParams.add("%" + director + "%");
      countParams.add("%" + director + "%");
    }

    if (starName != null && !starName.isEmpty()) {
      dataSql.append(" AND LOWER(s.name) LIKE LOWER(?)");
      countSql.append(" AND LOWER(s.name) LIKE LOWER(?)");
      dataParams.add("%" + starName + "%");
      countParams.add("%" + starName + "%");
    }

    dataSql.append(" ORDER BY m.title LIMIT ? OFFSET ?");
    dataParams.add(pageSize);
    dataParams.add(offset);

    List<Movie> movies =
        jdbcTemplate.query(
            dataSql.toString(),
            dataParams.toArray(),
            (rs, rowNum) ->
                new Movie(
                    rs.getString("id"),
                    rs.getString("title"),
                    rs.getInt("year"),
                    rs.getString("director"),
                    rs.getDouble("rating"),
                    List.of(),
                    List.of()));

    long totalResults =
        jdbcTemplate.queryForObject(countSql.toString(), Long.class, countParams.toArray());

    return buildPageState(movies, page, pageSize, totalResults);
  }

  @Override
  public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {

    int offset = (page - 1) * pageSize;

    String dataSql =
        """
        SELECT m.id, m.title, m.year, m.director, r.rating
        FROM movies m
        JOIN genres_in_movies gim ON m.id = gim.movieId
        LEFT JOIN ratings r ON m.id = r.movieId
        WHERE gim.genreId = ?
        ORDER BY m.title
        LIMIT ? OFFSET ?
        """;

    String countSql =
        """
        SELECT COUNT(*)
        FROM movies m
        JOIN genres_in_movies gim ON m.id = gim.movieId
        WHERE gim.genreId = ?
        """;

    List<Movie> movies =
        jdbcTemplate.query(
            dataSql,
            new Object[] {genreId, pageSize, offset},
            (rs, rowNum) ->
                new Movie(
                    rs.getString("id"),
                    rs.getString("title"),
                    rs.getInt("year"),
                    rs.getString("director"),
                    rs.getDouble("rating"),
                    List.of(),
                    List.of()));

    long totalResults = jdbcTemplate.queryForObject(countSql, Long.class, genreId);

    return buildPageState(movies, page, pageSize, totalResults);
  }

  @Override
  public MoviesPageState browseMoviesByFirstLetter(String startsWith, int page, int pageSize) {

    int offset = (page - 1) * pageSize;

    String dataSql;
    String countSql;
    Object[] dataParams;
    Object[] countParams;

    if ("*".equals(startsWith)) {
      dataSql =
          """
          SELECT m.id, m.title, m.year, m.director, r.rating
          FROM movies m
          LEFT JOIN ratings r ON m.id = r.movieId
          WHERE m.title !~ '^[A-Za-z]'
          ORDER BY m.title
          LIMIT ? OFFSET ?
          """;

      countSql =
          """
          SELECT COUNT(*)
          FROM movies m
          WHERE m.title !~ '^[A-Za-z]'
          """;

      dataParams = new Object[] {pageSize, offset};
      countParams = new Object[] {};
    } else {
      dataSql =
          """
          SELECT m.id, m.title, m.year, m.director, r.rating
          FROM movies m
          LEFT JOIN ratings r ON m.id = r.movieId
          WHERE LOWER(m.title) LIKE LOWER(?)
          ORDER BY m.title
          LIMIT ? OFFSET ?
          """;

      countSql =
          """
          SELECT COUNT(*)
          FROM movies m
          WHERE LOWER(m.title) LIKE LOWER(?)
          """;

      countParams = new Object[] {startsWith + "%"};
      dataParams = new Object[] {startsWith + "%", pageSize, offset};
    }

    List<Movie> movies =
        jdbcTemplate.query(
            dataSql,
            dataParams,
            (rs, rowNum) ->
                new Movie(
                    rs.getString("id"),
                    rs.getString("title"),
                    rs.getInt("year"),
                    rs.getString("director"),
                    rs.getDouble("rating"),
                    List.of(),
                    List.of()));

    long totalResults = jdbcTemplate.queryForObject(countSql, Long.class, countParams);

    return buildPageState(movies, page, pageSize, totalResults);
  }

  private MoviesPageState buildPageState(
      List<Movie> movies, int page, int pageSize, long totalResults) {
    int totalPages = (int) Math.ceil((double) totalResults / pageSize);
    return new MoviesPageState(movies, page, pageSize, totalResults, totalPages);
  }

  @Override
  public Movie getMovieById(String id) {
    return null;
  }
}
