


class Struktur {
    constructor(rows, cols) {

        this.rows = rows;
        this.cols = cols;

        this.yellowArr = [];
        this.redArr = [];

        var self = this;
    }



    creator = function (inp) {


        let matrix = Array(this.rows); //baut die reihen

        for(let i=0; i < this.rows; i++){ //baut die spalten
            matrix[i] = Array(this.cols);
        }


        let counter = 0; //maximum value is inp.length (für "falsche" for-schleife)


        for(let i=0; i < this.rows; i++) {
            for(let k=0; k < this.cols; k++) {

                matrix[i][k] = inp[counter];
                counter++;
            }
        }

        return matrix;
    };

    getGravity = function (id, data, player) {  //bestimmt, ob "1" oder "2" in dem geklickten feld plaziert wird____platzhalter für gravity logik

            switch (player) {
                case true:
                    data()[id[0]][id[2]] = "1";
                    break;
                case false:
                    data()[id[0]][id[2]] = "2";
                    break;
            }

           self.isWinner = this.checkForWinner(data(), id, player);

            return data; //data ist knockout-object
    };


    checkForWinner = function(data, id, player) {  ///soll überprüfen, ob es einen gewinner gibt..........
        ///looks alright
        //pushes indizes der geklickten felder des aktuellen spielers in einen array
        //vergleicht nacheinander die werte im array, ob sie nebeneinander liegen
        //
        let rowArr = [];
        let colArr = [];
        let diaArr = [];
        let winArr = [];


        let stoneColor;
        if (player) { //welcher spieler wird geprüft
            stoneColor = "1";
            winArr = this.yellowArr;
        } else {
            stoneColor = "2";
            winArr = this.redArr;
        }



        //console.log("bis hier gehts ", data);
        // winArr.sort((num, val) => {return num - val}); //sortiert den array nach zahlengröße
        console.log("winArr ", winArr);
        console.log("yell, red -Arr ", this.yellowArr, this.redArr);
        //console.log("winArr länge: ", winArr.length);


        let check = 0;//counter für "noise-values"


        if (winArr.length > 1) {

        for (let count = 0; count < winArr.length-1; count++) {

            if (   Number(winArr[count][0]) === Number(winArr[count + 1][0])-1 //1. stelle unterschied von 1
                && Number(winArr[count][1]) === Number(winArr[count + 1][1])) { //2. stelle kein unterschied (checkt rows)
                rowArr.push(winArr[count]);

            } else {check++}

            if (   Number(winArr[count][0]) === Number(winArr[count + 1][0]) //1. stelle kein unterschied
                && Number(winArr[count][1]) === Number(winArr[count + 1][1])-1) { //2. stelle unterschied von 1 (checkt cols)
               colArr.push(winArr[count]);

            } else {check++}

            if (   Number(winArr[count][0]) === Number(winArr[count + 1][0])-1 //1. stelle unterschied von 1
                && Number(winArr[count][1]) === Number(winArr[count + 1][1])-1) { //2. stelle unterschied von 1 (checkt dias)
                diaArr.push(winArr[count]);

            } else {check++}

            if(check > 3){ //wenn neben dem geklickten feld keine weiteren gefunden wurden, wird dieser wert aus winArr gelöscht
                winArr = winArr.splice(winArr.indexOf(winArr[count]), 1); //soll "Noise-values " aus winArr entfernen

                check = 0;
            }
        }
            //console.log("count: ", count);
            console.log("check Arrs: ", rowArr, colArr, diaArr);
            console.log("winArr spliced: ", winArr);
            //console.log("winArr sliced: ", winArr);
    }

        if(rowArr.length >= 3 && colArr.length === 0 && diaArr.length === 0){
            console.log("there is a winner")
        } else if(rowArr.length === 0 && colArr.length === 3 && diaArr.length === 0){
            console.log("there is a winner")
        } else if(rowArr.length === 0 && colArr.length === 0 && diaArr.length === 3){
            console.log("there is a winner")
        }


     //winArr = winArr.map(x=> {re;
        //turn Number(x)}); //winArr besteht aus immer 3 werten ([id1, id2, value])

        //console.log("winArr result: ", result); //winArr besteht aus zahlenwerten, die den index der gefüllten felder wiedergeben
        //console.log(winArr.reduce((total, num) => {return num-total})); //reduziert den array zu einem einzigen wert
    }



}


/*

        do {
          if(Number(id[0]) < 3) {
              switch (data[i][k]) {  //vergleicht alle felder unter dem geklickten
                  case "1":
                      this.redWinner.push(id);
                      break;
                  case "2":
                      this.yellowWinner.push(id);
                      break;
                  default:
                     break;
              }
            i++;
          }
            i=Number(id[0]);
            k=Number(id[2]);

          if(Number(id[0]) > 2) {   //vergleicht alle felder über dem geklickten
              switch (data[i][k]) {
                  case "1":
                      this.yellowWinner.push(id);
                      break;
                  case "2":
                      this.redWinner.push(id);
                      break;
                  default:
                      break;
              }
              i--;
          }
          i=Number(id[0]);
          k=Number(id[2]);

            if(Number(id[0]) === 2) {   //vergleicht alle diagonal liegenden felder links unter dem geklickten
                switch (data[i][k]) {
                    case "1":
                        this.yellowWinner.push(id);
                        break;
                    case "2":
                        this.redWinner.push(id);
                        break;
                    default:
                        break;
                }
                i++;
                k--;
            }
            i=Number(id[0]);
            k=Number(id[2]);





 */