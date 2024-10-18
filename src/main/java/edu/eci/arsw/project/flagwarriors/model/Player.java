package edu.eci.arsw.project.flagwarriors.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;


@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "id") 
    private Long id;

    @Column(name = "name", nullable = false) 
    private String name;

    @Column(name = "score", nullable = false) 
    private int score;

    // Constructor vacío
    public Player() {
    }

    // Constructor con parámetros
    public Player(String name, int score) {
        this.name = name;
        this.score = score;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
