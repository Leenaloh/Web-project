package com.webproject.backend.integration;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
        { "useremail": "kwhite@ics185.edu", "password": "book" }
        """;

    mockMvc
        .perform(
            post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(validJson))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.status").value("SUCCESS"))
        .andExpect(jsonPath("$.userId").value("490003"))
        .andExpect(jsonPath("$.name").value("Keith White"));

    verify(authServiceImpl).login(org.mockito.ArgumentMatchers.any());
  }

  @Test
  void login_invalidCredentials_returns401() throws Exception {
    String invalidJson =
        """
        { "useremail": "kwhite@ics185.edu", "password": "wrong" }
        """;

    mockMvc
        .perform(
            post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(invalidJson))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value("FAIL"));
  }

  @Test
  void login_blankFields_returns400() throws Exception {
    String invalidJson = """
      { "useremail": "", "password": "" }
      """;

    mockMvc
        .perform(
            post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(invalidJson))
        .andExpect(status().isBadRequest());
  }
}
