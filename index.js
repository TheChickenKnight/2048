import { _2048 } from "./2048.js";
import bot from "./bot.js";
import fs from "fs";

let bots = [];

for (let i = 0; i < 10000; i++)
    bots.push(new bot());

for (let bot of bots) {
    while(!bot.game.win && !bot.game.loss) {
        let data = bot.game.data;
        bot.turn();
        if (_2048.isEqual(data, bot.game.data))
            break;
    }
}

let bestBot = {
    game: {
        win: false
    }
};

let count = 0;
while(!bestBot.game.win) {
    count++;
    console.log("_______________________\nEpoch " + count + ":");
    bestBot = bots.reduce((b, a) => b.game.points > a.game.points ? b : a);
    console.log(bestBot.game.toString(), "| Points: ", bestBot.game.points, "| Steps: ", bestBot.game.steps);
    fs.writeFileSync('log.txt', "Epoch " + count + "\n" + bestBot.game.toString() + "\nPoints: " + bestBot.game.points + "\nSteps: " + bestBot.game.steps + "\nWin/Loss?: " + (bestBot.game.win ? "Win" : (bestBot.game.loss ? "Loss" : "")));
    bots = [];
    for (var j = 0; j < 10000; j++)
        bots.push(bestBot.fromParent());
    for (let bot of bots) {
        while(!bot.game.win && !bot.game.loss) {
            let data = bot.game.data;
            bot.turn();
            if (_2048.isEqual(data, bot.game.data))
                break;
        }
    }
}