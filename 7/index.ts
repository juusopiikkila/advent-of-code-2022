import { strictEqual } from 'assert';
import { getExampleInput, getInput } from '../utils';

interface File {
    path: string
    name: string
    size: number
}

interface Directory {
    path: string
    size: number
}

function getFiles(data: string[]): File[] {
    const files: File[] = [];
    const currentPath: string[] = [];

    for (const row of data) {
        if (row[0] === '$') {
            const [, command, argument] = row.split(' ');

            if (command === 'cd') {
                if (argument === '..') {
                    currentPath.pop();
                } else {
                    currentPath.push(argument);
                }
            }
        } else {
            const args = row.split(' ');

            if (args[0] !== 'dir') {
                const path = `${currentPath.join('/').slice(1)}/`;

                files.push({
                    path,
                    name: args[1],
                    size: Number(args[0]),
                });
            }
        }
    }

    return files;
}

function getDirectories(files: File[]): Directory[] {
    return files
        .reduce<string[]>((directories, file) => {
            const parts = file.path.split('/');

            for (let i = 0; i < parts.length; i += 1) {
                const path = parts.slice(0, i).join('/');

                if (!directories.includes(path)) {
                    directories.push(path);
                }
            }

            return directories;
        }, [])
        .map<Directory>((path) => ({
            path,
            size: files
                .filter((item) => item.path.indexOf(path) === 0)
                .reduce((accumulator, item) => accumulator + item.size, 0),
        }));
}

function getSize(data: string[]): number {
    const files = getFiles(data);

    return getDirectories(files)
        .filter((directory) => directory.size <= 100000)
        .reduce((accumulator, directory) => accumulator + directory.size, 0);
}

function getSizeOfDeletedDirectory(data: string[]): number {
    const files = getFiles(data);
    const directories = getDirectories(files);
    const rootDirectory = directories.find((directory) => directory.path === '');

    if (!rootDirectory) {
        throw new Error('Root dir not found');
    }

    const usedSpace = 70000000 - rootDirectory.size;
    const neededSpace = 30000000 - usedSpace;

    const candidates = directories
        .filter((directory) => directory.size >= neededSpace)
        .sort((a, b) => a.size - b.size);

    if (candidates.length === 0) {
        throw new Error('No candidates');
    }

    return candidates[0].size;
}

function part1(data: string[]): number {
    return getSize(data);
}

function part2(data: string[]): number {
    return getSizeOfDeletedDirectory(data);
}

async function main() {
    const data = await getInput(__dirname);
    const testData = await getExampleInput(__dirname);

    strictEqual(getSize(testData), 95437);

    console.log('Part 1', part1(data));

    strictEqual(getSizeOfDeletedDirectory(testData), 24933642);

    console.log('Part 2', part2(data));
}

main();
