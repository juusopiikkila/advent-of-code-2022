import { strictEqual } from 'assert';
import { chunk, max } from 'lodash';
import { getInput } from '../utils';

interface Instruction {
    amount: number
    from: number
    to: number
}

class Crane {
    stacks: string[][] = [];

    instructions: Instruction[] = [];

    constructor(data: string[]) {
        this.parseData(data);
    }

    private parseData(data: string[]) {
        const state = data.slice(0, data.findIndex((row) => row.length === 0) - 1).map((row) => (
            chunk(row, 4).map((item) => item.join('').replace(/[^A-Z]/g, ''))
        ));

        const maxLength = state.reduce((length, row) => (
            row.length > length ? row.length : length
        ), 0);

        this.stacks = Array.from({ length: maxLength || 0 })
            .map((stack, index) => (
                state.map((row) => row[index] || '')
                    .filter((crate) => crate.length !== 0)
                    .reverse()
            ));

        this.instructions = data.slice(data.findIndex((row) => row.length === 0) + 1).map((row) => {
            const matches = row.match(/^move ([0-9]+) from ([0-9]+) to ([0-9]+)$/);

            if (!matches) {
                throw new Error('No matches');
            }

            return {
                amount: Number(matches[1]),
                from: Number(matches[2]) - 1,
                to: Number(matches[3]) - 1,
            };
        });
    }

    private runInstructions(oldModel = true) {
        for (const instruction of this.instructions) {
            if (oldModel) {
                for (let i = 0; i < instruction.amount; i += 1) {
                    const crate = this.stacks[instruction.from].pop();

                    if (!crate) {
                        throw new Error('No crate');
                    }

                    this.stacks[instruction.to].push(crate);
                }
            } else {
                const crates = this.stacks[instruction.from]
                    .splice(
                        this.stacks[instruction.from].length - instruction.amount,
                        instruction.amount,
                    );

                this.stacks[instruction.to] = [
                    ...this.stacks[instruction.to],
                    ...crates,
                ];
            }
        }
    }

    getTopCrates(oldModel = true): string {
        this.runInstructions(oldModel);

        return this.stacks.map((stack) => stack[stack.length - 1]).join('');
    }
}

function part1(data: string[]): string {
    return (new Crane(data)).getTopCrates();
}

function part2(data: string[]): string {
    return (new Crane(data)).getTopCrates(false);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = [
        '    [D]    ',
        '[N] [C]    ',
        '[Z] [M] [P]',
        ' 1   2   3 ',
        '',
        'move 1 from 2 to 1',
        'move 3 from 1 to 3',
        'move 2 from 2 to 1',
        'move 1 from 1 to 2',
    ];

    strictEqual((new Crane(testData)).getTopCrates(), 'CMZ');

    console.log('Part 1', part1(data));

    strictEqual((new Crane(testData)).getTopCrates(false), 'MCD');

    console.log('Part 2', part2(data));
}

main();
