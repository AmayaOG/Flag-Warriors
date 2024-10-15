
package edu.eci.arsw.project.flagwarriors.controllers;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
public class GameControllers {

    @RequestMapping(value = "/lobby", method = RequestMethod.GET)
    public String iniciarJuego(@RequestParam String nombre, Model model) {
        model.addAttribute("nombre", nombre);
        // Lógica adicional aquí, si es necesario
        return "lobby"; // Redirige a la vista "lobby"
    }
    @GetMapping("/game")
    public String game() {
        return "game"; 
    }
   
}

