package edu.eci.arsw.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"edu.eci.arsw.project.flagwarriors"})
public class FlagwarriorsApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlagwarriorsApplication.class, args);
		
	}
}
