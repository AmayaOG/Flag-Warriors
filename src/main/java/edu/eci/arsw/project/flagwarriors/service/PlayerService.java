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
        List<Team> teams = teamRepository.findAll();
       
        Team teamToAssign = teams.get(playerCount % 2);
        String path = teamToAssign.getPath();
        player.setPath(path);
        
        Team managedTeam = teamRepository.findById(teamToAssign.getId())
        .orElseThrow(() -> new RuntimeException("Team not found"));
        
        if (managedTeam.getAllPlayers().size() < 4) {
            managedTeam.addPlayer(player);
            player.setTeam(managedTeam);
            playerCount++;
            return playerRepository.save(player);   
        } 

        return null;
    }

    public Boolean captureFlag(Long id){
        Player p = getPlayerById(id);
        if (p == null) {
            return false; // Si el jugador no existe, retorna false
        }
        if (p.isFlag()) {
            return false; // Si ya tiene la bandera, retorna false
        }
    
        p.setFlag(true);
        updatePlayer(p);
        return true;
        
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

