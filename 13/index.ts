import { strictEqual } from 'assert';
import { chunk, zip } from 'lodash';
import { getExampleInput, getInput } from '../utils';

type PacketData = (number | PacketData)[];

function comparePairs(leftPacket: PacketData, rightPacket: PacketData): boolean | null {
    for (const [leftItem, rightItem] of zip(leftPacket, rightPacket)) {
        if (leftItem === undefined) {
            return true;
        }

        if (rightItem === undefined) {
            return false;
        }

        if (!Array.isArray(leftItem) && !Array.isArray(rightItem)) {
            if (leftItem < rightItem) {
                return true;
            }

            if (leftItem > rightItem) {
                return false;
            }

            // eslint-disable-next-line no-continue
            continue;
        }

        const result = comparePairs(
            Array.isArray(leftItem) ? leftItem : [leftItem],
            Array.isArray(rightItem) ? rightItem : [rightItem],
        );

        if (result !== null) {
            return result;
        }
    }

    return null;
}

function getPairs(data: string[]): [PacketData, PacketData][] {
    const chunks = chunk(data, 3)
        .map((item) => item.slice(0, 2))
        .map((item) => item.map((packet) => JSON.parse(packet)));

    return chunks.map<[PacketData, PacketData]>((item) => [item[0], item[1]]);
}

function getInOrderSum(data: string[]) {
    const pairs = getPairs(data);

    return pairs
        .reduce((accumulator, pair, index) => (
            accumulator + (comparePairs(...pair) ? index + 1 : 0)
        ), 0);
}

function getDecoderKey(data: string[]) {
    const pairs = [
        ...getPairs(data),
        [[[2]], [[6]]],
    ].flat().sort((a, b) => {
        const results = comparePairs(a, b);

        if (results === null) {
            return 0;
        }

        return results ? -1 : 1;
    }).map((item) => JSON.stringify(item));

    const divider1Index = 1 + pairs.indexOf('[[2]]');
    const divider2Index = 1 + pairs.indexOf('[[6]]');

    return divider1Index * divider2Index;
}

function part1(data: string[]): number {
    return getInOrderSum(data);
}

function part2(data: string[]): number {
    return getDecoderKey(data);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(getInOrderSum(testData), 13);

    console.log('Part 1', part1(data));

    strictEqual(getDecoderKey(testData), 140);

    console.log('Part 2', part2(data));
}

main();
