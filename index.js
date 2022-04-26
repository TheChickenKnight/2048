import bot from "./bot.js";
import fs from "fs";
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

let bots = [];

let bestBot = {
    game: {
        win: false
    }
};
let topBots;

const width = 1920;
	const height = 1080;
	const configuration = {
		type: 'line',
		data: {
			labels: [],
			datasets: [
                {
                    label: 'Top of Epoch x Points',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,255,255,1)',
                    ],
                    borderWidth: 5
                },
                {
                    label: 'Top Steps',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(0,255,0,1)',
                    ],
                    borderWidth: 5
                },
                {
                    label: 'Highest Block',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 5
                }
            ]
		},
		options: {
		},
		plugins: [{
			id: 'background-colour',
			beforeDraw: (chart) => {
				const ctx = chart.ctx;
				ctx.save();
				ctx.fillStyle = 'black';
				ctx.fillRect(0, 0, width, height);
				ctx.restore();
			}
		}]
	};
	const chartCallback = (ChartJS) => {
		ChartJS.defaults.responsive = true;
		ChartJS.defaults.maintainAspectRatio = false;
	};

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

let count = 0;



(async () => {
    while(!bestBot.game.win) {
        count++;
        bots = [];
        if (count == 1)
            for (var k = 0; k < 3000; k++)
                bots.push(new bot());
        else
            for (let top of topBots)
                for (let i = 0; i < 3000/topBots.length; i++)
                    bots.push(top.fromParent());
        for (const used of bots) {
            while(!used.game.win && !used.game.loss && used.rep < 100 && used.game.steps < 10000) {
                used.turn(); 
            }
        }
               
        console.log("_______________________\nEpoch " + count + ":");
        bestBot = bots.reduce((b, a) => b.game.points > a.game.points ? b : a);
        configuration.data.labels.push(count);
        configuration.data.datasets[0].data.push(bestBot.game.points);
        configuration.data.datasets[1].data.push(bestBot.game.steps);
        configuration.data.datasets[2].data.push(bestBot.game.highestBlock);
        topBots = bots.sort((a, b) => b.game.points - a.game.points).slice(0, 99);
        console.log(bestBot.game.toString(), "| Points: ", bestBot.game.points, "| Steps: ", bestBot.game.steps);
        fs.writeFileSync('log.txt', "Epoch " + count + "\n" + bestBot.game.toString() + "\nPoints: " + bestBot.game.points + "\nSteps: " + bestBot.game.steps + "\nWin/Loss?: " + (bestBot.game.win ? "Win" : (bestBot.game.loss ? "Loss" : "")));
        let base = await chartJSNodeCanvas.renderToBuffer(configuration);
        fs.writeFileSync("./new-path.png", base);
    }
})();