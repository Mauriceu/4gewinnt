var assert = require("assert");

Struktur = require("../Spielfeld.js").Struktur;

describe('Struktur Basics', function() {
    describe('creator works!', function() {
        it('creator works', function () {
            let a = new Struktur(6, 7);

            a.creator(
              '0000000'
                + '0000000'
                + '0000200'
                + '0000200'
                + '0010200'
                + '0010200'
            );


            let result = [ [ '0', '0', '0', '0', '0', '0', '0' ],
                [ '0', '0', '0', '0', '0', '0', '0' ],
                [ '0', '0', '0', '0', '2', '0', '0' ],
                [ '0', '0', '0', '0', '2', '0', '0' ],
                [ '0', '0', '1', '0', '2', '0', '0' ],
                [ '0', '0', '1', '0', '2', '0', '0' ] ];

            assert.equal(
                JSON.stringify(a.matrix),
                JSON.stringify(result)
            );
        })
    });

    describe('winner', function() {
        it('vertical 1', function () {
            let a = new Struktur(6, 7);

            a.creator(
                '1000000'
                + '1000000'
                + '1000200'
                + '1000200'
                + '0010200'
                + '0010200'
            );

            assert.equal(
                a.getVerticalWinner(0, 0),
                "1"
            );
        });
        it('vertical 2', function () {
            let a = new Struktur(6, 7);

            a.creator(
                '1000000'
                + '1000000'
                + '1000200'
                + '1000200'
                + '0010200'
                + '0010200'
            );

            assert.equal(
                a.getVerticalWinner(2, 4),
                "2"
            );
        });
        it('all1', function () {
            let a = new Struktur(6, 7);

            a.creator(
                '1000002'
                + '1000002'
                + '0100200'
                + '1100202'
                + '0110000'
                + '0110200'
            );

            assert.equal(
                a.getAllVertical(),
                "1"
            );
        });
    });

    // describe('The winner is 1!', function() {
    //    it('should be 1', function () {
    //        let a = new Struktur(6, 7);
    //        a.setMatrixByString(
    //            '0000000'
    //            + '0000000'
    //            + '0001000'
    //            + '0012000'
    //            + '0121000'
    //            + '1221000'
    //        );

    //        assert.equal(a.isWinner(), 1);
    //    })
    //});

});


describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});
