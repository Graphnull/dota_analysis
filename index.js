let fs = require('fs');
let text = fs.readFileSync('match.csv', 'utf8');
//console.log(text);
let parse = require('csv-parse/lib/sync')

const records = parse(text, {
    columns: true,
    skip_empty_lines: true
});

//Объект.сумма всех голосов
let statsPositiveVotes = {};
//Объект.количество
let statsCount = {};
records.forEach(item => {
    let minute = Math.floor(parseInt(item.duration) / 60)
    let positiveVotes = parseInt(item.positive_votes)
    // если такой минуты нет, то записываем поле с текущей минутой
    if (!statsPositiveVotes[minute]) {
        statsPositiveVotes[minute] = 0
        statsCount[minute] = 0
    }

    statsPositiveVotes[minute] += positiveVotes
    statsCount[minute]++
})
let statsResult = {}
// находим среднее арифметическое голосов на количество матчей
Object.keys(statsPositiveVotes).forEach(minute => {
    statsResult[minute] = statsPositiveVotes[minute] / statsCount[minute]
})

console.log(statsResult);
let Architect = require('synaptic').Architect
let Trainer = require('synaptic').Trainer

var myNetwork = new Architect.Perceptron(1, 7, 1)
var trainer = new Trainer(myNetwork)

var trainingSet = [];
Object.keys(statsResult).forEach(minute => {
    trainingSet.push({
        input: [minute / 60],
        output: [statsResult[minute] / 10]
    })

})

trainer.train(trainingSet, {
    rate: .1,
    iterations: 200000,
    error: .005,
    shuffle: false,
    log: 1000,
    cost: Trainer.cost.CROSS_ENTROPY,
});
for (let minute = 0; minute !== 120; minute++) {
    console.log(minute, (myNetwork.activate([minute / 60])[0]) * 10)
}
