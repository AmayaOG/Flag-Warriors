var apiclient = (function () {
    var apiUrl = "http://localhost:8080/api/players";

    return {

        createPlayer: function (player, callback) {
            $.ajax({
                url: apiUrl,
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
            $.get(apiUrl, function (data) {
                callback(data);
            }).fail(function (error) {
                console.error("Error al obtener jugadores:", error);
            });
        },

        captureFlag: function (playerId, callback) {
            $.ajax({
                url: `${apiUrl}/${playerId}/capture-flag`, 
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
