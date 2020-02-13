
class Ausgabe {
    constructor() {


        this.data = ko.observableArray(); //schnittstelle zu html
        this.scoreP1 = ko.observable(0); //every time one of those updates, getAnimated(), getMyCSS(), etc. wird neu aufgerufen  (check computer(), this.NPC("inProgress") )--> knockout hat irgendwo ne funktion um das zu vermeiden
        this.scoreP2 = ko.observable(0);

        this.npcWorks = "no"; //spieler entscheidet, ob er gegen npc spielt ---> "ready": bereit für spielzug, "inProgress": führt spielzug aus, "no": keine AI

        this.Struktur = new Struktur();
        this.update(this.Struktur.matrix); //fill data passiert in der "applyBindings-funktion"


        this.selectedColumn = null;  ///die hier müssen mit unlogischen werten anfangen, damit der allererste aufruf von getAnimation() nicht verwurschtelt wird
        this.selectedRow = null;
        this.selectedRowNPC = null;
        this.selectedColumnNPC = null;

        this.GameInit(); //creates playerbox
        this.player = true; ////next player logic

        this.click = true;

        const self = this;

        self.chipInserted = function (elem, event) {  ////started "Fallenlassen"

            let id = event.target.id;   //"id" des geklickten feldes -> festegelgt durch HTML (id besteht aus index des 1. arrays und index des werts, der im genesteten array steht
            let result;
            let AIresult;


            if(self.data()[0][id[2]] === "0" && self.Struktur.winnerArr.length < 4 && self.click) { //wenn in der ersten spalte noch kein stein liegt, und der noclick check true enthält

                self.click = false;

                result = self.addColor(id, self.data()); //packt den entsprechenden Wert (1 oder 2) in den Data-Array


//console.log("AIresult1 ", self.npcWorks, self.player);


                if(self.doWeHaveAWinner() === "noWinner") {  //wenn niemand gewonnen hat

                    if (self.npcWorks === "ready") { //wenn NPC ready ist, starte seinen spielzug
                            self.playerUpdate();  //wechselt den player und die playerbox
                            AIresult = self.startAIplay(result);  //different than result, da AI ihren zug gemacht hat
                            self.doWeHaveAWinner();
                        console.log("AI result: ",AIresult);

                            if(AIresult !== null) {
                                self.update(AIresult);
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
                    self.update(result);
                }

           } else {    ////wenn das feld schon gefüllt ist
                alert("Impossible (._.)");
            }


        };

    }


    update(data) {

        if(data.length === 6 && data[0].length === 7 ) {
            this.data(data);

        } else {
            console.log("matrix update error");
        }
    }

    addColor(id, data) {

        console.log("addColor: ",id);
        let result = [];

        for(let i = 0; i < 6; i++) {
            result = this.Struktur.changeMatrixValue(id, data, this.player, i); //changes Matrix value, data darf nicht als ko-objekt übergeben werden})
        }

        ///Notwendig für red/yellow-Fade
        let rowCol = this.Struktur.getStonePlacement(id, result.slice());

        console.log("IS IN PROGRESS?? ", this.npcWorks);
        if(this.npcWorks === "inProgress"){
            this.selectedColumnNPC = rowCol[1];
            this.selectedRowNPC = rowCol[0];
        } else {
            this.selectedColumn = rowCol[1];
            this.selectedRow = rowCol[0];
        }

       // console.log("this selected column/row player/npc ", this.npcWorks, this.selectedColumn, this.selectedRow, this.selectedColumnNPC, this.selectedRowNPC);

        return result;
    };

    doWeHaveAWinner() {

        let winner = this.Struktur.checkAllWinner(); //startet Suche nach gewinner (muss noch result übergeben
        //console.log("do we have a winner ", winner, this.player);

        if (winner && this.player) {
            this.addScore(winner);
            this.playerUpdate();  ///ist viewmodel-update
        }
        if(winner && !this.player){
            this.addScore(winner);
            this.playerUpdate();  ///ist viewmodel-update
        }
        if(winner === null){
            return "noWinner";
        }
        //console.log("dwhaw 2: ", this.NPC());
    }

    startAIplay(result){
            return this.computer(result);
    }


    computer(result) {  //click auf button geht, click auf feld nicht ---> what??

        let row;
        let col;
        let id;

        console.log("this is the AI move", result);

        do {
            row = Math.floor(Math.random() * 6);  //egal, da der stein immer nach unten rutscht. Nur die column ist entscheidend
            col = Math.floor(Math.random() * 7);

            id = row + "_" + col; //der click eines echten spielers wird simuliert  (kann auch einfach id sein...)
            console.log("this is the other AI move", id);
        }while (result[row][col] !== "0");



        //this.Struktur.NPCmove();

        if(this.data()[0][col] === "0") {

            this.npcWorks = "inProgress";
            return this.addColor(id, result); //fast die gleiche methode wie "chipInserted()", nur, dass sich das viewmodel separat für den NPC updated (zumindest so die theorie)

        }
    }


    getAnimation (row, col) {     ///i need to prevent a click being registered when a logic is still in progress. When loading or updating (this.data(*whatever*) with update() ) anything html, this method always fires


        let result = 'corny rowBase row' + row;//standard styles für alle spielfelder (kreise)
        let value = this.data()[row][col];


        //console.log("getAni ", this.selectedColumn, this.sele);

            if (value === "1") {

                if (this.selectedColumn === col && this.selectedRow === row) {  ////das geklickte feld --> sollte das nächste freie feld in der spalte sein, nicht das direkt geklickte

                        result = result + ' yellow11'; //yellow11 ist animation für gesetztes feld. Dieses soll nämlich erst gefärbt werden, wenn die "fall-animation" abgeschlossen ist

                } else {
                    result = result + ' yellow1';  //permanenter style für player 1
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

            //console.log("NPC FADE: ", this.player, this.npcWorks, result);
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

