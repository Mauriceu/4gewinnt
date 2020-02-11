
class Ausgabe {
    constructor() {


        this.data = ko.observableArray(); //schnittstelle zu html
        this.scoreP1 = ko.observable(0);
        this.scoreP2 = ko.observable(0);
        this.NPC = ko.observable("no");  //spieler entscheidet, ob er gegen npc spielt ---> "ready" heißt AI ist bereit für spielzug, "inProgress" heißt AI führt ihren spielzug aus, "no" heißt keine AI


        this.Struktur = new Struktur();
        this.data(this.Struktur.matrix); //füllt data

        this.selectedColumn = null;
        this.selectedRow = null;

        this.GameInit(); //creates playerbox
        this.player = true; ////next player logic

        const self = this;

        self.chipInserted = function (elem, event) {  ////started "Fallenlassen"

            let id = event.target.id;   //"id" des geklickten feldes -> festegelgt durch HTML (id besteht aus index des 1. arrays und index des werts, der im genesteten array steht


            if(self.data()[0][id[2]] === "0" && self.Struktur.winnerArr.length < 4) { //wenn in der ersten spalte noch kein stein liegt, und der noclick check true enthält

                let result = self.addColor(id, self.data()); //packt den entsprechenden Wert (1 oder 2) in den Data-Array


   /////////////der computer darf nicht mitten in der logik des Spieler-spielzugs anfangen (der letzte console.log() in addcolor() wird 2x mal ausgeführt) (einmal für spieler und einmal für AI) --> AI-Logik von spielerlogik trennen....da rekursiv und so
    /////quatsch ist zwar immer noch zu rekursiv, dafür funzt es!!!!


                console.log("before the end: ", self.NPC(), self.player);

                if(self.NPC() === "ready") {
                    self.player = !self.player; //wenn der NPC bereit für sein zug ist, wechselt er den spieler
                    self.startAIplay();
                }


                if(self.NPC() === "inProgress") { ///damit sich die npc logik nicht wiederholt, wird hier eine "sperre" eingebaut, die sich vor der doWeHaveAWinner-methode schließt und danach wieder öffnet -> sonst entsteht endlosschleife für npc
                    self.update(result); ///updated data mit neuer matrix - muss nach doWeHaveAWinner, sonst wird gewinner erst beim nächsten click erkannt
                    self.doWeHaveAWinner(result); //result ist die durch den aktuellen spielzug geänderte matrix

                } else {  ///if-statement muss bleiben....warum? keine ahnung....denke, dass getAnimation() rekursiv funktioniert - was auch immer die konsequenz daraus ist...jedenfalls MUSS DAS BLEIBEN
                    self.player = !self.player; //wenn der NPC nicht mehr dran ist (nicht mehr "inProgress"), wechselt er den spieler
                }

                self.updateNPC();


                self.player = !self.player; //wenn keine der beiden spieler-wechsel-logiken drankam
                console.log("the end: ", self.NPC(), self.player);


            } else {    ////wenn das feld schon gefüllt ist

                alert("Impossible (._.)");
            }

        };

    }

    update(data) {

        if(data.length === 6 && data[0].length === 7) {
            this.data(data);

        } else {
            console.log("matrix update error");
        }
    }

    addColor(id, data) {

        console.log("spieler: ",this.NPC(), this.player);

        let result = [];

        for(let i = 0; i < 6; i++) {
            result = this.Struktur.changeMatrixValue(id, data, this.player, i); //changes Matrix value, data darf nicht als ko-objekt übergeben werden})
        }

        ///Notwendig für red/yellow-Fade
        let rowCol = this.Struktur.getStonePlacement(id, result.slice());
        this.selectedColumn = rowCol[1];
        this.selectedRow = rowCol[0];

        this.doWeHaveAWinner(result);


        console.log("dwhaw finished: ", this.NPC(), this.player);


        if(this.NPC() === "no"){
            console.log("about to update,no NPC");
            this.update(result); ///updated data mit neuer matrix - muss nach checkAllwinner, sonst wird gewinner erst beim nächsten click erkannt  (mehrere updates des viewmodels vermeiden)
            this.player = !this.player;
        }



        return result;
        //console.log("addcol: ", this.NPC());

    };

    doWeHaveAWinner(result) {

        let winner = this.Struktur.checkAllWinner(); //startet Suche nach gewinner
        this.update(result);

        if (winner === "1") {
            this.addScore(true);
        }
        else if(winner === "2"){
            this.addScore(false);
        }

        this.playerBoxUpdate();    //wechselt die farbe der playerbox

        //console.log("dwhaw 2: ", this.NPC());
    }

    startAIplay(){

        if(this.Struktur.winnerArr.length < 4) {
            console.log("startAI player: ", this.player);
            return this.computer();
        }

    }


    computer() {

        let data = this.data();

            let row = 0;  //egal, da der stein immer nach unten rutscht. Nur die column ist entscheidend
            let col = Math.floor(Math.random() * 7);

            let event = {target: {id: row.toString() + "_" + col.toString()}}; //so aufgebaut, damit der click eines echten spielers simuliert wird

        //console.log("comp, id: ", this.NPC(), id);

        if(data[0][col] === "0") {
            this.NPC("inProgress");  ///npc arbeitet
            return this.chipInserted(null, event); //brauch den return, um nicht in endlosschleife hängen zu bleiben, (null, da elem in der handler-function nicht gebraucht wird)

        } else {
            this.computer(); //wenn die zufällig ausgewählte spalte schon voll ist
        }
    }


    compMatch(elem, event) {
        this.NPC("ready");
        this.computer();
        return;
    }


    getAnimation (row, col) {     ///i need to prevent a click being registered when a logic is still in progress. When loading or updating (this.data(*whatever*) with update() ) anything html, this method always fires

        //console.log("this.player, this.NPC: ", this.player, this.NPC());

        let result = 'corny rowBase row' + row;//standard styles für alle spielfelder (kreise)
        let value = this.data()[row][col];

       //console.log("1 ", result);

            if (value === "1") {

                if (this.selectedColumn === col && this.selectedRow === row) {  ////das geklickte feld --> sollte das nächste freie feld in der spalte sein, nicht das direkt geklickte

                    if(this.NPC() === "inProgress"){
                        console.log(result + " yellow11npc");
                        return result + " yellow11npc";  //falls der NPC gerade an der reihe ist, muss die setz-animation angepasst werden (da sonst instant platziert)

                    } else {
                        console.log(result + " yellow11");
                        return result + ' yellow11'; //yellow11 ist animation für gesetztes feld. Dieses soll nämlich erst gefärbt werden, wenn die "fall-animation" abgeschlossen ist
                    }

                } else {
                    console.log(result, " yellow1");
                    return result + ' yellow1';  //style für player 1
                }
            }


            if (value === "2") {

                if (this.selectedColumn === col && this.selectedRow === row) {  ///das geklickte feld --> sollte das nächste freie feld in der spalte sein, nicht das direkt geklickte

                    if(this.NPC() === "inProgress") {
                        console.log(result + " red22npc");
                        return result + " red22npc"; //falls der NPC gerade an der reihe ist, muss die fall-animation verzögert werden (da sonst zu schnell)

                    } else {
                        console.log(result + " red22");
                        return result + ' red22';  //red22 ist animation für gesetztes feld. Dieses soll nämlich erst gefärbt werden, wenn die "fall-animation" abgeschlossen ist
                    }

                } else {
                    console.log(result, " red2");
                    return result + ' red2';  //style für player 2
                }
            }


            if (this.selectedColumn === col && value === "0") {  //für die spalte des geklickten feldes
               console.log("selectedCOlumn NPC Player: ", this.NPC(),this.player);
                if (this.player) {

                    if(this.NPC() === "inProgress") {  //falls der NPC dran ist, dann lass das fallen der steine verzögert starten (da NPC zu schnell ist)
                        result = result + " yellowFadeNPC";

                    } else { //ansonsten "normale" geschwindigkeit
                        result = result + ' yellowFade';  //färbt gesamte spalte und löst die farben nacheinander auf
                    }

                }

                if(this.player === false) {

                    if(this.NPC() === "inProgress") { //falls der NPC dran ist, dann lass das fallen der steine verzögert starten (da NPC zu schnell ist)
                        result = result + " redFadeNPC";

                    } else {  //ansonsten "normale" geschwindigkeit
                        result = result + ' redFade'; //färbt gesamte spalte und löst die farben nacheinander auf
                    }

                }
                console.log("FADE: ", result);
            } else  { //ansonsten für alle spalten
                result = result + ' white';  //gibt allen anderren feldern style "white"
            }

            return result;

    }


    getMyCSS (row, col) {

        if(this.Struktur.isWinnerField(row, col)){
            return 'blocks winBlocks '; //gibt den gewinner-blocks ihren style
        }
        return 'blocks '; //gibt den anderen blocks ihren style
    }


    updateNPC() {

        if(this.NPC() === "inProgress") {
            this.NPC("ready");  //und damit die klassenzuweisung sinnvoll passiert. Muss nach dem AI-Spielzug wieder auf "ready" gestellt werden
        }
    }


    restart() {
        this.NPC("no");
        let restart = this.Struktur.restart();
        this.data(restart);

    }

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

