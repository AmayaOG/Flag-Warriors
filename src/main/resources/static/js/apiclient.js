var apiclient = (function () {
    var apiUrl = "http://localhost:8080/api/players";

    return {


        createPlayer: function (player,callback){
        console.log(player);
        $.ajax({
            url: apiUrl,
            method: "PUT",
            data: JSON.stringify(player),
            contentType: "application/json",
            function(response) {
                callback(response);
            },

        });
        },

        getAllPlayers: function (callback) {
            $.get(apiUrl, function (data) {
                callback(data);
            });
        }


    };
})();