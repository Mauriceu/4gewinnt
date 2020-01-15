<!DOCTYPE html>
<html>
    <head>
        <title>Vier Gewinnt</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
        <script type='text/javascript' src='knockout-3.5.1.js'></script>
        <script type='text/javascript' src='Spielfeld.js'></script>
        <script type='text/javascript' src='app.js'></script>
         <link rel='stylesheet' type='text/css' href='style.css'>
    </head>



    <body>

    <div class="playground">
        <div class="score">
            <div id="p1" style="flex: 2;"></div>
            <div class="void" style="flex: 3;">sdfsdfs</div>
            <div id="p2" style="flex:2"></div>
        </div>

        <div class="container1" data-bind="foreach: data"> <!-- bindet den data-array ans div-tag. Damit wird für jeden Data-Eintrag das darunterliegende Skript ausgeführt -->

            <div class="container2" data-bind="foreach: $data">
                <div class="blocks">

                    <div data-bind="css: {corny: $data >= '0', white: $data === '0', yellow1: $data === '1', red2: $data === '2'},
                                    attr: { 'id': $parentContext.$index() + '_' + $index()},
                                    click: $root.chipInserted"></div>
        <!--
                    <div data-bind="if: $root.$data = 1
                                    class: 'corny yellow1',
                                    attr: { 'id': $parentContext.$index() + '_' + $index() },
                                    click: $root.chipInserted"></div>

                    <div data-bind="if: $root.$data(),
                                    class: 'corny red2',
                                    attr: { 'id': $parentContext.$index() + '_' + $index() },
                                    click: $root.chipInserted"></div>
                     -->

                </div>
            </div>
        </div>
    </div>


    </body>


</html>


<!--

<div>
    <form data-bind="submit: create">
        Number of Rows:    <input data-bind="value: inrows"/><br>
        Number of Columns: <input data-bind="value: incols"/><br>
        Random Numbers: <input type="checkbox" data-bind="checked: randomNum"/>
        <p data-bind="if: randomNum() !== true">Matrix
            <input type="text" data-bind="value: input"/>
        </p>
        <button type="submit"> Submit </button>

    </form>
</div>


-->
