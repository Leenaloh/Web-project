package com.webproject.backend.integration;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.webproject.backend.TestConfig;
import com.webproject.backend.model.Star;
import com.webproject.backend.service.impl.StarServiceImpl;
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
class StarsIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockitoSpyBean private StarServiceImpl starServiceImpl;

  @Test
  void getStarById_whenFound_integration_returns200Json() throws Exception {
    doReturn(new Star()).when(starServiceImpl).getStarById("nm001");

    mockMvc
        .perform(get("/api/v1/stars/nm001"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(starServiceImpl).getStarById("nm001");
  }

  @Test
  void getStarById_whenNotFound_integration_returns404() throws Exception {
    doReturn(null).when(starServiceImpl).getStarById("nm999");

    mockMvc.perform(get("/api/v1/stars/nm999")).andExpect(status().isNotFound());

    verify(starServiceImpl).getStarById("nm999");
  }
}
