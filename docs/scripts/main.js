"use strict";
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
class State {
    accumulator = 0;
    programCounter = 0;
    memory = [];
    constructor(memory) {
        this.accumulator = 0;
        this.programCounter = 0;
        this.memory = memory;
    }
}
class Interpreter {
    states = [];
    currentState = null;
    constructor() {
    }
    run(initialState) {
    }
    nextState(current) {
        const next = JSON.parse(JSON.stringify(current));
        const instruction = current.memory[current.programCounter] & 0xFF00;
        const operand = current.memory[current.programCounter] & 0x00FF;
        next.programCounter += 1;
        switch (instruction) {
            case Instruction.READ: {
                let input = Number(prompt("Digite um número: "));
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
