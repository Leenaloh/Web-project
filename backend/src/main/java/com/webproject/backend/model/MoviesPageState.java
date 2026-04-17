package com.webproject.backend.model;

import java.util.List;

public class MoviesPageState {

  private List<Movie> movies;
  private int page;
  private int pageSize;
  private long totalResults;
  private int totalPages;

  public MoviesPageState() {}

  public MoviesPageState(
      List<Movie> movies, int page, int pageSize, long totalResults, int totalPages) {
    this.movies = movies;
    this.page = page;
    this.pageSize = pageSize;
    this.totalResults = totalResults;
    this.totalPages = totalPages;
  }

  public List<Movie> getMovies() {
    return movies;
  }

  public void setMovies(List<Movie> movies) {
    this.movies = movies;
  }

  public int getPage() {
    return page;
  }

  public void setPage(int page) {
    this.page = page;
  }

  public int getPageSize() {
    return pageSize;
  }

  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }

  public long getTotalResults() {
    return totalResults;
  }

  public void setTotalResults(long totalResults) {
    this.totalResults = totalResults;
  }

  public int getTotalPages() {
    return totalPages;
  }

  public void setTotalPages(int totalPages) {
    this.totalPages = totalPages;
  }
}
