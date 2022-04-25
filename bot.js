import pkg from 'neataptic';
const { methods, architect } = pkg;
import { _2048 } from "./2048.js";

export default class bot {
    constructor() {
        this.rep = 1;
        this.brain = new architect.Random(18, 6, 4, {});
        this.game = new _2048();
        this.prev = [10, 0];
    }

    static flatten(twoD) {
        let res = [];
        for (let i = 0; i < twoD.length; i++)
            for (let j = 0; j < twoD[i].length; j++)
                res.push(twoD[i][j]);
        return res;
    }

    static choice = dir => dir.map((el, i) => [el , i+1]).sort((a, b) => b[0] - a[0])[0][1];

    turn() {
        let choice = this.brain.activate(bot.flatten(this.game.data).concat([this.rep, this.game.steps]));
        if(bot.choice(this.prev) == bot.choice(choice))
            this.rep+=1;
        else
            this.rep = 0;
        this.prev = choice;
        this.game.move(choice.concat([this.rep, this.game.steps]));
    }

    fromParent() {
        let newBrain = this.brain;
        let mutations = Math.floor(Math.random() * 1);
        for (let i = 0; i < mutations; i++)
            newBrain.mutate(methods.mutation.FFW[Math.floor(Math.random() * methods.mutation.FFW.length)]);
        let child = new bot();
        child.brain = newBrain;
        return child;
    }
}