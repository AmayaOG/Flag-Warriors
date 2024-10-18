package edu.eci.arsw.project.flagwarriors.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.eci.arsw.project.flagwarriors.model.Player; // Asegúrate de importar la entidad correcta

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByName(String name);
}