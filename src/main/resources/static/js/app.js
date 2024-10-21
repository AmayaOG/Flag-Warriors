var app = (function () {
    var score = 0;

    return {
        createPlayer: function () {
            var nombre = document.getElementById("nombre").value;
         
            var player = { name: nombre, score: 0 };
            apiclient.createPlayer(player, function () {               
            });
            window.location.href = "/lobby";
            
        }
    };
})();
