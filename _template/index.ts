import { strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

function part1(data: string[]): number {
    return 0;
}

function part2(data: string[]): number {
    return 0;
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    // strictEqual(test(testData), 2);

    console.log('Part 1', part1(data));

    // strictEqual(test(testData), 2);

    console.log('Part 2', part2(data));
}

main();
