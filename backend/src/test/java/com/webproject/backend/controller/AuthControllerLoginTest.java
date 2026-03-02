package com.webproject.backend.controller;

import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
class AuthControllerLoginTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private AuthService authService;

  // TC1: Successful login SHOULD create session attributes (FAIL الآن)
  @Test
  void login_success_shouldCreateSession() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body = "{\"useremail\":\"test@ksu.edu.sa\",\"password\":\"1234\"}";

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        // ❌ FAIL الآن لأن AuthController ما يحط session attributes
        .andExpect(request().sessionAttribute("userId", notNullValue()))
        .andExpect(request().sessionAttribute("name", notNullValue()));
  }

  // TC2: Empty JSON SHOULD be 400 (FAIL الآن لأن الكنترولر ما عنده validation)
  @Test
  void login_emptyJson_shouldReturn400() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content("{}"))
        // ❌ FAIL الآن (غالبًا بيرجع 200)
        .andExpect(status().isBadRequest());
  }

  // TC3: Missing password SHOULD be 400 (FAIL الآن)
  @Test
  void login_missingPassword_shouldReturn400() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body = "{\"useremail\":\"test@ksu.edu.sa\"}";

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
        // ❌ FAIL الآن (غالبًا بيرجع 200)
        .andExpect(status().isBadRequest());
  }

  // TC4: Wrong credentials SHOULD return 401 (FAIL الآن لأن الكنترولر يرجع 200)
  @Test
  void login_wrongCredentials_shouldReturn401() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body = "{\"useremail\":\"test@ksu.edu.sa\",\"password\":\"WRONG\"}";

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
        // ❌ FAIL الآن (بيرجع 200)
        .andExpect(status().isUnauthorized());
  }
}
