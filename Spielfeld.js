


class Struktur {
    constructor(rows, cols) {

        this.rows = rows;
        this.cols = cols;


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

    getGravity = function (id, data, player) {

            switch (player) {  //bestimmt, ob "1" oder "2" in dem geklickten feld plaziert wird_______platzhalter für gravity logik
                case true:
                    data()[id[0]][id[2]] = "1";
                    break;
                case false:
                    data()[id[0]][id[2]] = "2";
                    break;
            }

            return data; //data ist knockout-object
    }
}
