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

            Team teamA = new Team("EquipoA");
            Team teamB = new Team("EquipoB");
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

    public void captureFlag(Long id){
        Player p = getPlayerById(id);
        p.setFlag(true);
        updatePlayer(p);
        
    }


    public Player updatePlayer(Player updatedPlayer) {
    
        if (playerRepository.findById(updatedPlayer.getId()).orElse(null) != null) {

            updatedPlayer.setName(updatedPlayer.getName());
            updatedPlayer.setScore(updatedPlayer.getScore());
            updatedPlayer.setFlag(updatedPlayer.isFlag());
            updatedPlayer.setTeam(updatedPlayer.getTeam());
    
            return playerRepository.save(updatedPlayer);
        }
        
        return null;
    }
    
    

    public Player getPlayerByName(String name){
        return playerRepository.findByName(name);
    }

    public Player getPlayerById(Long id){
        return playerRepository.findById(id).orElse(null);
    }

    public List<Player> getAllPlayers(){
        return playerRepository.findAll();
    }
}

