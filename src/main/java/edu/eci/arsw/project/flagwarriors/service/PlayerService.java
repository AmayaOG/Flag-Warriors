package edu.eci.arsw.project.flagwarriors.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.eci.arsw.project.flagwarriors.model.Player;
import edu.eci.arsw.project.flagwarriors.repository.PlayerRepository;


@Service
public class PlayerService {

    @Autowired
    PlayerRepository playerRepository;

    public Player createPlayer(String username, int score) {
        Player player = new Player();
        return playerRepository.save(player);
    }
}
