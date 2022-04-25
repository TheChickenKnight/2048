import pkg from 'neataptic';
const { methods, architect } = pkg;
import { _2048 } from "./2048.js";

export default class bot {
    constructor() {
        this.brain = new architect.Random(9, 6, 4, {});
        this.game = new _2048();
    }

    static flatten(twoD) {
        let res = [];
        for (let i = 0; i < twoD.length; i++)
            for (let j = 0; j < twoD[i].length; j++)
                res.push(twoD[i][j]);
        return res;
    }

    turn() {
        this.game.move(this.brain.activate(bot.flatten(this.game.data)));
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