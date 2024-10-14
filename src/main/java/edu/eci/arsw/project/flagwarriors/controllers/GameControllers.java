
package edu.eci.arsw.project.flagwarriors.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class GameControllers {
    @GetMapping("/lobby")
    public String lobby() {
        return "lobby"; 
    }
    @GetMapping("/game")
    public String game() {
        return "game"; 
    }
   
}

