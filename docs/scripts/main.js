import { Interpreter } from "./interpreter.js";
const interpreter = new Interpreter();
document.getElementById("btn-load")?.addEventListener("click", () => {
    const src = document
        .getElementById("source-file")?.value;
    interpreter.loadSource(src);
});
document.getElementById("btn-run")?.addEventListener("click", () => {
    interpreter.start(false);
});
