package com.webproject.backend.integration;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.webproject.backend.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockitoSpyBean private AuthServiceImpl authServiceImpl;

  @Test
  void login_integration_callsRealService_andReturns200Json() throws Exception {
    String validJson =
        """
        { "useremail": "user@example.com", "password": "secret" }
        """;

    mockMvc
        .perform(
            post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(validJson))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(authServiceImpl).login(org.mockito.ArgumentMatchers.any());
  }

  @Test
  void login_missingBody_integration_returns400() throws Exception {
    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());
  }

  @Test
  void logout_integration_callsRealService_andReturns200() throws Exception {
    mockMvc.perform(post("/api/v1/auth/logout")).andExpect(status().isOk());

    verify(authServiceImpl).logout();
  }

  @Test
  void me_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(get("/api/v1/auth/me"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(authServiceImpl).me();
  }
}
