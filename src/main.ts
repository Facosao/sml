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

document.getElementById("btn-debug")?.addEventListener("click", () => {
    interpreter.start(true);
});

document.getElementById("btn-previous")?.addEventListener("click", () => {

});

document.getElementById("btn-next")?.addEventListener("click", () => {
    interpreter.run();
});