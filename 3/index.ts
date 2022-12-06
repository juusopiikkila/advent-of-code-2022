import { strictEqual } from 'assert';
import { chunk, intersection } from 'lodash';
import { getInput } from '../utils';

const priorityList = 'abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWYXZ';

function getItemPrioritiesInBothRugsacks(data: string[]): number {
    let itemList: string[] = [];

    for (const row of data) {
        const compartment1 = row.slice(0, row.length / 2).split('');
        const compartment2 = row.slice(row.length / 2).split('');

        itemList = [
            ...itemList,
            ...intersection(compartment1, compartment2),
        ];
    }

    return itemList.reduce((accumulator, item) => accumulator + priorityList.indexOf(item) + 1, 0);
}

function getGroupPriorities(data: string[]): number {
    let itemList: string[] = [];

    for (const rows of chunk(data, 3)) {
        itemList = [
            ...itemList,
            ...intersection(...rows.map((row) => row.split(''))),
        ];
    }

    return itemList.reduce((accumulator, item) => accumulator + priorityList.indexOf(item) + 1, 0);
}

function part1(data: string[]): number {
    return getItemPrioritiesInBothRugsacks(data);
}

function part2(data: string[]): number {
    return getGroupPriorities(data);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = [
        'vJrwpWtwJgWrhcsFMMfFFhFp',
        'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
        'PmmdzqPrVvPwwTWBwg',
        'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
        'ttgJtRGJQctTZtZT',
        'CrZsJsPPZsGzwwsLwLmpwMDw',
    ];

    strictEqual(getItemPrioritiesInBothRugsacks(testData), 157);

    console.log('Part 1', part1(data));

    strictEqual(getGroupPriorities(testData), 70);

    console.log('Part 2', part2(data));
}

main();
