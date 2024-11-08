package edu.eci.arsw.project.flagwarriors.model;

import java.net.http.WebSocket;

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
    
    @Column(name = "initialx",nullable = true)
    private int x;
    
    
    @Column(name = "initialy",nullable = true)
    private int y;
    
  

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
    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
    @Override
public String toString() {
    return "Player{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", score=" + score +
            ", flag=" + flag +
            ", team=" + (team != null ? team.getName() : "No team") + // Muestra el nombre del equipo si está presente
            ", path='" + path + '\'' +
            ", x=" + x +
            ", y=" + y +
            '}';
}
}
