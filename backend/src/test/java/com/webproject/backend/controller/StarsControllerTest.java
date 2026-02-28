package com.webproject.backend.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.webproject.backend.model.Star;
import com.webproject.backend.service.serviceInterface.StarService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(StarsController.class)
class StarsControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private StarService starService;

  @Test
  void getStarById_whenFound_shouldReturn200_andCallService() throws Exception {
    when(starService.getStarById(eq("nm001"))).thenReturn(new Star());

    mockMvc
        .perform(get("/api/v1/stars/nm001"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(starService).getStarById("nm001");
  }

  @Test
  void getStarById_whenNotFound_shouldReturn404() throws Exception {
    when(starService.getStarById(eq("missing"))).thenReturn(null);

    mockMvc.perform(get("/api/v1/stars/missing")).andExpect(status().isNotFound());

    verify(starService).getStarById("missing");
  }
}
