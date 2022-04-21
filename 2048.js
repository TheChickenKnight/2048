export class _2048 {
    constructor() {
        this.data = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.points = 0;
        this.steps = 0;
        this.addRand(2);
        this.addRand(Math.round(Math.random()) ? 2 : 4);
    }

    static peek = array => array[array.length - 1];

    static zip(arrays) {
        const result = [];
        for (let i = 0; i < arrays[0].length; ++i) {
          result.push(arrays.map(array => array[i]));
        }
        return result;
      }

    static mergeRowRight(thisRow, game) {
        let points = 0;
        const row = thisRow.filter(x => x !== 0);
        const result = [];
        while (row.length) {
            let value = row.pop();
            if (_2048.peek(row) === value) {
                value += row.pop();
                points += value;
            }
            result.unshift(value);
        }
        while (result.length < 4) 
            result.unshift(0);
        game.points += points;
        game.steps += 0.25;
        return result;
    }

    static mergeRowLeft = (row, game) => _2048.mergeRowRight([...row].reverse(), game).reverse();

    mergeRight = () => this.data = this.data.map(row => _2048.mergeRowRight(row, this));
    mergeLeft = () => this.data = this.data.map(row => _2048.mergeRowLeft(row, this));
    mergeUp = () => this.data = _2048.zip(_2048.zip(this.data).map(row => _2048.mergeRowLeft(row, this)));
    mergeDown = () => this.data = _2048.zip(_2048.zip(this.data).map(row => _2048.mergeRowRight(row, this)));

    addRand(num) {
        let pos = {
            x: Math.floor(Math.random()*4),
            y: Math.floor(Math.random()*4)
        };
        while (this.data[pos.y][pos.x] != 0)
            pos = {
                x: Math.floor(Math.random()*4),
                y: Math.floor(Math.random()*4)
            };
        this.data[pos.y][pos.x] = num;
    }

    toString() {
        return this.data.map(row => row.join(' ')).join('\n');
    }
}