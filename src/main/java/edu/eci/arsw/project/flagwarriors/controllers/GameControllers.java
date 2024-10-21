
package edu.eci.arsw.project.flagwarriors.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class GameControllers {

    @RequestMapping(value = "/lobby", method = RequestMethod.GET)
    public String iniciarJuego(){
        return "lobby";
    }
    @GetMapping("/game")
    public String game() {
        return "game"; 
    }

    @GetMapping("/error")
    public String error() {
        return "error"; 
    }
   
}

