
package edu.eci.arsw.project.flagwarriors.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import edu.eci.arsw.project.flagwarriors.model.Player;
import edu.eci.arsw.project.flagwarriors.service.PlayerService;


@Controller
public class GameControllers {

    @Autowired
    private PlayerService playerService;

    @RequestMapping(value = "/lobby", method = RequestMethod.GET)
    public String iniciarJuego(){
        //playerService.createPlayer(nombre,0);
        return "lobby"; 
    }
    @GetMapping("/game")
    public String game() {
        return "game"; 
    }
   
}

