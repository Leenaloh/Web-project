package com.webproject.backend.integration;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.webproject.backend.service.impl.StarServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class StarsIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockitoSpyBean private StarServiceImpl starServiceImpl;

  @Test
  void getStarById_whenFound_integration_returns200Json() throws Exception {
    mockMvc
        .perform(get("/api/v1/stars/nm0817431"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(starServiceImpl).getStarById("nm0817431");
  }

  @Test
  void getStarById_whenNotFound_integration_returns404() throws Exception {
    mockMvc.perform(get("/api/v1/stars/nm000000000000")).andExpect(status().isNotFound());

    verify(starServiceImpl).getStarById("nm000000000000");
  }
}
