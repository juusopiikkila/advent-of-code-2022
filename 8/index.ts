import { strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

function getRow(grid: number[][], x: number, y: number, reverse = true): [number[], number[]] {
    return [
        reverse ? grid[y].slice(0, x) : grid[y].slice(0, x).reverse(),
        reverse ? grid[y].slice(x + 1).reverse() : grid[y].slice(x + 1),
    ];
}

function getColumn(grid: number[][], x: number, y: number, reverse = true): [number[], number[]] {
    const column: number[] = [];

    for (const row of grid) {
        column.push(row[x]);
    }

    return [
        reverse ? column.slice(0, y) : column.slice(0, y).reverse(),
        reverse ? column.slice(y + 1).reverse() : column.slice(y + 1),
    ];
}

function getVisibleTreeCount(data: string[]): number {
    const grid = data.map((row) => [...row].map(Number));
    let count = (grid.length * 2) + ((grid[0].length - 2) * 2);

    for (let y = 1; y < grid.length - 1; y += 1) {
        for (let x = 1; x < grid[0].length - 1; x += 1) {
            const height = grid[y][x];
            const column = getColumn(grid, x, y);
            const row = getRow(grid, x, y);

            const isColumnVisible = column.some((chunk) => chunk.every((tree) => tree < height));
            const isRowVisible = row.some((chunk) => chunk.every((tree) => tree < height));

            if (isColumnVisible || isRowVisible) {
                count += 1;
            }
        }
    }

    return count;
}

function getHighestScenicScore(data: string[]): number {
    const grid = data.map((row) => [...row].map(Number));
    let highestScore = 0;

    for (let y = 1; y < grid.length - 1; y += 1) {
        for (let x = 1; x < grid[0].length - 1; x += 1) {
            const height = grid[y][x];
            const column = getColumn(grid, x, y, false);
            const row = getRow(grid, x, y, false);

            const columnTrees = column.map((chunk) => {
                const index = chunk.findIndex((tree) => tree >= height);

                return index === -1 ? chunk : chunk.slice(0, index + 1);
            });

            const rowTrees = row.map((chunk) => {
                const index = chunk.findIndex((tree) => tree >= height);

                return index === -1 ? chunk : chunk.slice(0, index + 1);
            });

            const score = [
                ...columnTrees.map((chunk) => chunk.length),
                ...rowTrees.map((chunk) => chunk.length),
            ].reduce((total, count) => total * count);

            if (score > highestScore) {
                highestScore = score;
            }
        }
    }

    return highestScore;
}

function part1(data: string[]): number {
    return getVisibleTreeCount(data);
}

function part2(data: string[]): number {
    return getHighestScenicScore(data);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(getVisibleTreeCount(testData), 21);

    console.log('Part 1', part1(data));

    strictEqual(getHighestScenicScore(testData), 8);

    console.log('Part 2', part2(data));
}

main();
