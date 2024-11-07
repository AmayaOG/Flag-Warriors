# Etapa 1: Construcción y configuración de la aplicación Node.js
FROM node:16-alpine AS node-build

# Establece el directorio de trabajo para Node.js
WORKDIR /usr/src/app/node

# Copia los archivos package.json y package-lock.json
COPY src/main/websocket/package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia el código de la aplicación Node.js
COPY src/main/websocket .

# Expone el puerto para Node.js
EXPOSE 8081

# Comando para ejecutar la aplicación Node.js
CMD ["node", "server.js"]

# Etapa 2: Construcción y configuración de la aplicación Spring Boot
FROM openjdk:17-jdk-alpine AS spring-boot-build

# Establece el directorio de trabajo para Spring Boot
WORKDIR /usr/src/app/springboot

# Copia el JAR de la aplicación Spring Boot
COPY target/flag-warriors-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto para Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "app.jar"]
