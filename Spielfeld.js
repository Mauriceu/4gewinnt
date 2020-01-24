


class Struktur {
    constructor() {

        this.gameSituation =
              "0000000"
            + "0000000"
            + "0000000"
            + "0000000"
            + "0000000"
            + "0000000";

        this.rows = 6;
        this.cols = 7;

        this.matrix = [];
        this.matrix = this.creator(this.gameSituation);


    }

    creator (inp) {

        let matrix = Array(this.rows); //baut die reihen

        for (let i = 0; i < this.rows; i++) { //baut die spalten
            matrix[i] = Array(this.cols);
        }


        let counter = 0; //maximum value is inp.length (für "falsche" for-schleife)


        for (let i = 0; i < this.rows; i++) {
            for (let k = 0; k < this.cols; k++) {

                matrix[i][k] = inp[counter];
                counter++;
            }
        }
        this.matrix = matrix;
        return matrix;

    };


    changeMatrixValue (id, data, player) {  //bestimmt, ob "1" oder "2" in dem geklickten feld plaziert wird____platzhalter für gravity logik

        switch (player) {
            case true:
                data()[id[0]][id[2]] = "1";
                break;
            case false:
                data()[id[0]][id[2]] = "2";
                break;
        }

        return this.matrixToString(data()); //data ist knockout-object
    };


    matrixToString (result) {

        let resultString = "";

        for (let i = 0; i < result.length; i++) {
            resultString = resultString + result[i].join(""); //wandelt die matrix in einen zusammenhängenden string um
        }
        //console.log(resultString);
        return this.creator(resultString);
    };


    restart () {
        let restart = "";
        for(let i=0; i < this.gameSituation.length; i++){
            restart = restart + "0";
        }

        return this.creator(restart);

    }


    checkAllWinner () {

        for (let x = 0; x < this.rows; x++){
            for(let y = 0; y < this.cols; y++){

                let winner = this.checkVerticalWinner(x, y); //geht die columns durch (vertikale)

                if(winner){
                    return winner;
                }
            }
        }

        for(let x=0; x < this.cols; x++){
            for(let y=0; y < this.rows; y++){

                let winner = this.checkHorizontalWinner(y, x); ///geht die rows durch (horziontale)

                if(winner){
                    return winner;
                }
            }
        }


        for (let x = 0; x < this.rows - 2; x++){
            for(let y = 0; y < this.cols - 4; y++) {

                let winner = this.checkDiaRightWinner(x, y); //geht die columns durch (vertikale)

                if (winner) { //wenn winner !== null ist
                    return winner;
                }

            }
        }

        for (let x = 0; x < this.rows - 3; x++){
            for(let y = 3; y < this.cols; y++) {

                let winner = this.checkDiaLeftWinner(x, y); //geht die columns durch (vertikale)

                if (winner) {
                    return winner;
                }

            }
        }

        return null; //wenn es keinen gewinner gibt

    };

    checkDiaLeftWinner (row, col) {

        let player = this.matrix[row][col];

        if(player === "0"){
            return null;
        }
        ///kein test ob noch genug felder zur verfügung stehen, da variablen in der for-schleife die zu testenden felder begrenzt

        let counter = row;
        for(let i = col; i > col - 4; i--){

            let chip = this.matrix[counter][i];

            if(chip !== player){
                return null;
            }
            counter++;
        }

        return player;

    }


    checkDiaRightWinner (row, col){

        let player = this.matrix[row][col];



        if(player === "0"){
            return null;
        }
        ///kein test ob noch genug felder zur verfügung stehen, da variablen in der for-schleife die zu testenden felder begrenzt

        let counter = row;
        for(let i = col; i < col + 4; i++){

            let chip = this.matrix[counter][i];

            if(chip !== player){
                return null;
            }
            counter++;
        }

        return player;
    }



    checkHorizontalWinner (row, col){
        let player = this.matrix[row][col];

        if(player === "0"){
            return null;
        }
        if(col > this.cols - 3){
            return null;
        }

        for(let i = col + 1; i < col + 4; i++){

            let chip = this.matrix[row][i];
            if(chip !== player){
                return null;
            }
        }

        return player;
    }


    checkVerticalWinner (row, col) {  ///soll überprüfen, ob es einen gewinner gibt..........

        let player = this.matrix[row][col];

        if(player === "0"){
            return null;
        }
        if(row >= this.rows - 3){
            return null;
        }


        for(let i = row + 1; i < row + 4; i++){ //prüft nur vertikale felder

            let chip = this.matrix[i][col];
            if( chip !== player) {
                  return null;
            }
        }

        return player;
    }


}

exports.Struktur = Struktur;













/*
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

            console.log(Number(winArr[count][0]-1));
            if(check === 3){ //wenn neben dem geklickten feld keine weiteren gefunden wurden, wird dieser wert aus winArr gelöscht
               //winArr = winArr.splice(winArr.indexOf(winArr[count]), 1); //soll "Noise-values " aus winArr entfernen
                //winArr = winArr.splice(winArr.indexOf(winArr[count]),1);
            check = 0;
            }
        }

            //console.log("count: ", count);
            console.log("check Arrs: ", rowArr, colArr, diaArr);
            console.log("winArr spliced: ", winArr);
            //console.log("winArr sliced: ", winArr);
    }

        if(rowArr.length >= 3 && colArr.length < 3 && diaArr.length < 3){
            console.log("there is a winner")
        } else if(rowArr.length < 3 && colArr.length === 3 && diaArr.length < 0){
            console.log("there is a winner")
        } else if(rowArr.length < 0 && colArr.length < 0 && diaArr.length >= 3){
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