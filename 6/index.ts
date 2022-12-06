import { strictEqual } from 'assert';
import { uniq } from 'lodash';
import { getInput } from '../utils';

function getFirstMarker(data: string, length: number): number {
    for (let i = length; i < data.length; i += 1) {
        const marker = data.slice(i - length, i);

        if (uniq(marker).length === length) {
            return i;
        }
    }

    throw new Error('No marker found');
}

function part1(data: string[]): number {
    return getFirstMarker(data[0], 4);
}

function part2(data: string[]): number {
    return getFirstMarker(data[0], 14);
}

async function main() {
    const data = await getInput(__dirname);

    strictEqual(getFirstMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 4), 7);
    strictEqual(getFirstMarker('bvwbjplbgvbhsrlpgdmjqwftvncz', 4), 5);
    strictEqual(getFirstMarker('nppdvjthqldpwncqszvftbrmjlhg', 4), 6);
    strictEqual(getFirstMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 4), 10);
    strictEqual(getFirstMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 4), 11);

    console.log('Part 1', part1(data));

    strictEqual(getFirstMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 14), 19);
    strictEqual(getFirstMarker('bvwbjplbgvbhsrlpgdmjqwftvncz', 14), 23);
    strictEqual(getFirstMarker('nppdvjthqldpwncqszvftbrmjlhg', 14), 23);
    strictEqual(getFirstMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 14), 29);
    strictEqual(getFirstMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 14), 26);

    console.log('Part 2', part2(data));
}

main();
