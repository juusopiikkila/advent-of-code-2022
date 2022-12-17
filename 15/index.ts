import { strictEqual } from 'assert';
import {
    Coord,
    generateMap,
    getExampleInput,
    getInput,
    getManhattanDistance,
} from '../utils';

class Beacon {
    constructor(
        public coordinates: Coord,
    ) {}
}

class Sensor {
    private distanceToBeacon: number;

    constructor(
        public coordinates: Coord,
        public closestBeacon: Beacon,
    ) {
        this.distanceToBeacon = getManhattanDistance(
            [coordinates.x, coordinates.y],
            [closestBeacon.coordinates.x, closestBeacon.coordinates.y],
        );
    }

    isCovered(coord: Coord): boolean {
        const distance = getManhattanDistance(
            [this.coordinates.x, this.coordinates.y],
            [coord.x, coord.y],
        );

        return distance <= this.distanceToBeacon;
    }

    getPerimeter(): Coord[] {
        const min: Coord = {
            x: this.coordinates.x - this.distanceToBeacon - 1,
            y: this.coordinates.y - this.distanceToBeacon - 1,
        };

        const max: Coord = {
            x: this.coordinates.x + this.distanceToBeacon + 1,
            y: this.coordinates.y + this.distanceToBeacon + 1,
        };

        const distance = this.distanceToBeacon + 1;
        const coords: Coord[] = [];

        for (let { y } = min; y <= max.y; y += 1) {
            const count = Math.abs(this.coordinates.y - y);
            const diff = distance - count;

            if (diff === 0) {
                coords.push({
                    y,
                    x: this.coordinates.x,
                });
            } else {
                coords.push({
                    y,
                    x: this.coordinates.x - diff,
                }, {
                    y,
                    x: this.coordinates.x + diff,
                });
            }
        }

        return coords;
    }
}

class Map {
    private sensors: Sensor[] = [];

    private beacons: Beacon[] = [];

    constructor(data: string[]) {
        this.parseData(data);
    }

    private parseData(data: string[]) {
        const regex = /^Sensor at x=([\d-]+), y=([\d-]+): closest beacon is at x=([\d-]+), y=([\d-]+)$/;

        for (const row of data) {
            const matches = row.match(regex);

            if (!matches) {
                throw new Error('No matches');
            }

            const sensorCoords: Coord = {
                x: Number(matches[1]),
                y: Number(matches[2]),
            };

            const beaconCoords: Coord = {
                x: Number(matches[3]),
                y: Number(matches[4]),
            };

            let beacon = this.beacons.find((item) => (
                item.coordinates.x === beaconCoords.x && item.coordinates.y === beaconCoords.y
            ));

            if (!beacon) {
                beacon = new Beacon(beaconCoords);

                this.beacons.push(beacon);
            }

            this.sensors.push(new Sensor(sensorCoords, beacon));
        }
    }

    private getXBoundaries(): [number, number] {
        const xCoords = [
            ...this.sensors,
            ...this.beacons,
        ].flat().map((item) => item.coordinates.x).sort((a, b) => a - b);

        return [
            xCoords[0],
            xCoords[xCoords.length - 1],
        ];
    }

    private printMap() {
        const yCoords = [
            ...this.sensors,
            ...this.beacons,
        ].flat().map((item) => item.coordinates.y).sort((a, b) => a - b);

        const xCoords = [
            ...this.sensors,
            ...this.beacons,
        ].flat().map((item) => item.coordinates.x).sort((a, b) => a - b);

        const xOffset = xCoords[0];

        const size: Coord = {
            x: xCoords[xCoords.length - 1] - xOffset,
            y: yCoords[yCoords.length - 1],
        };

        const map = generateMap(size.x + 1, size.y + 1, '.');

        const normalizedBeacons = this.beacons.map<Coord>((item) => ({
            x: item.coordinates.x - xOffset,
            y: item.coordinates.y,
        }));

        for (const item of normalizedBeacons) {
            map[item.y][item.x] = 'B';
        }

        const normalizedSensors = this.sensors.map<Coord>((item) => ({
            x: item.coordinates.x - xOffset,
            y: item.coordinates.y,
        }));

        for (const item of normalizedSensors) {
            map[item.y][item.x] = 'S';
        }

        for (const row of map) {
            console.log(row.join(''));
        }

        console.log('');
    }

    getNonBeaconPositions(y: number) {
        let [min, max] = this.getXBoundaries();

        while (true) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            if (!this.sensors.some((sensor) => sensor.isCovered({
                x: min - 1,
                y,
            }))) {
                break;
            }

            min -= 1;
        }

        while (true) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            if (!this.sensors.some((sensor) => sensor.isCovered({
                x: max + 1,
                y,
            }))) {
                break;
            }

            max += 1;
        }

        let total = 0;

        for (let x = min - 20; x < max + 20; x += 1) {
            const beacon = this.beacons.find((item) => (
                item.coordinates.x === x && item.coordinates.y === y
            ));

            const sensor = this.sensors.find((item) => (
                item.coordinates.x === x && item.coordinates.y === y
            ));

            const isCovered = this.sensors.some((item) => item.isCovered({ x, y }));

            if (!beacon && !sensor && isCovered) {
                total += 1;
            }
        }

        return total;
    }

    getTuningFrequency(max: number) {
        const perimeters = this.sensors.reduce<Coord[]>((accumulator, sensor) => [
            ...accumulator,
            ...sensor.getPerimeter().filter((coord) => (
                coord.x >= 0
                && coord.y >= 0
                && coord.x <= max
                && coord.y <= max
            )),
        ], []);

        for (const coord of perimeters) {
            if (
                this.sensors.some((item) => (
                    item.coordinates.x === coord.x && item.coordinates.y === coord.y
                ))
                || this.beacons.some((item) => (
                    item.coordinates.x === coord.x && item.coordinates.y === coord.y
                ))
            ) {
                // eslint-disable-next-line no-continue
                continue;
            }

            if (!this.sensors.some((item) => item.isCovered(coord))) {
                return (coord.x * 4_000_000) + coord.y;
            }
        }

        return 0;
    }
}

function part1(data: string[]): number {
    return (new Map(data)).getNonBeaconPositions(2_000_000);
}

function part2(data: string[]): number {
    return (new Map(data)).getTuningFrequency(4_000_000);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual((new Map(testData)).getNonBeaconPositions(10), 26);

    console.log('Part 1', part1(data));

    strictEqual((new Map(testData)).getTuningFrequency(20), 56_000_011);

    console.log('Part 2', part2(data));
}

main();
