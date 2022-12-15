import { strictEqual } from 'node:assert';
import {
    js as EasyStar,
    Direction,
    BOTTOM,
    LEFT,
    RIGHT,
    TOP,
} from 'easystarjs';
import { Coord, getExampleInput, getInput } from '../utils';

class HeightMap {
    map: string[][] = [];

    pathMap: number[][] = [];

    constructor(data: string[]) {
        this.parseData(data);
    }

    private getTileCoordinates(tile: string): Coord[] {
        const coords: Coord[] = [];

        for (const [y, row] of this.map.entries()) {
            for (const [x, item] of row.entries()) {
                if (item === tile) {
                    coords.push({
                        x,
                        y,
                    });
                }
            }
        }

        if (coords.length === 0) {
            throw new Error('Tile not found');
        }

        return coords;
    }

    private parseData(data: string[]) {
        this.map = data.map((row) => [...row]);
        this.pathMap = data.map<number[]>((row) => Array.from<number>({ length: row.length }).fill(0));
    }

    private getAdjacentCoordinates(x: number, y: number): Coord[] {
        return [
            { x, y: y - 1 },
            { x: x + 1, y },
            { x, y: y + 1 },
            { x: x - 1, y },
        ];
    }

    private getTile(x: number, y: number): string | undefined {
        const tile = this.map[y]?.[x];

        if (!tile) {
            return undefined;
        }

        if (tile === 'S') {
            return 'a';
        }

        if (tile === 'E') {
            return 'z';
        }

        return tile;
    }

    private getTileDirections(x: number, y: number): Direction[] {
        const tiles = [...'abcdefghijklmnopqrstuvwxyz'];

        let tile = this.map[y][x];
        if (tile === 'S') {
            tile = 'a';
        } else if (tile === 'E') {
            tile = 'z';
        }

        const adjacent = this.getAdjacentCoordinates(x, y);
        const tileIndex = tiles.indexOf(tile);

        const allowedTiles = tiles.slice(
            tileIndex < 1 ? 0 : tileIndex - 1,
        );

        const upTile = this.getTile(adjacent[0].x, adjacent[0].y);
        const rightTile = this.getTile(adjacent[1].x, adjacent[1].y);
        const bottomTile = this.getTile(adjacent[2].x, adjacent[2].y);
        const leftTile = this.getTile(adjacent[3].x, adjacent[3].y);

        return [
            ...upTile && allowedTiles.includes(upTile) ? [TOP] : [],
            ...rightTile && allowedTiles.includes(rightTile) ? [RIGHT] : [],
            ...bottomTile && allowedTiles.includes(bottomTile) ? [BOTTOM] : [],
            ...leftTile && allowedTiles.includes(leftTile) ? [LEFT] : [],
        ];
    }

    private async findPath(from: Coord): Promise<Coord[]> {
        const [to] = this.getTileCoordinates('E');

        return new Promise((resolve) => {
            const easystar = new EasyStar();

            easystar.setGrid(this.pathMap);
            easystar.setAcceptableTiles([0]);

            for (const [y, row] of this.map.entries()) {
                for (const [x] of row.entries()) {
                    easystar.setDirectionalCondition(x, y, this.getTileDirections(x, y));
                }
            }

            easystar.findPath(
                from.x,
                from.y,
                to.x,
                to.y,
                (path) => {
                    resolve(path);
                },
            );

            easystar.calculate();
        });
    }

    async getShortestPathLength() {
        const coordinates = [
            ...this.getTileCoordinates('S'),
            ...this.getTileCoordinates('a'),
        ];

        let minLength: number | undefined;

        for (const coord of coordinates) {
            // eslint-disable-next-line no-await-in-loop
            const path = await this.findPath(coord);

            if (path && (minLength === undefined || path.length < minLength)) {
                minLength = path.length;
            }
        }

        return (minLength || 0) - 1;
    }

    async getStepsFromStart() {
        const [startCoordinates] = this.getTileCoordinates('S');

        const path = await this.findPath(startCoordinates);

        if (!path) {
            throw new Error('Path not found');
        }

        return path.length - 1;
    }
}

async function part1(data: string[]): Promise<number> {
    return (new HeightMap(data)).getStepsFromStart();
}

async function part2(data: string[]): Promise<number> {
    return (new HeightMap(data)).getShortestPathLength();
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(await (new HeightMap(testData)).getStepsFromStart(), 31);

    console.log('Part 1', await part1(data));

    strictEqual(await (new HeightMap(testData)).getShortestPathLength(), 29);

    console.log('Part 2', await part2(data));
}

main();
