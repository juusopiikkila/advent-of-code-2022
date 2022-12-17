import { readFile } from 'fs/promises';
import { js as EasyStar } from 'easystarjs';

export interface Coord {
    x: number
    y: number
}

export interface PathOptions {
    acceptableTiles: number[]
    tileCosts?: Record<string, number>
    enableDiagonals?: boolean
}

export async function readFileToArray(path: string): Promise<string[]> {
    const data = await readFile(path);
    return data.toString().split('\n').slice(0, -1);
}

export async function getInput(day: string): Promise<string[]> {
    return readFileToArray(`${day}/input.txt`);
}

export async function getExampleInput(day: string, number?: number): Promise<string[]> {
    return readFileToArray(`${day}/example${number || ''}.txt`);
}

export function generateMap<T = string | number>(
    width: number,
    height: number,
    fill: T,
): T[][] {
    return Array
        .from<T[]>({ length: height })
        .map(() => Array.from<T>({ length: width }).fill(fill));
}

export async function findPath(map: number[][], from: Coord, to: Coord, options: PathOptions): Promise<Coord[]> {
    return new Promise((resolve) => {
        const easystar = new EasyStar();

        easystar.setGrid(map);
        easystar.setAcceptableTiles(options.acceptableTiles);

        if (options.enableDiagonals) {
            easystar.enableDiagonals();
        }

        if (options.tileCosts) {
            Object.entries(options.tileCosts).forEach(([tile, cost]) => {
                easystar.setTileCost(Number(tile), cost);
            });
        }

        easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
            resolve(path);
        });

        easystar.calculate();
    });
}

export function getManhattanDistance(a: [number, number], b: [number, number]): number {
    let distance = 0;

    for (let index = 0; index < 2; index += 1) {
        distance += Math.abs((b[index] || 0) - (a[index] || 0));
    }

    return distance;
}
