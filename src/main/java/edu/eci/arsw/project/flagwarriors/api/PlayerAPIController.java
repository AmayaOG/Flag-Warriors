package edu.eci.arsw.project.flagwarriors.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.eci.arsw.project.flagwarriors.model.Player;
import edu.eci.arsw.project.flagwarriors.model.Team;
import edu.eci.arsw.project.flagwarriors.service.PlayerService;
import edu.eci.arsw.project.flagwarriors.service.TeamService;

@RestController
@RequestMapping("/api/players")
public class PlayerAPIController {

    @Autowired
    private PlayerService playerService;


    @PutMapping
    public ResponseEntity<?> createPlayer(@RequestBody Player player) {
    if (player.getName() == null || player.getName().isEmpty()) {
        return new ResponseEntity<>("El nombre no puede estar vacío", HttpStatus.BAD_REQUEST);
    }
    
    if (playerService.getPlayerByName(player.getName()) != null) {
        return new ResponseEntity<>("El nombre ya está en uso", HttpStatus.CONFLICT);
    }

    return new ResponseEntity<>(playerService.savePlayer(player), HttpStatus.CREATED);
}


    
    @GetMapping("/{name}")
    public ResponseEntity<Player> getPlayer(@PathVariable String name) {
        Player player = playerService.getPlayerByName(name);
        if (player != null) {
            return new ResponseEntity<>(player, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Métodos adicionales para actualizar y eliminar jugadores
}
