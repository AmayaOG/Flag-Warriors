package edu.eci.arsw.project.flagwarriors.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "players")

public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "score", nullable = false)
    private int score;

    @Column(name = "flag",nullable = true)
    private boolean flag;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team; 

    @Column(name = "path",nullable = true)
    private String path;

    public Player() {
    }

    public Player(Long id,String name, int score,boolean flag) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.flag=flag;
        
    }

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

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public boolean isFlag() {
        return flag;
    }
    
    public void setFlag(boolean flag) {
        this.flag = flag;
    }
    public String getPath() {
        return path;  
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
}
