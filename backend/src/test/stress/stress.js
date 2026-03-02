import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Base configuration
const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";
const ENVIRONMENT = __ENV.ENV || "development";

// Custom metrics for tracking reliability and performance
const errorRate = new Rate("errors");
const movieErrors = new Rate("movie_errors");
const cartErrors = new Rate("cart_errors");
const checkoutErrors = new Rate("checkout_errors");

const movieTrend = new Trend("movie_duration");
const searchTrend = new Trend("search_duration");
const cartTrend = new Trend("cart_duration");
const checkoutTrend = new Trend("checkout_duration");

// Stress test configuration (ramping load)
export const options = {
  scenarios: {
    stress_test: {
      executor: "ramping-vus",
      stages: [
        { duration: "30s", target: 10 },
        { duration: "45s", target: 25 },
        { duration: "45s", target: 50 },
        { duration: "30s", target: 75 },
        { duration: "20s", target: 100 },
        { duration: "20s", target: 0 },
      ],
      gracefulRampDown: "10s",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1500"],
    http_req_failed: ["rate<0.30"],

    cart_errors: ["rate<0.10"],
    checkout_errors: ["rate<0.20"],

    search_duration: ["p(95)<1500"],
    movie_duration: ["p(95)<1500"],
    cart_duration: ["p(95)<1800"],
    checkout_duration: ["p(95)<2500"],
  },
};

// Sample movie IDs used during testing
const MOVIE_IDS = ["tt001", "tt002", "tt0264464", "tt010", "tt020"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Records error rate and response time for a feature
function recordGroupMetrics(groupRate, groupTrend, res, startTs) {
  const ok = res.status >= 200 && res.status < 300;
  groupRate.add(!ok);
  errorRate.add(!ok);
  groupTrend.add(Date.now() - startTs);
  return ok;
}

// Movie search endpoint
function moviesSearch() {
  const params = {
    headers: { Accept: "application/json" },
    timeout: "5s",
  };

  const start = Date.now();
  const url = `${BASE_URL}/api/v1/movies?title=a&page=1&pageSize=20`;
  const res = http.get(url, params);

  const ok = recordGroupMetrics(movieErrors, searchTrend, res, start);

  check(res, {
    "moviesSearch: status is 200": () => res.status === 200,
    "moviesSearch: returns json": () =>
      (res.headers["Content-Type"] || "").includes("application/json"),
  });

  return ok;
}

// Get movie details
function getMovieById() {
  const id = pick(MOVIE_IDS);

  const params = {
    headers: { Accept: "application/json" },
    timeout: "5s",
  };

  const start = Date.now();
  const res = http.get(`${BASE_URL}/api/v1/movies/${encodeURIComponent(id)}`, params);

  const ok = recordGroupMetrics(movieErrors, movieTrend, res, start);

  check(res, {
    "getMovieById: status 200 or 404": () =>
      res.status === 200 || res.status === 404,
  });

  return ok;
}

// Get cart contents
function getCart() {
  const params = {
    headers: { Accept: "application/json" },
    timeout: "5s",
  };

  const start = Date.now();
  const res = http.get(`${BASE_URL}/api/v1/cart`, params);

  const ok = recordGroupMetrics(cartErrors, cartTrend, res, start);

  check(res, {
    "getCart: status 200 or 500": () =>
      res.status === 200 || res.status === 500,
  });

  return ok;
}

// Add item to cart
function addToCart() {
  const id = pick(MOVIE_IDS);

  const params = {
    headers: { Accept: "application/json" },
    timeout: "5s",
  };

  const start = Date.now();
  const res = http.post(
    `${BASE_URL}/api/v1/cart/items?movieId=${encodeURIComponent(id)}&quantity=1`,
    null,
    params
  );

  const ok = recordGroupMetrics(cartErrors, cartTrend, res, start);

  check(res, {
    "addToCart: status 200 or 400": () =>
      res.status === 200 || res.status === 400,
  });

  return ok;
}

// Checkout endpoint
function checkout() {
  const payload = JSON.stringify({
    customerFirstName: "Test",
    customerLastName: "User",
    expiration: "12/2026",
  });

  const params = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: "6s",
  };

  const start = Date.now();
  const res = http.post(`${BASE_URL}/api/v1/cart/checkout`, payload, params);

  const ok = recordGroupMetrics(checkoutErrors, checkoutTrend, res, start);

  check(res, {
    "checkout: status 200 or 400": () =>
      res.status === 200 || res.status === 400,
  });

  return ok;
}

// Main traffic mix simulating whole application usage
export default function () {
  if (__VU === 1 && __ITER === 0) {
    console.log("Stress Test Running...");
    console.log(`Target URL: ${BASE_URL}`);
    console.log(`Environment: ${ENVIRONMENT}`);
  }

  const r = Math.random();

  if (r < 0.40) moviesSearch();
  else if (r < 0.65) getMovieById();
  else if (r < 0.80) getCart();
  else if (r < 0.92) addToCart();
  else checkout();

  sleep(Math.random() * 0.8);
}