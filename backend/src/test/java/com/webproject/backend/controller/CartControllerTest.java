package com.webproject.backend.controller;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.model.CheckoutResponse;
import com.webproject.backend.service.serviceInterface.CartService;

@WebMvcTest(CartController.class)
public class CartControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private CartService cartService;

  // GetCart()

  @Test
  void getCartValid() throws Exception {
    when(cartService.getCart()).thenReturn(new CartState());

    mockMvc
        .perform(get("/api/v1/cart"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON));

    verify(cartService).getCart();
  }

  @Test
  void getCartUnvalid() throws Exception {
    when(cartService.getCart()).thenThrow(new RuntimeException("Database down"));

    mockMvc.perform(get("/api/v1/cart")).andExpect(status().isInternalServerError());
  }

  // additem()

  @Test
  void addItemValid() throws Exception {
    when(cartService.addItem(anyString(), anyInt())).thenReturn(new CartState());

    mockMvc
        .perform(post("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "2"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON));

    verify(cartService).addItem("tt0264464", 2);
  }

  @Test
  void addItemMissingMovieId() throws Exception {
    mockMvc
        .perform(post("/api/v1/cart/items").param("quantity", "2"))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(cartService);
  }

  @Test
  void addItemQuantityIsString() throws Exception {
    mockMvc
        .perform(post("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "five"))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(cartService);
  }

  // updateItemQuantity()

  @Test
  void updateItemQuantityValid() throws Exception {
    when(cartService.updateItemQuantity(anyString(), anyInt())).thenReturn(new CartState());

    mockMvc
        .perform(put("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "5"))
        .andExpect(status().isOk());

    verify(cartService).updateItemQuantity("tt0264464", 5);
  }

    @Test
    void updateItemQuantityQuantityMissing() throws Exception {
        mockMvc.perform(put("/api/v1/cart/items")
                        .param("movieId", "tt0264464"))
                .andExpect(status().isBadRequest());
    }

  @Test
  void updateItemQuantityToZero() throws Exception {
    when(cartService.updateItemQuantity(anyString(), eq(0)))
        .thenThrow(new IllegalArgumentException("Quantity must be greater than zero"));

    mockMvc
        .perform(put("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "0"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void updateItemQuantityNegative() throws Exception {
    when(cartService.updateItemQuantity(anyString(), eq(-2)))
        .thenThrow(new IllegalArgumentException("Quantity must be greater than zero"));

    mockMvc
        .perform(put("/api/v1/cart/items").param("movieId", "tt0264464").param("quantity", "-2"))
        .andExpect(status().isBadRequest());
  }

  // removeItem()

  @Test
  void removeItemValid() throws Exception {
    when(cartService.removeItem(anyString())).thenReturn(new CartState());

    mockMvc.perform(delete("/api/v1/cart/items/tt0264464")).andExpect(status().isOk());

    verify(cartService).removeItem("tt0264464");
  }

  @Test
  void removeItemInvalidId() throws Exception {
    when(cartService.removeItem(eq("invalidId")))
        .thenThrow(new IllegalArgumentException("Invalid ID format"));

    mockMvc.perform(delete("/api/v1/cart/items/invalidId")).andExpect(status().isBadRequest());
  }

  // clearcart()

  @Test
  void clearCartValid() throws Exception {
    when(cartService.clearCart()).thenReturn(new CartState());

    mockMvc.perform(delete("/api/v1/cart")).andExpect(status().isOk());

    verify(cartService).clearCart();
  }

  // checkout()

  @Test
  void checkout_shouldReturnOkStatus() throws Exception {
    when(cartService.checkout(any(CheckoutRequest.class))).thenReturn(new CheckoutResponse());

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
        .andExpect(content().contentType(MediaType.APPLICATION_JSON));

    verify(cartService).checkout(any(CheckoutRequest.class));
  }

  @Test
  void checkoutEmptyCart() throws Exception {
    when(cartService.checkout(any(CheckoutRequest.class)))
        .thenThrow(new IllegalStateException("Cannot checkout with an empty cart"));

    String validJson =
        "{ \"customerFirstName\": \"John\", \"customerLastName\": \"Doe\", \"expiration\": \"12/2026\" }";

    mockMvc
        .perform(
            post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validJson))
        .andExpect(status().isBadRequest());
  }

  @Test
  void checkoutMissingRequiredField() throws Exception {
    when(cartService.checkout(any(CheckoutRequest.class)))
        .thenThrow(new IllegalArgumentException("Missing required field: customerFirstName"));

    String missingFieldJson = "{ \"customerLastName\": \"Doe\", \"expiration\": \"12/2026\" }";

    mockMvc
        .perform(
            post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(missingFieldJson))
        .andExpect(status().isBadRequest());
  }

  @Test
  void checkoutInvalidPaymentInformation() throws Exception {
    when(cartService.checkout(any(CheckoutRequest.class)))
        .thenThrow(new IllegalArgumentException("Invalid or expired payment information"));

    String invalidPaymentJson =
        "{ \"customerFirstName\": \"John\", \"customerLastName\": \"Doe\", \"expiration\": \"01/2000\" }";

    mockMvc
        .perform(
            post("/api/v1/cart/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidPaymentJson))
        .andExpect(status().isBadRequest());
  }
}