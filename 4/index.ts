import { strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

function getRange(from: number, to: number): number[] {
    const array: number[] = [];

    for (let index = from; index <= to; index += 1) {
        array.push(index);
    }

    return array;
}

function getOverlappingAssigmentCount(data: string[], any = false): number {
    return data.filter((row) => {
        const [elf1, elf2] = row.split(',');

        const [elf1From, elf1To] = elf1.split('-').map(Number);
        const [elf2From, elf2To] = elf2.split('-').map(Number);

        const elf1Range = getRange(elf1From, elf1To);
        const elf2Range = getRange(elf2From, elf2To);

        if (any) {
            return elf1Range.some((item) => elf2Range.includes(item))
                || elf2Range.some((item) => elf1Range.includes(item));
        }

        return elf1Range.every((item) => elf2Range.includes(item))
            || elf2Range.every((item) => elf1Range.includes(item));
    }).length;
}

function part1(data: string[]): number {
    return getOverlappingAssigmentCount(data);
}

function part2(data: string[]): number {
    return getOverlappingAssigmentCount(data, true);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(getOverlappingAssigmentCount(testData), 2);

    console.log('Part 1', part1(data));

    strictEqual(getOverlappingAssigmentCount(testData, true), 4);

    console.log('Part 2', part2(data));
}

main();
