var app = (function () {
    var name;
    var api = apiclient;
    var score = 0;

    var createPlayer = function() {
        var player = {
        name: name,
        score:score

        }

    };



    return {
        createPlayer:createPlayer
    };
})();