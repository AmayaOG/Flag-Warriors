var apiclient = (function () {
    var apiUrl = "http://localhost:8080/api";

    return {

        createPlayer: function (player, callback) {
            $.ajax({
                url: `${apiUrl}/players`,
                method: "PUT",
                data: JSON.stringify(player),
                contentType: "application/json",
                success: function (response) { 
                    callback(response);
                },
                error: function (error) {
                    console.error("Error al crear el jugador:", error);
                }
            });
        },

        getAllPlayers: function (callback) {
            $.get(`${apiUrl}/players`, function (data) {
                callback(data);
            }).fail(function (error) {
                console.error("Error al obtener jugadores:", error);
            });
        },
        renderPlayers: function (players) {
            const playersList = $('#players-list'); // Asegúrate de que este ID esté en el HTML
            playersList.empty(); // Limpia el contenido existente
        
            // Obtener y renderizar los jugadores de Equipo A
            this.getTeamByName("EquipoA", function (teamA) {
                playersList.append(`<h1>Equipo A</h1>`);
                playersList.append(`<table border="1"><tr><th>Jugador</th></tr>`);
                teamA.players.forEach(player => {
                    playersList.append(`<tr><td>${player.name}</td></tr>`);
                });
                playersList.append(`</table>`);
            });
        
            // Obtener y renderizar los jugadores de Equipo B
            this.getTeamByName("EquipoB", function (teamB) {
                playersList.append(`<h1>Equipo B</h1>`);
                playersList.append(`<table border="1"><tr><th>Jugador</th></tr>`);
                teamB.players.forEach(player => {
                    playersList.append(`<tr><td>${player.name}</td></tr>`);
                });
                playersList.append(`</table>`);
            });
        },
        getTeamByName: function (name, callback) {
            $.get(`${apiUrl}/teams/${name}`, function (data) {
                callback(data);
            }).fail(function (error) {
                console.error("Error al obtener equipos:", error);
            });
        },

        captureFlag: function (playerId, callback) {
            $.ajax({
                url: `${apiUrl}/players/${playerId}/capture-flag`, 
                method: "POST",
                success: function (response) {
                    callback(response);
                },
                error: function (error) {
                    console.error("Error al capturar la bandera:", error);
                }
            });
        }
    };
    
})();
$(document).ready(function () {
    const currentPage = window.location.pathname;
    if (currentPage === '/lobby') {
        apiclient.renderPlayers(); // Usar `renderPlayers` como callback
    }
});