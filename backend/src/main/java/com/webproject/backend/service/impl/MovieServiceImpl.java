package com.webproject.backend.service.impl;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.MoviesPageState;
import com.webproject.backend.model.Star;
import com.webproject.backend.service.serviceInterface.MovieService;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class MovieServiceImpl implements MovieService {

  private final JdbcTemplate jdbcTemplate;

  public MovieServiceImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Cacheable(value = "movieSearch", key = "{#title, #year, #director, #starName, #page, #pageSize}")
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

    if (title != null && !title.isBlank()) {
      dataSql.append(" AND LOWER(m.title) LIKE LOWER(?)");
      countSql.append(" AND LOWER(m.title) LIKE LOWER(?)");
      dataParams.add("%" + title.trim() + "%");
      countParams.add("%" + title.trim() + "%");
    }

    if (year != null) {
      dataSql.append(" AND m.year = ?");
      countSql.append(" AND m.year = ?");
      dataParams.add(year);
      countParams.add(year);
    }

    if (director != null && !director.isBlank()) {
      dataSql.append(" AND LOWER(m.director) LIKE LOWER(?)");
      countSql.append(" AND LOWER(m.director) LIKE LOWER(?)");
      dataParams.add("%" + director.trim() + "%");
      countParams.add("%" + director.trim() + "%");
    }

    if (starName != null && !starName.isBlank()) {
      dataSql.append(" AND LOWER(s.name) LIKE LOWER(?)");
      countSql.append(" AND LOWER(s.name) LIKE LOWER(?)");
      dataParams.add("%" + starName.trim() + "%");
      countParams.add("%" + starName.trim() + "%");
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

    Long totalResults =
        jdbcTemplate.queryForObject(countSql.toString(), Long.class, countParams.toArray());

    attachStars(movies);

    return buildPageState(movies, page, pageSize, totalResults != null ? totalResults : 0);
  }

  @Cacheable(value = "moviesByGenre", key = "{#genreId, #page, #pageSize}")
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
        FROM genres_in_movies
        WHERE genreid = ?
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

    Long totalResults = jdbcTemplate.queryForObject(countSql, Long.class, genreId);

    attachStars(movies);

    return buildPageState(movies, page, pageSize, totalResults != null ? totalResults : 0);
  }

  @Cacheable(value = "moviesByFirstLetter", key = "{#startsWith, #page, #pageSize}")
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

      String prefix = startsWith.trim() + "%";
      dataParams = new Object[] {prefix, pageSize, offset};
      countParams = new Object[] {prefix};
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

    Long totalResults = jdbcTemplate.queryForObject(countSql, Long.class, countParams);

    attachStars(movies);

    return buildPageState(movies, page, pageSize, totalResults != null ? totalResults : 0);
  }

  @Cacheable(value = "movieDetails", key = "#id")
  @Override
  public Movie getMovieById(String id) {
    String sql =
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
              sql,
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
    } catch (EmptyResultDataAccessException e) {
      return null;
    }

    attachGenres(movie);
    attachStars(List.of(movie));

    return movie;
  }

  @Cacheable(value = "autocompleteTitles", key = "#query")
  @Override
  public List<String> autocompleteTitles(String query) {
    if (query == null || query.trim().isEmpty()) {
      return List.of();
    }

    String sql =
        """
        SELECT m.title
        FROM movies m
        WHERE LOWER(m.title) LIKE LOWER(?)
        ORDER BY m.title
        LIMIT 8
        """;

    return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("title"), query.trim() + "%");
  }

  @Cacheable(value = "topRatedMovies", key = "#pageSize")
  @Override
  public MoviesPageState getTopRatedMovies(int pageSize) {
    String sql =
        """
        SELECT m.id, m.title, m.year, m.director, r.rating
        FROM ratings r
        JOIN movies m ON m.id = r.movieid
        ORDER BY r.rating DESC, m.title
        LIMIT ?
        """;

    List<Movie> movies =
        jdbcTemplate.query(
            sql,
            new Object[] {pageSize},
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

    attachStars(movies);

    return buildPageState(movies, 1, pageSize, movies.size());
  }

  private void attachGenres(Movie movie) {
    String sql =
        """
        SELECT g.name
        FROM genres g
        JOIN genres_in_movies gim ON g.id = gim.genreid
        WHERE gim.movieid = ?
        ORDER BY g.name
        """;

    List<String> genres =
        jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("name"), movie.getId());

    movie.setGenres(genres);
  }

  private void attachStars(List<Movie> movies) {
    if (movies == null || movies.isEmpty()) {
      return;
    }

    List<String> movieIds = movies.stream().map(Movie::getId).toList();

    String placeholders = String.join(",", movieIds.stream().map(id -> "?").toList());

    String sql =
        """
        SELECT sim.movieid, s.id, s.name
        FROM stars_in_movies sim
        JOIN stars s ON s.id = sim.starid
        WHERE sim.movieid IN (
        """
            + placeholders
            + """
        )
        ORDER BY sim.movieid, s.name
        """;

    Map<String, List<Star>> starsByMovieId = new LinkedHashMap<>();

    for (String movieId : movieIds) {
      starsByMovieId.put(movieId, new ArrayList<>());
    }

    jdbcTemplate.query(
        sql,
        movieIds.toArray(),
        rs -> {
          Star star = new Star();
          star.setId(rs.getString("id"));
          star.setName(rs.getString("name"));

          String movieId = rs.getString("movieid");
          starsByMovieId.computeIfAbsent(movieId, key -> new ArrayList<>()).add(star);
        });

    for (Movie movie : movies) {
      movie.setStars(starsByMovieId.getOrDefault(movie.getId(), List.of()));
    }
  }

  private MoviesPageState buildPageState(
      List<Movie> movies, int page, int pageSize, long totalResults) {
    int totalPages = (int) Math.ceil((double) totalResults / pageSize);
    return new MoviesPageState(movies, page, pageSize, totalResults, totalPages);
  }
}
