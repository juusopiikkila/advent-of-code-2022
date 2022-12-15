import { strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

type ItemName = 'rock' | 'paper' | 'scissors';

interface Item {
    name: ItemName
    plays: string[]
    score: number
    answer: ItemName
}

const items: Item[] = [
    {
        name: 'rock',
        plays: ['A', 'X'],
        score: 1,
        answer: 'paper',
    },
    {
        name: 'paper',
        plays: ['B', 'Y'],
        score: 2,
        answer: 'scissors',
    },
    {
        name: 'scissors',
        plays: ['C', 'Z'],
        score: 3,
        answer: 'rock',
    },
];

function getScoreWithAnswers(data: string[]): number {
    let score = 0;

    for (const row of data) {
        const [opponentPlay, elfPlay] = row.split(' ');

        const opponentItem = items.find((item) => item.plays.includes(opponentPlay));
        const elfItem = items.find((item) => item.plays.includes(elfPlay));

        if (!opponentItem || !elfItem) {
            throw new Error('Item not found');
        }

        score += elfItem.score;

        if (opponentItem.answer === elfItem.name) {
            score += 6;
        } else if (opponentItem.name === elfItem.name) {
            score += 3;
        }
    }

    return score;
}

function getScoreWithOutcomes(data: string[]): number {
    let score = 0;

    for (const row of data) {
        const [opponentPlay, outcome] = row.split(' ');

        const opponentItem = items.find((item) => item.plays.includes(opponentPlay));

        if (!opponentItem) {
            throw new Error('Item not found');
        }

        let elfItem: Item | undefined;

        switch (outcome) {
            case 'X': {
                // lose
                elfItem = items.find((item) => item.name !== opponentItem.name && item.name !== opponentItem.answer);

                break;
            }
            case 'Y': {
                // draw
                elfItem = opponentItem;
                score += 3;

                break;
            }
            case 'Z': {
                // win
                elfItem = items.find((item) => item.name === opponentItem.answer);
                score += 6;

                break;
            }
            default:
        }

        if (!elfItem) {
            throw new Error('Item not found');
        }

        score += elfItem.score;
    }

    return score;
}

function part1(data: string[]): number {
    return getScoreWithAnswers(data);
}

function part2(data: string[]): number {
    return getScoreWithOutcomes(data);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(getScoreWithAnswers(testData), 15);

    console.log('Part 1', part1(data));

    strictEqual(getScoreWithOutcomes(testData), 12);

    console.log('Part 2', part2(data));
}

main();
