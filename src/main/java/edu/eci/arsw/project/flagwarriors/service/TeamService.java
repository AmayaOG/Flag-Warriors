package edu.eci.arsw.project.flagwarriors.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.eci.arsw.project.flagwarriors.model.Player;
import edu.eci.arsw.project.flagwarriors.model.Team;
import edu.eci.arsw.project.flagwarriors.repository.PlayerRepository;
import edu.eci.arsw.project.flagwarriors.repository.TeamRepository;

@Service
public class TeamService {
    


    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    public Team getTeamById(Long id) {
        Optional<Team> team = teamRepository.findById(id);
        return team.orElse(null); 
    }
    
    public Team getTeamByName(String name) {
        return teamRepository.findByName(name);
    }

     public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public void saveTeam(Team team) {
        teamRepository.save(team);
    }
}
