package edu.eci.arsw.project.flagwarriors.api;

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
    public ResponseEntity<Player> createPlayer(@RequestParam String nombre) {
        Player newPlayer = playerService.savePlayer(nombre, 0);
        return new ResponseEntity<>(newPlayer, HttpStatus.CREATED);
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
