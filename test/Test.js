Struktur = require("../Spielfeld.js").Struktur;

let assert = require("assert");


describe('winner', function() {
    describe('Random Winner', function() {
        it('compares winner to player 1', function () {

            let a = new Struktur();

            let input =  "";
            for(let i=0; i < 42; i++) {
                input = input + Math.floor((Math.random() * 3)).toString();
            }


            a.creator(input);
            console.log(JSON.stringify(a.matrix));
            assert.equal(a.checkAllWinner(), "1");
        })
    });

    describe('Diagonal Left Winner', function() {
        it('should be 1', function () {

            let a = new Struktur();

            let input =
                  '1000002'
                + '0100020'
                + '0010200'
                + '0002000'
                + '0000000'
                + '0000000';

            a.creator(input);

            assert.equal(a.checkAllWinner(), "2");
        })
    });

    describe('Diagonal Right Winner', function() {
        it('should be 1', function () {

            let a = new Struktur();

            let input =
                  '1000002'
                + '0100020'
                + '0010200'
                + '0001000'
                + '0000000'
                + '0000000';

            a.creator(input);

            assert.equal(a.checkAllWinner(), "1");
        })
    });

    describe('Vertical Winner', function() {
        it('should be 2', function () {

            let a = new Struktur();

            let input =
                  '1000000'
                + '2000100'
                + '2000000'
                + '2001000'
                + '2000000'
                + '0000000';

            a.creator(input);

            assert.equal(a.checkAllWinner(), "2");
        })
    });

    describe('Horizontal Winner', function() {
        it('should be 2', function () {

            let a = new Struktur();

            let input =
                  '1000000'
                + '0000100'
                + '2000000'
                + '2001000'
                + '2001111'
                + '0000000';

            a.creator(input);

            assert.equal(a.checkAllWinner(), "1");
        })
    });

});


/*
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});
*/