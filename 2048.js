export class _2048 {
    constructor() {
        this.moves = 0;
        this.loss = false;
        this.data = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.old = this.data;
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
        return result;
    }

    static mergeRowLeft = (row, game) => _2048.mergeRowRight([...row].reverse(), game).reverse();

    mergeRight = () => this.data.map(row => _2048.mergeRowRight(row, this));
    mergeLeft = () => this.data.map(row => _2048.mergeRowLeft(row, this));
    mergeUp = () => _2048.zip(_2048.zip(this.data).map(row => _2048.mergeRowLeft(row, this)));
    mergeDown = () => _2048.zip(_2048.zip(this.data).map(row => _2048.mergeRowRight(row, this)));

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

    static isEqual(arr1, arr2) {
        for (let i = 0; i < arr2.length; i++)
            for (let j = 0; j < arr2[0].length; j++)
                if (arr1[i][j] != arr2[i][j])
                    return false;
        return true;
    }

    move(dir) {
        if(this.loss)
            return;
        this.steps++;
        if (!_2048.isEqual(this.data, this.old))
            this.addRand(Math.round(Math.random()) ? 2 : 4);
        this.old = this.data;
        var use;
        dir = dir.map((el, i) => [el , i+1]).sort((a, b) => b - a)[0][1];
        if (dir == 1) {
            this.data = this.mergeUp();
            use = [this.mergeRight, this.mergeDown, this.mergeLeft];
        } else if (dir == 2) {
            this.data = this.mergeLeft();
            use = [this.mergeRight, this.mergeDown, this.mergeUp];
        } else if (dir == 3) {
            this.data = this.mergeRight();
            use = [this.mergeLeft, this.mergeUp, this.mergeDown];
        } else if (dir == 4) {
            this.data = this.mergeDown();
            use = [this.mergeUp, this.mergeLeft, this.mergeRight];
        }
        if (this.steps > 500)
            for (let row of this.data)
                for (let el of row)
                    if (el == 2048)
                        return this.win = true;
        if (_2048.isEqual(this.old, this.data)) {
            for (let i = 0; i < use.length; i++) {
                if (_2048.isEqual(this.old, use[i]()))
                    return;
            }
            //this.points -= 4096;
            return this.loss = true;
        }
    }

    toString() {
        return this.data.map(row => row.join(' ')).join('\n');
    }
}