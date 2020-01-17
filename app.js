
class Ausgabe {
    constructor(rows, cols) {

        this.gameSituation =
              "0000000"
            + "0000000"
            + "0000000"
            + "0000000"
            + "0000000"
            + "1200000";

        this.Spielfeld = new Struktur(rows, cols);


        this.data = ko.observableArray(); //schnittstelle zu html

        this.GameInit(); //creates playerbox

        this.player = true; ////next player logic
        this.end = false; /////checker für die gravity logik


        const self = this;


        this.chipInserted = function(elem, event) {  ////started "Fallenlassen" und "no click logic"

            let id = event.target.id;               //"id" des geklickten feldes -> festegelgt durch HTML (id besteht aus index des 1. arrays und index des werts, der im genesteten array steht)


            let result = self.addColor(id, self.data); //packt den entsprechenden Wert (1 oder 2) in den Data-Array
            let resultString = self.matrixToString(result()); //wandelt die data-matrix in einen zusammenhängenden string um

            //console.log(resultString, self.gameSituation);

            let newMatrix = self.Spielfeld.creator(resultString);   //erstellt neue Matrix mit dem geklickten Feld
            self.data(newMatrix);       //updates data mit der neuen Matrix

            self.player = !self.player; //wechselt den Spieler
        };
    }

    addColor = function(id, data) {


        if (data()[id[0]][id[2]] === "0") {   ////wenn der geklickte stein nicht gefüllt ist, eg. wenn im array am index "id" noch eine 0 steht

            this.playerBoxUpdate();    //wechselt die farbe der playerbox

            let result = this.Spielfeld.getGravity(id, data, this.player);  //self.data ist knockout-object
            //console.log("addC ", result);
            return result; //result ist knockout-object

        } else {    ////wenn der oberste stein in der spalte schon gefüllt ist

            alert("Bruh, this one is already full.");

        }
    };


    playerBoxUpdate = function() {

        let p1 = document.getElementById("p1");
        let p2 = document.getElementById("p2");

        if (this.player === true) {     ///Logik für Player-anzeige
            p1.classList.remove("yellow1");
            p2.classList.add("red2");

        } else if (this.player === false) {
            p2.classList.remove("red2");
            p1.classList.add("yellow1");
        }
    };


    GameInit = function() {   ////creates the playerbox

        let result = this.Spielfeld.creator(this.gameSituation);
        this.data(result); //füllt observable mit matrix array, der aus der gamesituation gebildet wird
        //console.log(this.data());

        let p1 = document.getElementById("p1");
        let p2 = document.getElementById("p2");

        let node = document.createElement("h4");

        let text = document.createTextNode("Player 1");
        let text2 = document.createTextNode("Player 2");

        p1.appendChild(node.appendChild(text));
        p1.classList.add("yellow1");

        p2.appendChild(node.appendChild(text2));
        //p2.classList.add("red2");


    };

    matrixToString = function(result) {

        let res = "";

        for (let i = 0; i < result.length; i++) {
            res = res + result[i].join(""); //wandelt die matrix in einen zusammenhängenden string um
        }

        return res;
    }

}


window.onload = function () {
    let game = new Ausgabe(6, 7);
    ko.applyBindings(game);

};

