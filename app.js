
class Ausgabe {
    constructor() {


        this.data = ko.observableArray(); //schnittstelle zu html
        this.scoreP1 = ko.observable(0);
        this.scoreP2 = ko.observable(0);


        this.Struktur = new Struktur();
        this.data(this.Struktur.matrix); //füllt data


        this.GameInit(); //creates playerbox
        this.player = true; ////next player logic

        const self = this;


        self.chipInserted = function (elem, event) {  ////started "Fallenlassen"

            if(self.Struktur.winnerArr.length < 4) {

                let id = event.target.id;               //"id" des geklickten feldes -> festegelgt durch HTML (id besteht aus index des 1. arrays und index des werts, der im genesteten array steht)

                self.addColor(id, self.data); //packt den entsprechenden Wert (1 oder 2) in den Data-Array
            }

        };



    }


    getMyCSS (row, col) {

        if(this.Struktur.isWinnerField(row, col)){ //gibts den blocks ihre farbe
            return 'blocks winBlocks'; //gibt den gewinner-blocks ihre farbe
        }
        return 'blocks';
    }


    restart() {
        let restart = this.Struktur.restart();
        this.data(restart);

    }

    addColor(id, data) {


        if (data()[0][id[2]] === "0") {   ////wenn der oberste stein noch nicht gefüllt ist, eg. wenn im array am index "id" noch eine 0 steht

            let result = this.Struktur.changeMatrixValue(id, data, this.player); //changes Matrix value


            let winner = this.Struktur.checkAllWinner(); //startet Suche nach gewinner
            this.data(result); ///updated data mit neuer matrix - muss nach checkAllwinner, sonst wird gewinner erst beim nächsten click erkannt


            if (winner === "1") {
                this.addScore(true);
            }
            if(winner === "2"){
                this.addScore(false);
            }

            this.playerBoxUpdate();    //wechselt die farbe der playerbox
            this.player = !this.player; //wechselt den Spieler


        } else {    ////wenn das feld schon gefüllt ist

            alert("Bruh, this one is already full.");
        }
    };

    addScore(player){
        if(player){
            this.scoreP1(this.scoreP1() + 1);
        }else {
            this.scoreP2(this.scoreP2() + 1);
        }
    }



    playerBoxUpdate () {

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


    GameInit () {   ////creates the playerbox


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
    let game = new Ausgabe();
    ko.applyBindings(game);

};

