import { strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

function getCaloriesByElf(data: string[]): number[] {
    const array: number[] = [];
    let currentCount = 0;

    for (const row of data) {
        if (row.length === 0) {
            array.push(currentCount);

            currentCount = 0;
        } else {
            currentCount += Number.parseInt(row, 10);
        }
    }

    array.push(currentCount);

    return array;
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

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(getLargestCaloryElfNumber(testData), 4);

    console.log('Part 1', part1(data));

    strictEqual(getTopElfsTotal(testData), 45_000);

    console.log('Part 2', part2(data));
}

main();
