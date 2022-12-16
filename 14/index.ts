import { strictEqual } from 'assert';
import {
    Coord,
    generateMap,
    getExampleInput,
    getInput,
} from '../utils';

class Sand {
    isOffBounds = false;

    isResting = false;

    constructor(
        public coordinates: Coord,
        private cave: Cave,
    ) {}

    move() {
        const bottomCenterSand = this.cave.sand.some((sand) => (
            sand.coordinates.y === this.coordinates.y + 1
            && sand.coordinates.x === this.coordinates.x
        ));

        const bottomLeftSand = this.cave.sand.some((sand) => (
            sand.coordinates.y === this.coordinates.y + 1
            && sand.coordinates.x === this.coordinates.x - 1
        ));

        const bottomRightSand = this.cave.sand.some((sand) => (
            sand.coordinates.y === this.coordinates.y + 1
            && sand.coordinates.x === this.coordinates.x + 1
        ));

        const bottomCenterWall = (this.cave.withFloor && this.coordinates.y + 1 >= this.cave.maxY)
            || this.cave.walls.some((wall) => (
                wall.coordinates.y === this.coordinates.y + 1
                && wall.coordinates.x === this.coordinates.x
            ));

        const bottomLeftWall = (this.cave.withFloor && this.coordinates.y + 1 >= this.cave.maxY)
            || this.cave.walls.some((wall) => (
                wall.coordinates.y === this.coordinates.y + 1
                && wall.coordinates.x === this.coordinates.x - 1
            ));

        const bottomRightWall = (this.cave.withFloor && this.coordinates.y + 1 >= this.cave.maxY)
            || this.cave.walls.some((wall) => (
                wall.coordinates.y === this.coordinates.y + 1
                && wall.coordinates.x === this.coordinates.x + 1
            ));

        if (!this.cave.withFloor && this.cave.maxY < this.coordinates.y + 1) {
            this.isOffBounds = true;

            return;
        }

        if (!bottomCenterWall && !bottomCenterSand) {
            this.coordinates.y += 1;
        } else if (!bottomLeftWall && !bottomLeftSand) {
            this.coordinates.y += 1;
            this.coordinates.x -= 1;
        } else if (!bottomRightWall && !bottomRightSand) {
            this.coordinates.y += 1;
            this.coordinates.x += 1;
        } else {
            this.isResting = true;
            throw new Error('Stuck');
        }
    }
}

class Wall {
    constructor(
        public coordinates: Coord,
    ) {}
}

class Cave {
    source: Coord = { x: 500, y: 0 };

    sand: Sand[] = [];

    walls: Wall[] = [];

    maxY = 0;

    constructor(
        data: string[],
        public withFloor = false,
    ) {
        this.parseData(data);
    }

    private parseData(data: string[]) {
        const lines = data.map<Coord[]>((row) => (
            row
                .split(' -> ')
                .map((coords) => {
                    const [x, y] = coords.split(',').map(Number);

                    return { x, y };
                })
        ));

        const yCoords = lines.flat().map((coord) => coord.y).sort((a, b) => a - b);

        this.maxY = yCoords[yCoords.length - 1] + 2;

        for (const line of lines) {
            const coords = this.getLineCoords(line);

            for (const coord of coords) {
                this.walls.push(new Wall(coord));
            }
        }
    }

    private getLineCoords(coords: Coord[]): Coord[] {
        const array: Coord[] = [
            ...coords,
        ];

        for (const [index, coord] of coords.slice(0, -1).entries()) {
            const next = coords[index + 1];

            if (next.y === coord.y) {
                // horizontal
                const numbers = [next.x, coord.x].sort((a, b) => a - b);

                for (let x = numbers[0] + 1; x < numbers[1]; x += 1) {
                    array.push({
                        x,
                        y: coord.y,
                    });
                }
            } else if (next.x === coord.x) {
                // vertical
                const numbers = [next.y, coord.y].sort((a, b) => a - b);

                for (let y = numbers[0] + 1; y < numbers[1]; y += 1) {
                    array.push({
                        x: coord.x,
                        y,
                    });
                }
            }
        }

        return array;
    }

    private printMap() {
        const yCoords = [
            ...this.walls,
            ...this.sand,
        ].flat().map((item) => item.coordinates.y).sort((a, b) => a - b);

        const xCoords = [
            ...this.walls,
            ...this.sand,
        ].flat().map((item) => item.coordinates.x).sort((a, b) => a - b);

        const xOffset = xCoords[0];

        const size: Coord = {
            x: xCoords[xCoords.length - 1] - xOffset,
            y: yCoords[yCoords.length - 1],
        };

        const normalizedWalls = this.walls.map<Coord>((wall) => ({
            x: wall.coordinates.x - xOffset,
            y: wall.coordinates.y,
        }));

        const normalizedSands = this.sand.map<Coord>((sand) => ({
            x: sand.coordinates.x - xOffset,
            y: sand.coordinates.y,
        }));

        const map = generateMap(size.x + 1, size.y + 1, '.');

        for (const wall of normalizedWalls) {
            map[wall.y][wall.x] = '#';
        }

        for (const sand of normalizedSands) {
            map[sand.y][sand.x] = 'o';
        }

        for (const row of map) {
            console.log(row.join(''));
        }

        console.log('');
    }

    getRestingSandCount(debug = false) {
        this.sand.push(new Sand({ ...this.source }, this));

        if (debug) {
            this.printMap();
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const sand = this.sand[this.sand.length - 1];

            try {
                sand.move();

                if (sand.isOffBounds) {
                    break;
                }
            } catch {
                if (sand.coordinates.x === this.source.x && sand.coordinates.y === this.source.y) {
                    break;
                }

                this.sand.push(new Sand({ ...this.source }, this));
            }

            if (debug) {
                this.printMap();
            }
        }

        if (debug) {
            this.printMap();
        }

        return this.sand.filter((item) => item.isResting).length;
    }
}

function part1(data: string[]): number {
    return (new Cave(data)).getRestingSandCount();
}

function part2(data: string[]): number {
    return (new Cave(data, true)).getRestingSandCount();
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual((new Cave(testData)).getRestingSandCount(true), 24);

    console.log('Part 1', part1(data));

    strictEqual((new Cave(testData, true)).getRestingSandCount(true), 93);

    console.log('Part 2', part2(data));
}

main();
