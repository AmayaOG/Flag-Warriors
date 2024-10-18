package edu.eci.arsw.project.flagwarriors.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.eci.arsw.project.flagwarriors.model.Player; 

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    Player findByName(String name);

}