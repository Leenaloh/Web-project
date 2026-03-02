package com.webproject.backend.integration;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.webproject.backend.TestConfig;
import com.webproject.backend.model.Movie;
import com.webproject.backend.service.impl.MovieServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestConfig.class)
class MovieIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockitoSpyBean private MovieServiceImpl movieServiceImpl;

  @Test
  void searchMovies_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/movies")
                .param("title", "abc")
                .param("year", "1999")
                .param("director", "Dir")
                .param("starName", "Star")
                .param("page", "2")
                .param("pageSize", "10"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieServiceImpl).searchMovies("abc", 1999, "Dir", "Star", 2, 10);
  }

  @Test
  void searchMovies_noParams_integration_usesDefaultPageValues() throws Exception {
    mockMvc
        .perform(get("/api/v1/movies"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieServiceImpl).searchMovies(null, null, null, null, 1, 20);
  }

  @Test
  void browseByGenre_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/movies/browseByGenre")
                .param("genreId", "7")
                .param("page", "1")
                .param("pageSize", "20"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieServiceImpl).browseMoviesByGenre(7, 1, 20);
  }

  @Test
  void browseByGenre_missingGenreId_integration_returns400() throws Exception {
    mockMvc.perform(get("/api/v1/movies/browseByGenre")).andExpect(status().isBadRequest());
  }

  @Test
  void browseByGenre_noPageParams_integration_usesDefaultValues() throws Exception {
    mockMvc
        .perform(get("/api/v1/movies/browseByGenre").param("genreId", "3"))
        .andExpect(status().isOk());

    verify(movieServiceImpl).browseMoviesByGenre(3, 1, 20);
  }

  @Test
  void browseByFirstLetter_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(
            get("/api/v1/movies/browseByFirstLetter")
                .param("startsWith", "A")
                .param("page", "3")
                .param("pageSize", "5"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieServiceImpl).browseMoviesByFirstLetter("A", 3, 5);
  }

  @Test
  void browseByFirstLetter_missingStartsWith_integration_returns400() throws Exception {
    mockMvc.perform(get("/api/v1/movies/browseByFirstLetter")).andExpect(status().isBadRequest());
  }

  @Test
  void getMovieById_whenFound_integration_returns200Json() throws Exception {
    doReturn(new Movie()).when(movieServiceImpl).getMovieById("tt001");

    mockMvc
        .perform(get("/api/v1/movies/tt001"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieServiceImpl).getMovieById("tt001");
  }

  @Test
  void getMovieById_whenNotFound_integration_returns404() throws Exception {
    doReturn(null).when(movieServiceImpl).getMovieById("tt999");

    mockMvc.perform(get("/api/v1/movies/tt999")).andExpect(status().isNotFound());

    verify(movieServiceImpl).getMovieById("tt999");
  }
}
