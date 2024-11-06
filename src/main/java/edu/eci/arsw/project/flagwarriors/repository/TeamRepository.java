package edu.eci.arsw.project.flagwarriors.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.eci.arsw.project.flagwarriors.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Team findByName(String name); 
    long count(); 

}
