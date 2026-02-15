package com.webproject.backend.controller;

import com.webproject.backend.model.Star;
import com.webproject.backend.service.serviceInterface.StarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stars")
public class StarsController {

  @Autowired private StarService starService;

  /** Get star details + the movies they appeared in */
  @GetMapping("/{id}")
  public ResponseEntity<Star> getStarById(@PathVariable String id) {
    Star star = starService.getStarById(id);

    if (star == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(star);
  }
}
