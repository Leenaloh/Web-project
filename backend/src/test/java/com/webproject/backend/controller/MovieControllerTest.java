package com.webproject.backend.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.webproject.backend.model.Movie;
import com.webproject.backend.model.MoviesPageState;
import com.webproject.backend.service.serviceInterface.MovieService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MovieController.class)
class MovieControllerTest {

  @Autowired private MockMvc mockMvc;

  @org.springframework.test.context.bean.override.mockito.MockitoBean
  private MovieService movieService;

  

  @Test
  void searchMovies_shouldReturn200_andCallServiceWithCorrectArgs() throws Exception {

    when(movieService.searchMovies(eq("abc"), eq(1999), eq("Dir"), eq("Star"), eq(2), eq(10)))
        .thenReturn(new MoviesPageState());

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

    verify(movieService).searchMovies("abc", 1999, "Dir", "Star", 2, 10);
  }


  @Test
  void browseByGenre_shouldReturn200_andCallService() throws Exception {
    when(movieService.browseMoviesByGenre(eq(7), eq(1), eq(20))).thenReturn(new MoviesPageState());

    mockMvc
        .perform(get("/api/v1/movies/browseByGenre").param("genreId", "7"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieService).browseMoviesByGenre(7, 1, 20);
  }

  @Test
  void browseByGenre_missingGenreId_shouldReturn400() throws Exception {
    mockMvc.perform(get("/api/v1/movies/browseByGenre")).andExpect(status().isBadRequest());
  }

  @Test
  void browseByFirstLetter_shouldReturn200_andCallService() throws Exception {
    when(movieService.browseMoviesByFirstLetter(eq("A"), eq(3), eq(5))).thenReturn(new MoviesPageState());

    mockMvc
        .perform(
            get("/api/v1/movies/browseByFirstLetter")
                .param("startsWith", "A")
                .param("page", "3")
                .param("pageSize", "5"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieService).browseMoviesByFirstLetter("A", 3, 5);
  }

  @Test
  void browseByFirstLetter_missingStartsWith_shouldReturn400() throws Exception {
    mockMvc.perform(get("/api/v1/movies/browseByFirstLetter")).andExpect(status().isBadRequest());
  }

  @Test
  void getMovieById_whenFound_shouldReturn200_andCallService() throws Exception {
    when(movieService.getMovieById(eq("tt001"))).thenReturn(new Movie());

    mockMvc
        .perform(get("/api/v1/movies/tt001"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(movieService).getMovieById("tt001");
  }

  @Test
  void getMovieById_whenNotFound_shouldReturn404() throws Exception {
    when(movieService.getMovieById(eq("missing"))).thenReturn(null);

    mockMvc.perform(get("/api/v1/movies/missing")).andExpect(status().isNotFound());

    verify(movieService).getMovieById("missing");
  }
}
