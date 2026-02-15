package com.webproject.backend.model;

import java.util.List;

public class MoviesPageState {

  private List<Movie> movies;
  private int page;
  private int pageSize;
  private long totalResults; // total number of matching results
  private int totalPages; // total pages needed to display the result
}
