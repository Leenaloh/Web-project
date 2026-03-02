package com.webproject.backend.integration;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.webproject.backend.TestConfig;
import com.webproject.backend.service.impl.CartServiceImpl;
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
class CartIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockitoSpyBean private CartServiceImpl cartServiceImpl;

  @Test
  void getCart_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(get("/api/v1/cart"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(cartServiceImpl).getCart();
  }

  @Test
  void addItem_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(post("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "2"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(cartServiceImpl).addItem("tt0264464", 2);
  }

  @Test
  void addItem_missingMovieId_integration_returns400() throws Exception {
    mockMvc
        .perform(post("/api/v1/cart/items").param("quantity", "2"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void addItem_noQuantity_integration_usesDefaultOfOne() throws Exception {
    mockMvc
        .perform(post("/api/v1/cart/items").param("movieId", "tt0264464"))
        .andExpect(status().isOk());

    verify(cartServiceImpl).addItem("tt0264464", 1);
  }

  @Test
  void updateItemQuantity_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(put("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "5"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(cartServiceImpl).updateItemQuantity("tt0264464", 5);
  }

  @Test
  void updateItemQuantity_missingQuantity_integration_returns400() throws Exception {
    mockMvc
        .perform(put("/api/v1/cart/items").param("movieId", "tt0264464"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void removeItem_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(delete("/api/v1/cart/items/tt0264464"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(cartServiceImpl).removeItem("tt0264464");
  }

  @Test
  void clearCart_integration_callsRealService_andReturns200Json() throws Exception {
    mockMvc
        .perform(delete("/api/v1/cart"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(cartServiceImpl).clearCart();
  }

  @Test
  void checkout_integration_callsRealService_andReturns200Json() throws Exception {
    String validJson =
        """
        {
            "customerFirstName": "John",
            "customerLastName": "Doe",
            "expiration": "12/2026"
        }
        """;

    mockMvc
        .perform(
            post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validJson))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

    verify(cartServiceImpl).checkout(org.mockito.ArgumentMatchers.any());
  }

  @Test
  void checkout_missingBody_integration_returns400() throws Exception {
    mockMvc
        .perform(post("/api/v1/cart/checkout").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());
  }
}
