var view = {
    displayMassege: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""]},
            { locations: ["0", "0", "0"], hits: ["", "", ""]},
            { locations: ["0", "0", "0"], hits: ["", "", ""]}],
    fire: function (guess) {
        for (var i = 0; i <this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMassege("Попал!");
                if(this.isSunk(ship)){
                    view.displayMassege("Корабль потоплен!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMassege("Промазал...");
        return false;
    },
    isSunk: function (ship) {
        for (var i = 0; i<this.shipLength; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocation: function () {
        var locations;                                  //массив для хранения координат

        for (var i = 0; i < this.numShips; i++){        //для всех кораблей
            do {
                locations = this.generateShip();        //присваиваем координаты
            }while(this.collision(locations));          //до тех пор пока получается пересечение кораблями
            this.ships[i].locations=locations;          //на выходе из цикла получаются "хорошие" координаты
console.log("текущий массив кораблей: ", this.ships);
        }
    },
    generateShip: function () {
        var direction = Math.floor(Math.random()*2);    //ориентация корабля 1-вертикально, 0-горизонтально
        var row, col;                                   //строка и столбец (row & column)
        var newShipLocations = [];                      //массив для хранения координат
console.log("Ориентация: ", direction);
        if (direction === 1){
            //генерация начальной позиции для вертикального корабля
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        else{
            //генерация начальной позиции для горизонтального корабля
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
console.log("начальная позиция: ", row, col);
        for (var i = 0; i<this.shipLength; i++){
            if (direction === 1){
                //генерация если вертикальный корабль
                newShipLocations.push((row + i) + "" + col);
            }
            else{
                //генерация если горизонтальный корабль
                newShipLocations.push(row + "" + (col + i));
            }
        }
console.log("Сгенерированые координаты: ", newShipLocations);
        //вернуть координаты сгенерированного корабля
        return newShipLocations;
    },
    collision: function (locations) {
console.log("Проверка колизии");
        for (var i = 0; i < this.numShips; i++){                    //для всех кораблей
            var ship = this.ships[i];                               //получаем поочередно корабли из массива
console.log("Координаты корабля " + i + ": ", ship);
            for (var j = 0; j < locations.length; j++){             //проверяем все координаты на совпадение
                if (ship.locations.indexOf(locations[j]) >= 0){     //и если есть
console.log("Ошибка колизии, координата: ", locations[j]);
                    return true;                                    //то вернем true
                }
            }
        }
console.log("Колизии не обнаружено");
        return false;
    }
};

var controller = {
    guesses: 0,

    processGuess: function (guess) {
        var location = parseGuess(guess);

        if (location){
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips){
                view.displayMassege("Ты потопил все корабли");
            }
        }

    }
};

function parseHover (guessId){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    var numberChar = Number(guessId.charAt(0));
    var row = alphabet[numberChar];
    return row + guessId.charAt(1);
}

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess === null || guess.length !==2 ){
        alert("Неверные координаты");
    }
    else{
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)){
            alert("Неверные координаты");
        }
        else if (row < 0 || row >= model.boardSize ||
                 column < 0 || column >= model.boardSize){
            alert("Неверные координаты");
        }
        else
            return row + column;
    }
    return null;
}

function init() {
    model.generateShipLocation();
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyPress;
    var table = document.getElementById("table");
    table.onmouseover = handleHover;
    table.onclick = fireHover;

}

function fireHover(event) {
    var activCell = event.target;
    console.log("Fire!" + activCell.id);
    controller.processGuess(parseHover(activCell.id));
}

function handleHover(event) {
    var activCell = event.target;
    if(activCell.tagName === "TD"){
        var guessInput = document.getElementById("guessInput");
        guessInput.value = parseHover(activCell.id);
//        console.log(activCell.id + " " + parseHover(activCell.id));
    }

}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;

