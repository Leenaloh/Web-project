
package com.webproject.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DbHealthController {

    private final JdbcTemplate jdbc;

    public DbHealthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/health/db")
    public Map<String, Object> healthDb() {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM movies", Integer.class);
        return Map.of("db", "ok", "moviesCount", count);
    }
}