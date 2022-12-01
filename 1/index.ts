import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getCaloriesByElf(data: string[]): number[] {
    const arr: number[] = [];
    let currentCount = 0;

    for (const row of data) {
        if (row.length === 0) {
            arr.push(currentCount);

            currentCount = 0;
        } else {
            currentCount += Number.parseInt(row, 10);
        }
    }

    arr.push(currentCount);

    return arr;
}

function getLargestCaloryElfNumber(data: string[]): number {
    const elfs = getCaloriesByElf(data);
    const sortedElfs = [...elfs].sort((a, b) => b - a);

    return elfs.indexOf(sortedElfs[0]) + 1;
}

function getTopElfsTotal(data: string[]): number {
    return getCaloriesByElf(data)
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((accumulator, count) => accumulator + count, 0);
}

function part1(data: string[]): number {
    return getCaloriesByElf(data).sort((a, b) => b - a)[0];
}

function part2(data: string[]): number {
    return getTopElfsTotal(data);
}

try {
    readFileToArray('./1/input.txt').then((data) => {
        const testData = [
            '1000',
            '2000',
            '3000',
            '',
            '4000',
            '',
            '5000',
            '6000',
            '',
            '7000',
            '8000',
            '9000',
            '',
            '10000',
        ];

        strictEqual(getLargestCaloryElfNumber(testData), 4);

        console.log('Part 1', part1(data));

        strictEqual(getTopElfsTotal(testData), 45000);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
