let suits = ["D", "H", "C", "S"]
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
var deck = new Array();
var players = new Array();
var currentPlayer = 0;

// Creating a deck of cards consisted of 52 cards divided into 4 suits
function createDeck() {
    deck = new Array();
    for (var i = 0 ; i < values.length; i++) {
        for(var x = 0; x < suits.length; x++) {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K") {
                weight = 10;
            } else if (values[i] == "A") {
                weight = 11;
            }
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}

// Shuffling the given deck of playing cards
function shuffle() {
    for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

// Creating a new player for the game
function createPlayers(num) {
    players = new Array();
    for(var i = 1; i <= num; i++)
    {
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}

// Render the existing players
function createPlayersUI() {
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++) {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

// Deal 2 cards for each players on the table
function dealHands() {
    // alternate handing cards to each player
    // 2 cards each
    for(var i = 0; i < 2; i++)
    {
        for (var x = 0; x < players.length; x++)
        {
            var card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
        }
    }

    updateDeck();
}

// Render the dealt cards of each player
function renderCard(card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

// A helper function of renderCard()
function getCardUI(card) {
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'H')
    icon='&hearts;';
    else if (card.Suit == 'S')
    icon = '&spades;';
    else if (card.Suit == 'D')
    icon = '&diams;';
    else
    icon = '&clubs;';
    
    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}

// Update the deck after each turn
function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length;
}

// Calculate the points of each player on the table
function getPoints(player) {
    var points = 0;
    for(var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
    return points;
}

// Update the points of each player on the table
function updatePoints() {
    for (var i = 0 ; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

// Deal one more card to a player on the table
function hit() {
    var card = deck.pop();
    players[0].Hand.push(card);
    updatePoints();
    renderCard(card, 0);
    updateDeck();
    check()
}

// End the game of Black Jack
function endGame() {
    let winner = -1;
    let score = 0;

    for (let i = 0; i < players.length; i++) {
        if (players[i].Points > score && players[i].Points < 22) {
            winner = i;
        }

        score = players[i].Points;
    }

    document.getElementById("status").innerHTML = "Winner: Congratulations Player " + players[winner].ID;
    document.getElementById("status").style.display = "inline-block";
}

// Check for the winning conditions
function check() {
    if (players[0].Points > 21) {
        document.getElementById("status").innerHTML = "Player: " + players[0].ID + " has LOST";
        document.getElementById("status").style.display = "inline-block";
        endGame();
    }
}

// Start the game
function startblackjack() {
    document.getElementById('btnStart').value = 'Restart';
    document.getElementById("status").style.display="none";
    // deal 2 cards to every player object
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});