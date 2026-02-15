package com.webproject.backend.service.impl;

import com.webproject.backend.model.Genre;
import com.webproject.backend.service.serviceInterface.GenreService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GenreServiceImpl implements GenreService {

    @Override
    public List<Genre> getAllGenres() {
        return new ArrayList<>(); 
    }
}
