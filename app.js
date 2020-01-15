
class Ausgabe {
    constructor(rows, cols) {

        this.gameSituation =
              "0000000"
            + "0000000"
            + "0000000"
            + "1100000"
            + "1100000"
            + "1200000";

        this.Spielfeld = new Struktur(rows, cols);

        this.data = ko.observableArray([]); //schnittstelle zu html
        this.data = this.Spielfeld.creator(this.gameSituation); //füllt data mit matrix


        //console.log(this.data);
        this.GameInit(); //creates playerbox

        this.player = true; ////next player logic
        this.end = false; /////checker für die gravity logik

        //this.noClick = 0;    ////for no Click Logic

        var self = this;


        this.chipInserted = function(elem, event) {  ////started "Fallenlassen" und "no click logic"

            let id = event.target.id;               //"id" des geklickten feldes -> festegelgt durch HTML (id besteht aus index des 1. arrays und index des werts, der im genesteten array steht)

            self.data  = self.addColor(id, self.data, self.player); //packt den neuen arry in data
            console.log(self.data);

            self.player = !self.player; //wechselt den Spieler
        };
    }

    addColor = function(id, data) {

        //console.log(id, data);

        if (data[0][id[2]] === "0") {   ////wenn der oberste stein in der spalte nicht gefüllt ist eg. wenn im array an der stelle "id" noch eine 0 steht

            this.playerBoxUpdate();    //wechselt die farbe der playerbox
            return this.Spielfeld.getGravity(id, data, this.player);

        } else {    ////wenn der oberste stein in der spalte schon gefüllt ist

            alert("Bruh, this column is already full.");

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

}


window.onload = function () {
    let game = new Ausgabe(6, 7);
    ko.applyBindings(game);

};

