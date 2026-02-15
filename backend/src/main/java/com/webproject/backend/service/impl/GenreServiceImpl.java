package com.webproject.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.webproject.backend.model.Genre;
import com.webproject.backend.service.serviceInterface.GenreService;

@Service
public class GenreServiceImpl implements GenreService {

    @Override
    public List<Genre> getAllGenres() {
        return new ArrayList<>(); 
    }
}
