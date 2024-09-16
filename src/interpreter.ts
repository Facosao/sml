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

// enum Teste {
//    A = (10, "A")
// }

// const Teste = {
//     A: [10, "A"]
// }

function validNumber(numStr: string | null): number | null {
    const value = Number(numStr);
    if (Number.isNaN(value) || ((value < -9999) || (value > 9999))) {
        return null;
    } else {
        return value;
    }
}

export class State {
    accumulator: number = 0;
    programCounter: number = 0;
    memory: Array<number> = [];

    constructor() {}

    // constructor(memory: Array<number>) {
    //     this.accumulator = 0;
    //     this.programCounter = 0;
    //     this.memory = memory;
    // }
}

export class Interpreter {
    states: Array<State> = [];
    currentState: number | null = null;
    debugMode: boolean = true;

    constructor() {
        this.states = [];
        this.currentState = null;
        this.debugMode = true;
    }

    loadSource(srcString: string) {
        const lines = srcString.replace("\r", "").split("\n");
        const firstState = new State();
        
        for (const line of lines) {
            const value = validNumber(line);
            if (value) {
                firstState.memory.push(value);
            } else {
                alert("Erro na linha " + lines.indexOf(line) + ": instrução inválida!");
                return;
            }
        }

        this.states.push(firstState);
        this.currentState = 0;
        alert("Arquivo carregado com sucesso!");
    }

    start(isDebug: boolean) {
        this.debugMode = isDebug;
        this.run();
    }
    
    run() {
        if (this.currentState === null) return;

        const next = this.nextState(this.states[this.currentState]);
        if (next === null) {
            alert("A execução terminou!");
            const lastState = this.states[this.currentState];
            for (let i = 0; i < lastState.memory.length; i++) {
                console.log(lastState.memory[i] + " ");
                if ((i > 0) && ((i % 10) === 0)) {
                    console.log("\n");
                }
            }            
            return;
        }

        this.states.push(next);
        this.currentState += 1;

        if (!this.debugMode) {
            requestAnimationFrame(() => {this.run()}); // JS???
        }
    }

    nextState(current: State): State | null {
        const next: State = JSON.parse(JSON.stringify(current));

        const instruction: number = (current.memory[current.programCounter] / 100) | 0;
        const operand: number = (current.memory[current.programCounter] % 100) | 0;

        next.programCounter += 1;

        switch (instruction) {
            case Instruction.READ: {
                let input = prompt("Digite um número: ");
                const value = validNumber(input);
                while (value === null) {
                    input = prompt("Número inválido. Digite outro número.");
                }
                
                next.memory[operand] = value;
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
                return null;
            }

            default:
                console.log("Unexpected instruction: ", instruction);
        }

        return next;
    }
}