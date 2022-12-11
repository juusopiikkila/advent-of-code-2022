import { deepEqual, strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

class Register {
    value = 1;

    set(value: number) {
        this.value = value;
    }

    get(): number {
        return this.value;
    }
}

interface Command {
    run(): Generator<boolean>
}

class NoopCommand implements Command {
    * run() {
        yield true;
    }
}

class AddCommand implements Command {
    constructor(
        readonly value: number,
        readonly register: Register,
    ) {
        //
    }

    * run() {
        yield true;

        yield true;

        const value = this.register.get();

        this.register.set(value + this.value);
    }
}

class CPU {
    instructions: Command[] = [];

    register = new Register();

    constructor(data: string[]) {
        this.parseData(data);
    }

    private parseData(data: string[]) {
        for (const row of data) {
            const [command, value] = row.split(' ');

            if (command === 'noop') {
                this.instructions.push(new NoopCommand());
            } else if (command === 'addx') {
                this.instructions.push(new AddCommand(
                    Number(value),
                    this.register,
                ));
            }
        }
    }

    * getRegisterValues(): Generator<number> {
        let cycle = 1;

        while (cycle <= 240) {
            for (const command of this.instructions) {
                // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
                for (const foo of command.run()) {
                    cycle += 1;
                    yield this.register.get();
                }
            }
        }
    }

    getSignalStrength() {
        const strengths: number[] = [];
        let cycle = 1;

        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        for (const value of this.getRegisterValues()) {
            if (cycle > 240) {
                break;
            }

            if (cycle === 20 || (cycle - 20) % 40 === 0) {
                strengths.push(cycle * this.register.get());
            }

            cycle += 1;
        }

        return strengths.reduce((total, strength) => total + strength, 0);
    }
}

class Monitor {
    cpu: CPU;

    constructor(data: string[]) {
        this.cpu = new CPU(data);
    }

    getImage(): string[] {
        const data: string[][] = [
            [],
            [],
            [],
            [],
            [],
            [],
        ];

        let cycle = 1;
        for (const value of this.cpu.getRegisterValues()) {
            if (cycle > 240) {
                break;
            }

            const spriteFrom = value;
            const spriteTo = value + 2;
            const row = data[Math.ceil(cycle / 40) - 1];
            const index = row.length + 1;

            row.push(index >= spriteFrom && index <= spriteTo ? '#' : '.');

            cycle += 1;
        }

        return data.map((row) => row.join(''));
    }
}

function part1(data: string[]): number {
    return new CPU(data).getSignalStrength();
}

function part2(data: string[]): void {
    (new Monitor(data).getImage()).forEach((row) => {
        console.log(row);
    });
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);
    const testData2 = await getExampleInput(__dirname, 2);

    strictEqual((new CPU(testData)).getSignalStrength(), -41440);
    strictEqual((new CPU(testData2)).getSignalStrength(), 13140);

    console.log('Part 1', part1(data));

    deepEqual((new Monitor(testData2)).getImage(), [
        '##..##..##..##..##..##..##..##..##..##..',
        '###...###...###...###...###...###...###.',
        '####....####....####....####....####....',
        '#####.....#####.....#####.....#####.....',
        '######......######......######......####',
        '#######.......#######.......#######.....',
    ]);

    console.log('Part 2');
    part2(data);
}

main();
