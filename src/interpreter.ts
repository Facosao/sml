import { Display } from "./display.js";

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

    constructor() {
        for (let i = 0; i < 100; i++) {
            this.memory.push(0);
        }
    }
}

export class Interpreter {
    states: Array<State>;
    currentState: number | null;
    debugMode: boolean;
    display: Display;

    constructor() {
        this.states = [];
        this.currentState = null;
        this.debugMode = true;
        this.display = new Display();
    }

    loadSource(srcString: string) {
        const lines = srcString.replace("\r", "").split("\n");
        const firstState = new State();
        
        for (let i = 0; i < lines.length; i++) {
            const value = validNumber(lines[i]);
            if (value !== null) {
                firstState.memory[i] = value;
            } else {
                alert("Erro na linha " + i + 1 + ": instrução inválida!");
                return;
            }
        }

        this.states.push(firstState);
        this.currentState = 0;

        this.display.memoryTable(this.states[this.currentState]);
        this.display.instructions(this);

        //alert("Arquivo carregado com sucesso!");
    }

    start(isDebug: boolean) {
        this.debugMode = isDebug;
        this.run();
    }
    
    run() {
        if (this.currentState === null) return;

        const next = this.nextState(this.states[this.currentState]);
        if (next === null) {
            //alert("A execução terminou!");
            const lastState = this.states[this.currentState];
            // for (let i = 0; i < lastState.memory.length; i++) {
            //     console.log(lastState.memory[i] + " ");
            //     if ((i > 0) && ((i % 10) === 0)) {
            //         console.log("\n");
            //     }
            // }            
            return;
        }

        this.states.push(next);
        this.currentState += 1;

        this.display.memoryTable(this.states[this.currentState]);

        if (!this.debugMode) {
            requestAnimationFrame(() => {this.run()}); // JS???
        }
    }

    private nextState(current: State): State | null {
        const next: State = JSON.parse(JSON.stringify(current));

        console.log("PC: " + current.programCounter + " ACC: " + current.accumulator + " INST: " + current.memory[current.programCounter]);

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
                // #TODO: Check for overflow!
                break;
            }

            case Instruction.SUBTRACT: {
                next.accumulator -= next.memory[operand];
                // #TODO: Check for overflow!
                break;
            }

            case Instruction.MULTIPLY: {
                next.accumulator *= next.memory[operand];
                // #TODO: Check for overflow!
                break;
            }

            case Instruction.DIVIDE: {
                next.accumulator /= next.memory[operand];
                next.accumulator |= 0;
                // #TODO: Check for overflow!
                break;
            }

            case Instruction.MODULE: {
                next.accumulator %= next.memory[operand];
                // #TODO: Check for overflow!
                break;
            }

            case Instruction.BRANCH: {
                next.programCounter = operand;
                break;
            }

            case Instruction.BRANCHNEG: {
                if (next.accumulator < 0) {
                    next.programCounter = operand;
                }
                break;
            }
            case Instruction.BRANCHZERO: {
                if (next.accumulator === 0) {
                    next.programCounter = operand;
                }
                break;
            }
            case Instruction.HALT: {
                console.log("Program halted.");
                return null;
            }

            default:
                // console.log("Unexpected instruction: ", instruction);
                throw new Error("Unexpected instruction: " + instruction + ", Address: " + current.programCounter);
        }

        return next;
    }
}