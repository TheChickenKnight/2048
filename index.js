import {_2048} from "./2048.js"

let game = new _2048();
let olddata = game.data;
for (let i = 0; i < 10; i++)
    setTimeout(() => {
        if (!isEqual(olddata, game.data))
            game.addRand(Math.round(Math.random()) ? 2 : 4);
        olddata = game.data;
        if (i % 2 == 0) {
            game.mergeDown();
            console.log("Down");
        }
        else {
            game.mergeLeft();
            console.log("Left");
        }
        console.log(game.toString() + '\n__________');
    }, i * 1000);

function isEqual(arr1, arr2) {
    for (let i = 0; i < arr2.length; i++)
        for (let j = 0; j < arr2[0].length; j++)
            if (arr1[i][j] != arr2[i][j])
                return false;
    return true;
}