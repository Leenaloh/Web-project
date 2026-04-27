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
            LEFT JOIN ratings r ON m.id = r.movieid
            LEFT JOIN stars_in_movies sim ON m.id = sim.movieid
            LEFT JOIN stars s ON sim.starid = s.id
            WHERE 1=1
            """);

    StringBuilder countSql =
        new StringBuilder(
            """
            SELECT COUNT(DISTINCT m.id)
            FROM movies m
            LEFT JOIN stars_in_movies sim ON m.id = sim.movieid
            LEFT JOIN stars s ON sim.starid = s.id
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
                    rs.getObject("rating") != null ? rs.getDouble("rating") : null,
                    null,
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
        JOIN genres_in_movies gim ON m.id = gim.movieid
        LEFT JOIN ratings r ON m.id = r.movieid
        WHERE gim.genreid = ?
        ORDER BY m.title
        LIMIT ? OFFSET ?
        """;

    String countSql =
        """
        SELECT COUNT(*)
        FROM movies m
        JOIN genres_in_movies gim ON m.id = gim.movieid
        WHERE gim.genreid = ?
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
                    rs.getObject("rating") != null ? rs.getDouble("rating") : null,
                    null,
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
          LEFT JOIN ratings r ON m.id = r.movieid
          WHERE m.title ~ '^[^A-Za-z0-9]'
          ORDER BY m.title
          LIMIT ? OFFSET ?
          """;

      countSql =
          """
          SELECT COUNT(*)
          FROM movies m
          WHERE m.title ~ '^[^A-Za-z0-9]'
          """;

      dataParams = new Object[] {pageSize, offset};
      countParams = new Object[] {};
    } else {
      dataSql =
          """
          SELECT m.id, m.title, m.year, m.director, r.rating
          FROM movies m
          LEFT JOIN ratings r ON m.id = r.movieid
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
                    rs.getObject("rating") != null ? rs.getDouble("rating") : null,
                    null,
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
    String movieSql =
        """
        SELECT m.id, m.title, m.year, m.director, r.rating
        FROM movies m
        LEFT JOIN ratings r ON m.id = r.movieid
        WHERE m.id = ?
        """;

    Movie movie;
    try {
      movie =
          jdbcTemplate.queryForObject(
              movieSql,
              (rs, rowNum) ->
                  new Movie(
                      rs.getString("id"),
                      rs.getString("title"),
                      rs.getInt("year"),
                      rs.getString("director"),
                      rs.getObject("rating") != null ? rs.getDouble("rating") : null,
                      null,
                      new ArrayList<>(),
                      new ArrayList<>()),
              id);
    } catch (org.springframework.dao.EmptyResultDataAccessException e) {
      return null;
    }

    String genresSql =
        """
        SELECT g.name
        FROM genres g
        JOIN genres_in_movies gim ON g.id = gim.genreid
        WHERE gim.movieid = ?
        ORDER BY g.name
        """;

    List<String> genres = jdbcTemplate.query(genresSql, (rs, rowNum) -> rs.getString("name"), id);
    movie.setGenres(genres);

    String starsSql =
        """
        SELECT s.id, s.name
        FROM stars s
        JOIN stars_in_movies sim ON s.id = sim.starid
        WHERE sim.movieid = ?
        ORDER BY s.name
        """;

    List<com.webproject.backend.model.Star> stars =
        jdbcTemplate.query(
            starsSql,
            (rs, rowNum) -> {
              com.webproject.backend.model.Star star = new com.webproject.backend.model.Star();
              star.setId(rs.getString("id"));
              star.setName(rs.getString("name"));
              return star;
            },
            id);

    movie.setStars(stars);
    return movie;
  }

  @Override
  public List<String> autocompleteTitles(String query) {
    if (query == null || query.trim().isEmpty()) {
      return List.of();
    }

    String sql =
        """
        SELECT DISTINCT m.title
        FROM movies m
        WHERE LOWER(m.title) LIKE LOWER(?)
        ORDER BY m.title
        LIMIT 8
        """;

    return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("title"), query.trim() + "%");
  }
}
