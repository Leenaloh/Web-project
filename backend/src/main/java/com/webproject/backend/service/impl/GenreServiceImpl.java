package com.webproject.backend.service;

import com.webproject.backend.model.Genre;
import com.webproject.backend.service.serviceInterface.GenreService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreServiceImpl implements GenreService {

    private final JdbcTemplate jdbc;

    public GenreServiceImpl(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Genre> getAllGenres() {
        String sql = "SELECT id, name FROM genres ORDER BY name ASC";
        return jdbc.query(sql, (rs, rowNum) ->
                new Genre(rs.getInt("id"), rs.getString("name"))
        );
    }
}