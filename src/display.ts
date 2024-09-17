import { Interpreter, State } from "interpreter.js";

const INSTRUCTIONS: Map<number, string> = new Map([
    [10, "READ"],
    [11, "WRITE"],
    [20, "LOAD"],
    [21, "STORE"],
    [30, "ADD"],
    [31, "SUBTRACT"],
    [32, "DIVIDE"],
    [33, "MULTIPLY"],
    [34, "MODULE"],
    [40, "BRANCH"],
    [41, "BRANCHNEG"],
    [42, "BRANCHZERO"],
    [43, "HALT"]
]);

export class Display {
    memory: Array<HTMLTableCellElement>;
    instructionContainer: HTMLDivElement;

    constructor() {
        this.memory = [];
        this.instructionContainer = <HTMLDivElement>document.getElementById("instruction-output");
        
        const element = document.getElementById("memory-table");
        if (element === null) {
            console.log("Failed to capture memory table!");
            return;
        }

        for (const td of document.getElementsByTagName("td")) {
            if (td.innerText.length === 5) {
                this.memory.push(td);
            }
        }
    }

    private static numToStr(n: number): string {
        let resultStr = Math.abs(n).toString();

        resultStr = resultStr.padStart(4, "0");

        if (n < 0) {
            resultStr = "-" + resultStr;
        } else {
            resultStr = "+" + resultStr;
        }

        return resultStr;
    }

    public memoryTable(s: State) {
        if (this.memory.length !== s.memory.length) {
            console.log("Differing lengths!!!");
            console.log(this.memory.length, s.memory.length);
            return;
        }

        for (let i = 0; i < 100; i++) {
            this.memory[i].innerText = Display.numToStr(s.memory[i]);
        }
    }

    public instructions(i: Interpreter) {
        // Remove all children nodes?
        console.log("Successfully called instructions()");

        if (i.currentState === null) return;
        console.log("Current state !== null");

        const curState = i.states[i.currentState];
        for (const value of curState.memory) {
            // if (value === 0) continue;
            const line = (curState.memory.indexOf(value)).toString();
            const address = ((value % 100) | 0).toString();
            const wordNumber = (value / 100) | 0;
            const word = INSTRUCTIONS.get(wordNumber);
            if (word === undefined) continue;

            const instDiv = Display.newInstruction(line, word, address, "");
            this.instructionContainer.append(instDiv);            
        }
        console.log("Finished appending nodes!")
    }

    private static newInstruction(line: string, word: string, address: string, hint: string): HTMLDivElement {
        const inst = document.createElement("div");
        inst.classList.add("instruction");
        
        const instLine = document.createElement("div");
        instLine.classList.add("instruction-number");
        instLine.innerText = line;

        const instWord = document.createElement("div");
        instWord.classList.add("instruction-word");
        instWord.innerText = word;

        const instAddress = document.createElement("div");
        instAddress.classList.add("instruction-address");
        instAddress.innerText = address.padStart(2, "0");

        const instHint = document.createElement("div");
        instHint.classList.add("instruction-hint");

        inst.append(instLine, instWord, instAddress, instHint);

        return inst;
    }
}