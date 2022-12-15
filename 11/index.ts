import { strictEqual } from 'assert';
import { chunk } from 'lodash';
import BigNumber from 'bignumber.js';
import lcm from 'compute-lcm';
import { getExampleInput, getInput } from '../utils';

class Monkey {
    public inspections = 0;

    constructor(
        public number: number,
        public items: BigNumber[],
        public operation: 'multiply' | 'add',
        public operationNumber: number | undefined,
        public divider: number,
        public whenPassThrowTo: number,
        public whenFailThrowTo: number,
        private troop: Troop,
    ) {
        //
    }

    takeItem(item: BigNumber): void {
        this.items.push(item);
    }

    giveItemToMonkey(number: number, item: BigNumber): void {
        const monkey = this.troop.monkeys.find((m) => m.number === number);

        if (!monkey) {
            throw new Error('Monkey not found');
        }

        monkey.takeItem(item);
    }

    inspectItems() {
        for (const item of this.items) {
            let worryLevel: BigNumber;

            this.inspections += 1;

            if (this.operation === 'add') {
                worryLevel = this.operationNumber === undefined
                    ? item.plus(item)
                    : item.plus(this.operationNumber);
            } else {
                worryLevel = this.operationNumber === undefined
                    ? item.times(item)
                    : item.times(this.operationNumber);
            }

            if (!this.troop.isTotallyWorried) {
                worryLevel = worryLevel.dividedToIntegerBy(3);
            }

            worryLevel = worryLevel.modulo(this.troop.manageableLevel);

            if (worryLevel.modulo(this.divider).toNumber() === 0) {
                this.giveItemToMonkey(this.whenPassThrowTo, worryLevel);
            } else {
                this.giveItemToMonkey(this.whenFailThrowTo, worryLevel);
            }
        }

        this.items = [];
    }
}

class Troop {
    public monkeys: Monkey[] = [];

    public manageableLevel = 0;

    constructor(
        data: string[],
        public isTotallyWorried = false,
    ) {
        this.parseData(data);
    }

    private parseData(data: string[]) {
        const groups = chunk(data, 7)
            .map((group) => group.slice(0, 6));

        this.monkeys = groups.map((group) => {
            const number = Number(group[0].match(/^Monkey ([0-9]+):$/)?.[1]);

            const items = group[1].split(':')[1]
                .split(',')
                .map((item) => BigNumber(item.trim()));

            const operationData = [...group[2].trim().matchAll(/^Operation: new = old (.*) ([0-9]+|old)$/g)];

            const operation = operationData[0][1] === '*' ? 'multiply' : 'add';
            const operationNumber = operationData[0][2] === 'old' ? undefined : Number(operationData[0][2]);

            const divider = Number(group[3].split(' by ')[1]);
            const whenPassThrowTo = Number(group[4].split(' monkey ')[1]);
            const whenFailThrowTo = Number(group[5].split(' monkey ')[1]);

            return new Monkey(
                number,
                items,
                operation,
                operationNumber,
                divider,
                whenPassThrowTo,
                whenFailThrowTo,
                this,
            );
        });

        this.manageableLevel = lcm(this.monkeys.map((monkey) => monkey.divider)) || 1;
    }

    getInspectedItemCount(rounds = 20): number {
        for (let i = 0; i < rounds; i += 1) {
            for (const monkey of this.monkeys) {
                monkey.inspectItems();
            }
        }

        const inspections = this.monkeys
            .map((monkey) => monkey.inspections)
            .sort((a, b) => b - a)
            .slice(0, 2)
            .reduce((accumulator, count) => accumulator * count);

        return inspections;
    }
}

function part1(data: string[]): number {
    return (new Troop(data)).getInspectedItemCount();
}

function part2(data: string[]): number {
    return (new Troop(data, true)).getInspectedItemCount(10000);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual((new Troop(testData)).getInspectedItemCount(), 10605);

    console.log('Part 1', part1(data));

    strictEqual((new Troop(testData, true)).getInspectedItemCount(10000), 2713310158);

    console.log('Part 2', part2(data));
}

main();
