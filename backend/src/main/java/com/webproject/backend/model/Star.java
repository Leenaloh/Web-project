package com.webproject.backend.model;

import java.util.List;

public class Star {

  private String id;
  private String name;
  private Integer birthYear;
  private List<Movie> movies;

  public Star() {}

  public Star(String id, String name, Integer birthYear, List<Movie> movies) {
    this.id = id;
    this.name = name;
    this.birthYear = birthYear;
    this.movies = movies;
  }


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getBirthYear() {
    return birthYear;
  }

  public void setBirthYear(Integer birthYear) {
    this.birthYear = birthYear;
  }

  public List<Movie> getMovies() {
    return movies;
  }

  public void setMovies(List<Movie> movies) {
    this.movies = movies;
  }
}
