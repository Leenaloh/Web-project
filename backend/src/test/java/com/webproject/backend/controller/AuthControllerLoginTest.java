package com.webproject.backend.controller;

import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest; 
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerLoginTest {

  @Autowired private MockMvc mockMvc;

  // ✅ نفس البنات: MockitoBean بدل MockBean
  @org.springframework.test.context.bean.override.mockito.MockitoBean
  private AuthService authService;

  @Test
  void login_shouldReturn200_whenValidJsonBody() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body = "{\"useremail\":\"test@ksu.edu.sa\",\"password\":\"1234\"}";

    mockMvc.perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    Mockito.verify(authService).login(any());
  }

  @Test
  void login_shouldReturn400_whenBodyMissing() throws Exception {
    mockMvc.perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());

    Mockito.verify(authService, Mockito.never()).login(any());
  }

  @Test
  void login_shouldReturn200_whenEmptyJsonObject() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    mockMvc.perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
        .andExpect(status().isOk());

    Mockito.verify(authService).login(any());
  }

  @Test
  void login_shouldReturn400_whenInvalidJson() throws Exception {
    mockMvc.perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{invalid-json"))
        .andExpect(status().isBadRequest());

    Mockito.verify(authService, Mockito.never()).login(any());
  }

  @Test
  void login_shouldReturn415_whenWrongContentType() throws Exception {
    mockMvc.perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.TEXT_PLAIN)
                .content("hello"))
        .andExpect(status().isUnsupportedMediaType());

    Mockito.verify(authService, Mockito.never()).login(any());
  }

  @Test
  void login_shouldReturn415_whenNoContentType() throws Exception {
    mockMvc.perform(
            post("/api/v1/auth/login")
                .content("{\"useremail\":\"a\",\"password\":\"b\"}"))
        .andExpect(status().isUnsupportedMediaType());

    Mockito.verify(authService, Mockito.never()).login(any());
  }

  @Test
  void login_shouldReturn200_whenJsonHasExtraFields() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body =
        "{\"useremail\":\"x@ksu.edu.sa\",\"password\":\"1234\",\"extra\":\"anything\",\"role\":\"admin\"}";

    mockMvc.perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk());

    Mockito.verify(authService).login(any());
  }
}