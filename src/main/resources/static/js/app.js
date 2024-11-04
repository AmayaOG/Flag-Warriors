var app = (function () {
    var score = 0;
    var playerId = 0; 

    return {
        createPlayer: function () {
            var nombre = document.getElementById("nombre").value;
            
            var player = { id: this.getPlayerId ,name: nombre, score: 0, flag: false };
            apiclient.createPlayer(player, function () {       
                       
            });

            apiclient.getAllPlayers(function(players) {
                if (players.length >= 8) { 
                    window.location.href = "/error"; 
                } else {
                    window.location.href = "/lobby"; 
                }
            });
            
            
        },

        captureFlag: function(id){
            
            apiclient.captureFlag(id);

        },

        getPlayerId: function () {
            playerId++;
            return this.playerId;
        }
    };
})();
