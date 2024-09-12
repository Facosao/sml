enum Instruction {
    // I/O
    READ = 10,
    WRITE = 11,
    LOAD = 20,
    STORE = 21,
    
    // Algebra
    ADD = 30,
    SUBTRACT = 31,
    DIVIDE = 32,
    MULTIPLY = 33,
    MODULE = 34,

    // Control flow
    BRANCH = 40,
    BRANCHNEG = 41,
    BRANCHZERO = 42,
    HALT = 43
}

class State {
    accumulator: number = 0;
    programCounter: number = 0;
    memory: Array<number> = [];

    constructor(memory: Array<number>) {
        this.accumulator = 0;
        this.programCounter = 0;
        this.memory = memory;
    }
}

class Interpreter {
    states: Array<State> = [];
    currentState: number | null = null;

    constructor() {

    }

    run(initialState: State) {

    }

    nextState(current: State): State {
        const next: State = JSON.parse(JSON.stringify(current));

        const instruction: number = current.memory[current.programCounter] & 0xFF00;
        const operand: number = current.memory[current.programCounter] & 0x00FF;

        next.programCounter += 1;

        switch (instruction) {
            case Instruction.READ: {
                let input: number = Number(prompt("Digite um número: "));
                while (Number.isNaN(input) && (input >= -9999) && (input <= 9999)) {
                    input = Number(prompt("Número inválido. Digite outro número."));
                    break;
                }
                
                next.memory[operand] = input;
                break;
            }
                
            case Instruction.WRITE: {
                console.log("> " + next.memory[operand]);
                break;
            }

            case Instruction.LOAD: {
                next.accumulator = next.memory[operand];
                break;
            }

            case Instruction.STORE: {
                next.memory[operand] = next.accumulator;
                break;
            }

            case Instruction.ADD: {
                next.accumulator += next.memory[operand];
                break;
            }

            case Instruction.SUBTRACT: {
                next.accumulator -= next.memory[operand];
                break;
            }

            case Instruction.MULTIPLY: {
                next.accumulator *= next.memory[operand];
                break;
            }

            case Instruction.DIVIDE: {
                next.accumulator /= next.memory[operand];
                next.accumulator |= 0;
                break;
            }

            case Instruction.MODULE: {
                next.accumulator %= next.memory[operand];
                break;
            }

            case Instruction.BRANCH: {
                next.programCounter = next.memory[operand];
                break;
            }

            case Instruction.BRANCHNEG: {
                if (next.memory[operand] < 0) {
                    next.programCounter = next.memory[operand];
                }
                break;
            }
            case Instruction.BRANCHZERO: {
                if (next.memory[operand] === 0) {
                    next.programCounter = next.memory[operand];
                }
                break;
            }
            case Instruction.HALT: {
                console.log("Program halted.");
                break;
            }

            default:
                console.log("Unexpected instruction");
        }

        return next;
    }

}