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


    @PostMapping
    public ResponseEntity<?> createPlayer(@RequestBody Player player) {
        if (player.getName() == null || player.getName().isEmpty()) {
            return new ResponseEntity<>("El nombre no puede estar vacío", HttpStatus.BAD_REQUEST);
        }
        
        if (playerService.getPlayerByName(player.getName()) != null) {
            return new ResponseEntity<>("El nombre ya está en uso", HttpStatus.CONFLICT);
        }

        Player savedPlayer = playerService.savePlayer(player);
        return new ResponseEntity<>(savedPlayer, HttpStatus.CREATED);
    }


    
    
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerbyId(@PathVariable long id) {
        Player player = playerService.getPlayerById(id);
        if (player != null) {
            return new ResponseEntity<>(player, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/capture-flag")
    public ResponseEntity<?> captureFlag(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);

        
        if (player == null) {
            return new ResponseEntity<>("Jugador no encontrado", HttpStatus.NOT_FOUND);
        }

        boolean success = playerService.captureFlag(id);         
        if (success) {
            return new ResponseEntity<>("Bandera capturada con éxito", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se pudo capturar la bandera", HttpStatus.BAD_REQUEST);
        }

    }
    
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return new ResponseEntity<>(players, HttpStatus.OK);
    }
    

}
