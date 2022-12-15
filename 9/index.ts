/* eslint-disable no-use-before-define */
import { strictEqual } from 'assert';
import { uniqBy } from 'lodash';
import { Coord, getExampleInput, getInput } from '../utils';

type Direction = 'U' | 'R' | 'D' | 'L';

interface Instruction {
    direction: Direction
    distance: number
}

class Knot {
    parent: Knot | Rope;

    coordinates: Coord = { x: 0, y: 0 };

    visitedCoordinates: Coord[] = [
        { x: 0, y: 0 },
    ];

    constructor(
        parent: Knot | Rope,
    ) {
        this.parent = parent;
    }

    move() {
        const distanceX = Math.abs(this.parent.coordinates.x - this.coordinates.x);
        const distanceY = Math.abs(this.parent.coordinates.y - this.coordinates.y);
        const totalDistance = distanceX + distanceY;

        if (totalDistance > 2) {
            if (this.parent.coordinates.x > this.coordinates.x) {
                this.coordinates.x += 1;
            } else {
                this.coordinates.x -= 1;
            }

            if (this.parent.coordinates.y > this.coordinates.y) {
                this.coordinates.y += 1;
            } else {
                this.coordinates.y -= 1;
            }
        } else if (distanceX > 1) {
            if (this.parent.coordinates.x > this.coordinates.x) {
                this.coordinates.x += 1;
            } else {
                this.coordinates.x -= 1;
            }
        } else if (distanceY > 1) {
            if (this.parent.coordinates.y > this.coordinates.y) {
                this.coordinates.y += 1;
            } else {
                this.coordinates.y -= 1;
            }
        }

        this.visitedCoordinates.push({
            ...this.coordinates,
        });
    }

    getLocationCount() {
        return uniqBy(this.visitedCoordinates, (item) => `${item.x}.${item.y}`).length;
    }
}

class Rope {
    coordinates: Coord = { x: 0, y: 0 };

    instructions: Instruction[] = [];

    knots: Knot[] = [];

    constructor(data: string[], knots = 1) {
        this.parseData(data);

        for (let index = 0; index < knots; index += 1) {
            this.knots.push(new Knot(index === 0 ? this : this.knots[index - 1]));
        }
    }

    private parseData(data: string[]) {
        for (const row of data) {
            const [direction, distance] = row.split(' ');

            this.instructions.push({
                direction: direction as Direction,
                distance: Number(distance),
            });
        }
    }

    private processInstructions() {
        for (const instruction of this.instructions) {
            for (let index = 0; index < instruction.distance; index += 1) {
                switch (instruction.direction) {
                    case 'U': {
                        this.coordinates.y -= 1;
                        break;
                    }
                    case 'R': {
                        this.coordinates.x += 1;
                        break;
                    }
                    case 'D': {
                        this.coordinates.y += 1;
                        break;
                    }
                    case 'L': {
                        this.coordinates.x -= 1;
                        break;
                    }
                    default:
                }

                this.knots.forEach((knot) => knot.move());
            }
        }
    }

    getTailLocationCount() {
        this.processInstructions();

        const tail = this.knots[this.knots.length - 1];

        return tail.getLocationCount();
    }
}

function part1(data: string[]): number {
    return (new Rope(data)).getTailLocationCount();
}

function part2(data: string[]): number {
    return (new Rope(data, 9)).getTailLocationCount();
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);
    const testData2 = await getExampleInput(__dirname, 2);

    strictEqual((new Rope(testData)).getTailLocationCount(), 13);

    console.log('Part 1', part1(data));

    strictEqual((new Rope(testData, 9)).getTailLocationCount(), 1);
    strictEqual((new Rope(testData2, 9)).getTailLocationCount(), 36);

    console.log('Part 2', part2(data));
}

main();
