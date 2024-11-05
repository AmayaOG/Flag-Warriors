package edu.eci.arsw.project.flagwarriors.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Player> players;

    @Column(name = "imagen_path")
    private String imagenPath;

    @Column(name = "score", nullable = false)
    private int score = 0;

    public Team() {
        this.players = new ArrayList<>();
    }

    public Team(String name, String imagenPath) {
        this.name = name;
        this.players = new ArrayList<>();
        this.imagenPath = imagenPath;
    }

    // Getters y Setters
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

    public List<Player> getPlayers() {
        return players;
    }

    public void addPlayer(Player player) {
        players.add(player);
        player.setTeam(this); // Asignar el equipo al jugador
    }

    public List<Player> getAllPlayers() {
        return players;
    }

    public String getPath() {
        return this.imagenPath;
    }

    public void setImagenPath(String imagenPath) {
        this.imagenPath = imagenPath;
    }

    public int getScore() {
        return this.score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
