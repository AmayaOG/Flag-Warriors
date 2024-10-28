package edu.eci.arsw.project.flagwarriors.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.eci.arsw.project.flagwarriors.model.Player;
import edu.eci.arsw.project.flagwarriors.service.PlayerService;

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

    @PutMapping("/{id}/capture-flag")
    public ResponseEntity<?> captureFlag(@RequestBody Player updatedPlayer) {
        
        if (playerService.getPlayerById(updatedPlayer.getId()) == null) {
            return new ResponseEntity<>("Jugador no encontrado", HttpStatus.NOT_FOUND);
        }
        updatedPlayer.setFlag(true);
        playerService.updatePlayer(updatedPlayer); 
        
        return new ResponseEntity<>(updatedPlayer, HttpStatus.OK);
    }
    
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return new ResponseEntity<>(players, HttpStatus.OK);
    }
    

}
