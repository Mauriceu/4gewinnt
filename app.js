


class Ausgabe {
    constructor() {

        this.data = ko.observableArray(); //schnittstelle zu html
        this.scoreP1 = ko.observable(0); //every time one of those updates, getAnimated(), getMyCSS(), etc. wird neu aufgerufen (knockout spezifisch)
        this.scoreP2 = ko.observable(0);

        this.npcWorks = "no"; //spieler entscheidet, ob er gegen npc spielt ---> "ready": bereit für spielzug, "inProgress": führt spielzug aus, "no": keine AI

        this.Struktur = new Struktur(); //erstellt die klasse mit der spiellogik
        this.update(this.Struktur.matrix); //das füllen des data-arrays passiert wenn die "applyBindings-funktion" aufgerufen wird


        this.selectedColumn = null;  ///die hier müssen mit unlogischen werten anfangen, damit der allererste aufruf nicht verwurschelt wird, da getAnimation() besonders ist
        this.selectedRow = null;
        this.selectedRowNPC = null;
        this.selectedColumnNPC = null;

        this.GameInit(); //erstellt spieler und score anzeige
        this.player = true; ////next player logic

        this.click = true; //"ist klick erlaubt?"-logik

        const self = this;

        self.chipInserted = function (elem, event) {  ////started "Fallenlassen"

            let id = event.target.id;   //"id" des geklickten feldes -> festegelgt durch HTML (id besteht aus dem index des oberen arrays und index des darunterliegenden arrays (genestet)
            let result; //ergebnis vom spieler-zug
            let AIresult; //ergebnis vom AI-zug


            if(self.data()[0][id[2]] === "0" && self.Struktur.winnerArr.length < 4 && self.click) { //wenn in der ersten reihe der geklickten spalte noch kein stein liegt, und der noclick check true enthält

                self.click = false; //ab jetzt kein click mehr erlaubt

                result = self.addColor(id, self.data()); //packt den Wert 'id' (1 oder 2) in den Data-Array


                if(self.doWeHaveAWinner() === "noWinner") {  //wenn niemand gewonnen hat

                    if (self.npcWorks === "ready") { //wenn NPC ready/eingeschaltet ist, starte seinen spielzug
                            self.playerUpdate();  //wechselt den player und die playerbox
                            AIresult = self.startAIplay(result);  //different than result, cause AI did its move
                            self.doWeHaveAWinner(); //gibts einen gewinner?

                            if(AIresult !== null) { //error handler
                                self.update(AIresult); //update den data-array (und damit das spielfeld)
                            } else {
                                console.log("no AI update mate ");
                            }

                    } else {
                            console.log("player result ", result);
                            self.update(result); ///updated data mit neuer matrix - muss nach doWeHaveAWinner, sonst wird gewinner erst beim nächsten click erkannt
                    }

                        self.click = true;
                        self.playerUpdate();   //wechselt den player und die playerbox

                    if (self.npcWorks === "inProgress") {
                            self.npcWorks = "ready";
                    }  //damit die getAnimation() kacke lösen

                } else {
                    self.update(result); //wenn jemand gewonnen hat, muss einfach nur das spielfeld geupdated werden
                }

           } else {    ////wenn das feld schon gefüllt ist
                alert("Impossible (._.)");
            }


        };

    }


    update(data) { //updated die Spielfeld-Matrix (gamesituation), wodurch alle "ko.bindings" neu ausgewertet werden

        if(data.length === 6 && data[0].length === 7 ) { //überprüft das format des übergebenden arrays
            this.data(data); //wenn er stimmt update this.data mit dem neuen array

        } else {
            console.log("matrix update error");
        }
    }

    addColor(id, data) { //soll den feldern ihre farben geben

        let result = [];

        for(let i = 0; i < 6; i++) { //für jede reihe wird die changeMatrixValue-Funktion einmal ausgeführt, dadurch wird das "fallen" des steins simuliert
            result = this.Struktur.changeMatrixValue(id, data, this.player, i); //changes the matrix (matrix = array mit 6 einträgen, die alle einen array mit 7 einträgen enthalten (6*7 werte = 42 spielfelder)
        }

        ///Notwendig für red/yellow-Fade
        let rowCol = this.Struktur.getStonePlacement(id, result.slice()); //getStonePlacement gibt den ort des feldes zurück, das in der geklickten spalte noch unbelegt ist (d.h. wo noch ein stein platziert werden kann)

        if(this.npcWorks === "inProgress"){ //wenn der NPC seinen Move macht
            this.selectedColumnNPC = rowCol[1];
            this.selectedRowNPC = rowCol[0];
        } else { //wenn der NPC ausgeschaltet ist bzw. gerade keinen move macht
            this.selectedColumn = rowCol[1];
            this.selectedRow = rowCol[0];
        }

        return result; //ist matrix-array mit den neuen werten
    };

    doWeHaveAWinner() {

        let winner = this.Struktur.checkAllWinner(); //startet Suche nach gewinner (muss noch result übergeben

        if (winner && this.player) {
            this.addScore(winner);
            this.playerUpdate();  ///viewmodel-update
        }
        if(winner && !this.player){
            this.addScore(winner);
            this.playerUpdate();  ///viewmodel-update
        }
        if(winner === null){
            return "noWinner";
        }
        //console.log("dwhaw 2: ", this.NPC());
    }

    startAIplay(result){
            return this.computer(result);
    }


    computer(result) {  //legt den spielzug des computers fest. die funktion nimmt einen matrix-array entgegen

        let row; //vom computer "geklickte" reihe
        let col; //vom computer "geklickte" spalte                                                                                             | diese 0 "repräsentiert" feld 1, da hier eine 0 steht, sit das feld weiß
        let id; //die "id" (in html wird sie direkt im element durch die indizes der data-matrix festgelegt) feld 1 = data[0][0] ===> data = [[0,0,0,0,0,0],[0,0,0,0,0,0,0], etc]

        console.log("this is the AI move", result);

        do {
            row = 0;                    //kann auch: Math.floor(Math.random() * 6);  // ist an sich aber egal, da der stein immer nach unten rutscht. Nur die column ist entscheidend
            col = Math.floor(Math.random() * 7);

            id = row + "_" + col; //der click eines echten spielers wird simuliert  (kann auch einfach id sein...)
            console.log("this is the other AI move", id);
        } while (result[0][col] !== "0");  //wenn eine spalte geklickt wird, die schon einen stein enthält -> wenn an diesem patz im neuen! data-array keine 0 mehr steht (sondern 1 oder 2)



        if(this.data()[0][col] === "0") {

            this.npcWorks = "inProgress"; //stellt die NPC logik um
            return this.addColor(id, result); //fast die gleiche methode wie "chipInserted()", nur, dass sich das viewmodel separat für den NPC updated (zumindest so die theorie)

        }
    }


    getAnimation (row, col) {     ///i need to prevent a click being registered when a logic is still in progress. When loading or updating (this.data(*whatever*) with update() ) anything html, this method always fires

        let result = 'corny rowBase row' + row;//standard styles für alle spielfelder (klassenzuweisung)
        let value = this.data()[row][col]; //der wert, der repräsentativ für das geklickte spielfeld ist (1, 2 oder 0)


            if (value === "1") {

                if (this.selectedColumn === col && this.selectedRow === row) {  ////das geklickte feld --> sollte das nächste freie feld in der spalte sein, nicht das direkt geklickte

                        result = result + ' yellow11'; //yellow11 ist animation für gesetztes feld. Dieses soll nämlich erst gefärbt werden, wenn die "fall-animation" abgeschlossen ist

                } else {
                    result = result + ' yellow1';  //permanenter farbstyle für player 1
                }

                if(this.selectedColumnNPC === col && this.selectedRowNPC === row){ //falls der NPC gerade an der reihe ist, muss die setz-animation angepasst werden (da sonst instant platziert)
                    result = result + "npc" + " yellow11npc";
                }

                //console.log("ani val1: ", result);
                return result;
            }


            if (value === "2") {

                if (this.selectedColumn === col && this.selectedRow === row) {  ///das geklickte feld --> sollte das nächste freie feld in der spalte sein, nicht das direkt geklickte

                        result = result + ' red22';  //red22 ist animation für gesetztes feld. Dieses soll nämlich erst gefärbt werden, wenn die "fall-animation" abgeschlossen ist

                } else {
                    result = result + ' red2';  //permanenter style für player 2

                }

                if(this.selectedColumnNPC === col && this.selectedRowNPC === row){ //falls der NPC gerade an der reihe ist, muss die fall-animation verzögert werden (da sonst zu schnell)
                        result = result + "npc" + " red22npc";
                }

                //console.log("ani val2: ", result, this.data());
            return result;
            }


            if (this.selectedColumn === col && value === "0") {  //für die spalte des vom Spieler geklickten feldes

                    //console.log("PLAYER SELECTED col/row ", this.selectedColumn, this.selectedRow, this.selectedColumnNPC, this.selectedRowNPC);

                if(this.data()[this.selectedRow][this.selectedColumn] === "1") { //wenn "mensch" als spieler1 gespielt hat
                    result = result + ' yellowFade';  //färbt gesamte spalte und löst die farben nacheinander auf

                } else if(this.data()[this.selectedRow][this.selectedColumn] === "2") { //wenn "mensch" als spieler1 gespielt hat
                    result = result + ' redFade';  //färbt gesamte spalte und löst die farben nacheinander auf
                }

                //console.log("PLAYER FADE: ", this.player, this.npcWorks, result);
                return result;

            }

            if (this.selectedColumnNPC === col && value === "0") {  //für die spalte des vom NPC geklickten feldes

                //console.log("NPC SELECTED col/row ", this.selectedColumn, this.selectedRow, this.selectedColumnNPC, this.selectedRowNPC);

                if(this.data()[this.selectedRowNPC][this.selectedColumnNPC] === "1") {  ///wenn der NPC dran ist und er spieler 1 ist
                    result = result + "npc" + " yellowFadeNPC";

                } else if(this.data()[this.selectedRowNPC][this.selectedColumnNPC] === "2"){ //wenn der NPC dran ist und er spieler 2 ist
                    result = result + "npc" + " redFadeNPC";

                }
                
            return result;

        }



        return result + ' white';  //gibt allen anderren feldern style "white"

    }


    compMatch(elem, event) {

        if(this.Struktur.winnerArr.length < 4) {
            this.click = false;
            this.npcWorks = "ready";
            this.selectedRow = null;
            this.selectedColumn = null;

            let result = this.computer(this.data());
            this.doWeHaveAWinner();
            this.update(result); ////ahem, muss result haben für ersten ai-move -> wenn man auf den button clickt, wird ai-logik manuell ausgelöst, ansonsten automatisch -> chipInserted wird 2 mal aufgreufen -> rekursivität fickt


            this.click = true;
            this.npcWorks = "ready";
            this.playerUpdate();
        }
    }

    getMyCSS (row, col) {

        if(this.Struktur.isWinnerField(row, col)){
            return 'blocks winBlocks '; //gibt den gewinner-blocks ihren style
        }
        return 'blocks '; //gibt den anderen blocks ihren style
    }


    restart() {
        this.selectedRow = null;
        this.selectedColumn = null;
        this.selectedRowNPC = null;
        this.selectedColumnNPC = null;

        this.click = true;
        this.player = true;
        let restart = this.Struktur.restart();
        this.npcWorks = "no";
        this.update(restart);

    }


    addScore(winnerArr){

        let id1 = winnerArr[0][0] + winnerArr[0][2];
        Number(id1);

        if(this.data()[id1[0]][id1[1]] === "1"){
            this.scoreP1(this.scoreP1() + 1);
        }

        if(this.data()[id1[0]][id1[1]] === "2"){
            this.scoreP2(this.scoreP2() + 1);
        }
    }



    playerUpdate () {

        let p1 = document.getElementById("p1");
        let p2 = document.getElementById("p2");

        if (this.player === true) {     ///Logik für Player-anzeige
            p1.classList.remove("yellow1");
            p2.classList.add("red2");

        } else if (this.player === false) {
            p2.classList.remove("red2");
            p1.classList.add("yellow1");
        }

        console.log("PLAYER UPDATE", !this.player);
        this.player = !this.player;
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
   //game.scoreP1 = ko.observable().extend({ deferred: true });
   //game.scoreP2 = ko.observable().extend({ deferred: true });
    //game.data = ko.observableArray().extend({ deferred: true });


};

