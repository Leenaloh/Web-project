package com.webproject.backend.service.serviceInterface;

import com.webproject.backend.model.Star;
import com.webproject.backend.model.StarsPageState;

public interface StarService {
    StarsPageState searchStars(String name, Integer birthYear, String movieTitle, int page, int pageSize);
    Star getStarById(String id);
}
