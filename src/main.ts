import { Interpreter } from "./interpreter.js";

const interpreter = new Interpreter();

document.getElementById("btn-load")?.addEventListener("click", () => {
    const src: string = (<HTMLTextAreaElement>document
        .getElementById("source-file"))?.value;

    // interpreter.internalReset();
    interpreter.loadSource(src);    
});

document.getElementById("btn-run")?.addEventListener("click", () => {
    interpreter.start(false);
});