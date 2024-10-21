var apiclient = (function () {
    var apiUrl = "http://localhost:8080/api/players";

    return {


        getPlayerByname: function (name, callback) {
            $.get(apiUrl + "/" + name, function (data) {
                callback(data);
            }).fail(function () {
                console.error("Error al obtener los planos del autor: " + name);
            });
        },

        createPlayer: function (player, 0,callback){
        $.ajax({
            url: apiUrl + "/" +player.name,
            method: "PUT",
            data: JSON.stringify(player),
            contentType: "application/json",
            function(response) {
                callback(response);
            },

        });
        }


    };
})();