package com.webproject.backend.service.impl;

import com.webproject.backend.model.Star;
import com.webproject.backend.model.StarsPageState;
import com.webproject.backend.service.serviceInterface.StarService;
import org.springframework.stereotype.Service;

@Service
public class StarServiceImpl implements StarService {

    @Override
    public StarsPageState searchStars(String name, Integer birthYear, String movieTitle, int page, int pageSize) {
        return new StarsPageState(); // TODO implement
    }

    @Override
    public Star getStarById(String id) {
        return null; 
    }
}
