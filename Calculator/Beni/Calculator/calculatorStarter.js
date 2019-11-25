import {calc, result, minus, add, pow, multi, div} from "./calculator.js";
import {jsnum, n0, n1, n2, n3, n4, n5, n6, succ, cAdd, cMult} from "./calculator.js";

// import {ifels, end} from "../LambdaCalculus/lambda.js";

let inputOp = "calc";
let display = "";

const operate = value => lambda => {
    if (lambda === "result") {
        solve();
    } else if (lambda === "clr") {
        clr();
    } else {
        inputOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
        display += value;
        document.getElementById("display").value = display;
        document.getElementById("functionalOutput").innerText = inputOp;
    }
};

// (lambda === "result") ? solve() :
//     (lambda === "clr") ? clr() :
//         () => {
//             display += value;
//             document.getElementById("display").value = display;
//
//             inputOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
//             document.getElementById("functionalOutput").innerText = inputOp;
//         };

// ifels(lambda === "result")(solve())
//     (ifels(lambda === "clr")(clr())(
//             () => {
//                 inputOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
//                 display += value;
//                 document.getElementById("display").value = display;
//                 document.getElementById("functionalOutput").innerText = inputOp;
//             }
//         ));


const solve = () => {
    const evalResult = eval(inputOp + `(result)`);

    document.getElementById("display").value = evalResult;
    document.getElementById("functionalOutput").innerText = inputOp + " ===> " + evalResult;

    inputOp = "calc";
    display = "";
};

const clr = () => {
    document.getElementById("display").value = "cleared";
    document.getElementById("functionalOutput").innerText = "";

    inputOp = "calc";
    display = "";
};

const operatorInputs = document.querySelectorAll("[lambda]");
operatorInputs.forEach(e => e.onclick = _ => operate(e.value)(e.getAttribute("lambda")));