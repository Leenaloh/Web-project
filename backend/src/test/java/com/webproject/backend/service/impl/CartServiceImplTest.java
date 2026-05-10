package com.webproject.backend.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import com.webproject.backend.model.CartState;
import com.webproject.backend.model.CheckoutRequest;
import com.webproject.backend.movie.entity.Customer;
import com.webproject.backend.movie.entity.Movie;
import com.webproject.backend.movie.entity.Repository.CartItemRepository;
import com.webproject.backend.movie.entity.Repository.CustomerRepository;
import com.webproject.backend.movie.entity.Repository.MovieRepository;

import jakarta.servlet.http.HttpSession;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

  @Mock private CartItemRepository cartItemRepository;
  @Mock private MovieRepository movieRepository;
  @Mock private CustomerRepository customerRepository;
  @Mock private JdbcTemplate jdbcTemplate;

  private final Map<Integer, Map<String, com.webproject.backend.movie.entity.CartItem>> cartStore =
      new HashMap<>();
  private final Map<Integer, Customer> customers = new HashMap<>();
  private final Map<String, Movie> movies = new HashMap<>();
  private final AtomicLong idSequence = new AtomicLong(1);

  @BeforeEach
  void setUp() {
    customers.put(1, createCustomer(1, "Alice"));
    customers.put(2, createCustomer(2, "Bob"));

    movies.put("tt0328500", createMovie("tt0328500", "The Matrix", "Wachowski", 1999));
    movies.put("tt0461892", createMovie("tt0461892", "The Prestige", "Christopher Nolan", 2006));

    when(customerRepository.findById(anyInt()))
        .thenAnswer(invocation -> Optional.ofNullable(customers.get(invocation.getArgument(0))));

    when(movieRepository.findById(anyString()))
        .thenAnswer(invocation -> Optional.ofNullable(movies.get(invocation.getArgument(0))));

    when(cartItemRepository.findAllByCustomerId(anyInt()))
        .thenAnswer(invocation -> getCartItemsForCustomer(invocation.getArgument(0)));

    when(cartItemRepository.findByCustomerIdAndMovieId(anyInt(), anyString()))
        .thenAnswer(
            invocation ->
                Optional.ofNullable(
                    cartStore
                        .getOrDefault(invocation.getArgument(0), Map.of())
                        .get(invocation.getArgument(1))));

    when(cartItemRepository.save(any(com.webproject.backend.movie.entity.CartItem.class)))
        .thenAnswer(
            invocation -> {
              com.webproject.backend.movie.entity.CartItem entity = invocation.getArgument(0);

              if (entity.getId() == null) {
                entity.setId(idSequence.getAndIncrement());
              }

              cartStore
                  .computeIfAbsent(entity.getCustomer().getId(), ignored -> new HashMap<>())
                  .put(entity.getMovie().getId(), entity);

              return entity;
            });

    lenient()
        .doAnswer(
            invocation -> {
              com.webproject.backend.movie.entity.CartItem entity = invocation.getArgument(0);
              Map<String, com.webproject.backend.movie.entity.CartItem> customerItems =
                  cartStore.get(entity.getCustomer().getId());

              if (customerItems != null) {
                customerItems.remove(entity.getMovie().getId());
              }

              return null;
            })
        .when(cartItemRepository)
        .delete(any(com.webproject.backend.movie.entity.CartItem.class));

    lenient()
        .doAnswer(
            invocation -> {
              cartStore.remove(invocation.getArgument(0));
              return null;
            })
        .when(cartItemRepository)
        .deleteByCustomerId(anyInt());

    lenient()
        .when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), any(), any()))
        .thenReturn(1);

    lenient()
        .when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), any(), any(), any(), any(), any()))
        .thenReturn(1);
  }

  @Test
  void customerA_addsItem_andSeesItInOwnCart() {
    HttpSession customerSession = sessionWithCustomerId(1);
    CartServiceImpl cartService = createService(customerSession);

    CartState cartState = cartService.addItem("tt0328500", 2);

    assertEquals(1, cartState.getItems().size());
    assertEquals("tt0328500", cartState.getItems().get(0).getMovieId());
    assertEquals("The Matrix", cartState.getItems().get(0).getTitle());
    assertEquals(2, cartState.getItems().get(0).getQuantity());
    assertEquals(0, cartState.getItems().get(0).getUnitPrice(), 0.001);
    assertEquals(0, cartState.getItems().get(0).getSubtotal(), 0.001);
    assertEquals(0, cartState.getTotalPrice(), 0.001);
  }

  @Test
  void customerB_doesNotSeeCustomerACart() {
    CartServiceImpl customerAService = createService(sessionWithCustomerId(1));
    CartServiceImpl customerBService = createService(sessionWithCustomerId(2));

    customerAService.addItem("tt0328500", 1);

    CartState customerBCart = customerBService.getCart();

    assertTrue(customerBCart.getItems().isEmpty());
    assertEquals(0, customerBCart.getTotalPrice(), 0.001);
  }

  @Test
  void customerA_cartPersistsAcrossLogoutAndLogin() {
    CartServiceImpl firstLoginService = createService(sessionWithCustomerId(1));

    firstLoginService.addItem("tt0461892", 3);

    CartServiceImpl secondLoginService = createService(sessionWithCustomerId(1));
    CartState cartState = secondLoginService.getCart();

    assertEquals(1, cartState.getItems().size());
    assertEquals("The Prestige", cartState.getItems().get(0).getTitle());
    assertEquals(3, cartState.getItems().get(0).getQuantity());
    assertEquals(0, cartState.getTotalPrice(), 0.001);
  }

  @Test
  void checkout_clearsOnlyCurrentCustomersCart() {
    CartServiceImpl customerAService = createService(sessionWithCustomerId(1));
    CartServiceImpl customerBService = createService(sessionWithCustomerId(2));

    customerAService.addItem("tt0328500", 1);
    customerBService.addItem("tt0461892", 2);

    customerAService.checkout(validCheckoutRequest());

    assertTrue(customerAService.getCart().getItems().isEmpty());
    assertEquals(1, customerBService.getCart().getItems().size());
    assertEquals("The Prestige", customerBService.getCart().getItems().get(0).getTitle());
  }

  private CartServiceImpl createService(HttpSession session) {
    return new CartServiceImpl(
        session, cartItemRepository, movieRepository, customerRepository, jdbcTemplate);
  }

  private CheckoutRequest validCheckoutRequest() {
    CheckoutRequest request = new CheckoutRequest();
    request.setCustomerId(1);
    request.setCreditCardId("123456789");
    request.setFirstName("Alice");
    request.setLastName("Tester");
    request.setExpiration("2027-01-01");
    return request;
  }

  private HttpSession sessionWithCustomerId(int customerId) {
    HttpSession session = mock(HttpSession.class);
    when(session.getAttribute("customerId")).thenReturn(customerId);
    return session;
  }

  private List<com.webproject.backend.movie.entity.CartItem> getCartItemsForCustomer(
      Integer customerId) {
    List<com.webproject.backend.movie.entity.CartItem> items =
        new ArrayList<>(cartStore.getOrDefault(customerId, Map.of()).values());

    items.sort(Comparator.comparing(item -> item.getMovie().getTitle()));

    return items;
  }

  private Customer createCustomer(int id, String firstName) {
    Customer customer = new Customer();
    customer.setId(id);
    customer.setFirstName(firstName);
    customer.setLastName("Tester");
    customer.setEmail(firstName.toLowerCase() + "@example.com");
    customer.setPassword("secret");
    customer.setAddress("Riyadh");
    return customer;
  }

  private Movie createMovie(String id, String title, String director, int year) {
    Movie movie = new Movie();
    movie.setId(id);
    movie.setTitle(title);
    movie.setDirector(director);
    movie.setYear(year);
    return movie;
  }
}
