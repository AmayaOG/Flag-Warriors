package edu.eci.arsw.project.flagwarriors.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.eci.arsw.project.flagwarriors.model.Player;
import edu.eci.arsw.project.flagwarriors.model.Team;
import edu.eci.arsw.project.flagwarriors.repository.PlayerRepository;
import edu.eci.arsw.project.flagwarriors.repository.TeamRepository;


@Service
public class PlayerService {

    @Autowired
    PlayerRepository playerRepository;

    @Autowired TeamRepository teamRepository;

    private static int playerCount = 0;

    public Player savePlayer(Player player) {
        
        if (playerRepository.count() == 0) {

            Team teamA = new Team("Equipo A");
            Team teamB = new Team("Equipo B");
            teamRepository.save(teamA);
            teamRepository.save(teamB);
        }


        List<Team> teams = teamRepository.findAll();
       
        Team teamToAssign = teams.get(playerCount % 2);
        if (teamToAssign.getAllPlayers().size() < 4) {
            teamToAssign.addPlayer(player);
            player.setTeam(teamToAssign);
            playerCount++;
            return playerRepository.save(player);   
        } 

        return null;
    }
    

    public Player getPlayerByName(String name){
        return playerRepository.findByName(name);
    }

    public List<Player> getAllPlayers(){
        return playerRepository.findAll();
    }
}

