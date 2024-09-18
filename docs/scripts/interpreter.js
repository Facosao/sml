import { Display } from "./display.js";
var Instruction;
(function (Instruction) {
    // I/O
    Instruction[Instruction["READ"] = 10] = "READ";
    Instruction[Instruction["WRITE"] = 11] = "WRITE";
    Instruction[Instruction["LOAD"] = 20] = "LOAD";
    Instruction[Instruction["STORE"] = 21] = "STORE";
    // Algebra
    Instruction[Instruction["ADD"] = 30] = "ADD";
    Instruction[Instruction["SUBTRACT"] = 31] = "SUBTRACT";
    Instruction[Instruction["DIVIDE"] = 32] = "DIVIDE";
    Instruction[Instruction["MULTIPLY"] = 33] = "MULTIPLY";
    Instruction[Instruction["MODULE"] = 34] = "MODULE";
    // Control flow
    Instruction[Instruction["BRANCH"] = 40] = "BRANCH";
    Instruction[Instruction["BRANCHNEG"] = 41] = "BRANCHNEG";
    Instruction[Instruction["BRANCHZERO"] = 42] = "BRANCHZERO";
    Instruction[Instruction["HALT"] = 43] = "HALT";
})(Instruction || (Instruction = {}));
function validNumber(numStr) {
    const value = Number(numStr);
    if (Number.isNaN(value) || ((value < -9999) || (value > 9999))) {
        return null;
    }
    else {
        return value;
    }
}
export class State {
    accumulator = 0;
    programCounter = 0;
    memory = [];
    constructor() {
        for (let i = 0; i < 100; i++) {
            this.memory.push(0);
        }
    }
}
export class Interpreter {
    states;
    currentState;
    debugMode;
    display;
    constructor() {
        this.states = [];
        this.currentState = null;
        this.debugMode = true;
        this.display = new Display();
    }
    loadSource(srcString) {
        const lines = srcString.replace("\r", "").split("\n");
        const firstState = new State();
        for (let i = 0; i < lines.length; i++) {
            const value = validNumber(lines[i]);
            if (value !== null) {
                firstState.memory[i] = value;
            }
            else {
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
    start(isDebug) {
        this.debugMode = isDebug;
        this.run();
    }
    run() {
        if (this.currentState === null)
            return;
        const next = this.nextState(this.states[this.currentState]);
        if (next === null) {
            //alert("A execução terminou!");
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
        this.display.memoryTable(this.states[this.currentState]);
        if (!this.debugMode) {
            requestAnimationFrame(() => { this.run(); }); // JS???
        }
    }
    nextState(current) {
        const next = JSON.parse(JSON.stringify(current));
        const instruction = (current.memory[current.programCounter] / 100) | 0;
        const operand = (current.memory[current.programCounter] % 100) | 0;
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
