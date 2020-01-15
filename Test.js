Struktur = require("../Spielfeld.js");
var assert = require("assert");


describe('winner', function() {
    describe('The winner is 2!', function() {
        it('should be 2', function () {
            let a = new Struktur(6, 7);
            a.creator();

            a.setMatrixByString(
                  '0000000'
                + '0000000'
                + '0000200'
                + '0000200'
                + '0010200'
                + '0010200'
            );

            assert.equal(a.isWinner(), 2);
        })
    });
    /*
    describe('The winner is 1!', function() {
        it('should be 1', function () {
            let a = new Struktur(6, 7);
            a.setMatrixByString(
                '0000000'
                + '0000000'
                + '0001000'
                + '0012000'
                + '0121000'
                + '1221000'
            );

            assert.equal(a.isWinner(), 1);
        })
    });

     */
});



describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});
