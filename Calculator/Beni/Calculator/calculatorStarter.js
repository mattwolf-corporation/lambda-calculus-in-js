import {
    calc, result, Minus, Add, Pow, Multi, Div,
    jsnum,  n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, cAdd, cMulti, cMinus
} from "./calculator.js";

// import {ifels, end} from "../LambdaCalculus/lambda.js";

let functionalOp = "calc";
let lambdaOp = "jsnum( calc";
let display = "";


const displayOutput = document.getElementById("displayOutput");
const functionalOutput = document.getElementById("functionalOutput");
const lambdaOutput = document.getElementById("lambdaOutput");

const operate = value => lambda => {
    if (lambda === "result") {
        solve();
    } else if (lambda === "clr") {
        clr();
    } else {
        functionalOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
        lambdaOp += (isNaN(value)) ? `(c${lambda})` : `(${lambda})`;
        display += value;
        displayOutput.value = display;
        functionalOutput.innerText = functionalOp;
        lambdaOutput.innerText = lambdaOp;
    }
};

// (lambda === "result") ? solve() :
//     (lambda === "clr") ? clr() :
//         () => {
//             display += value;
//             document.getElementById("display").value = display;
//
//             functionalOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
//             document.getElementById("functionalOutput").innerText = functionalOp;
//         };

// ifels(lambda === "result")(solve())
//     (ifels(lambda === "clr")(clr())(
//             () => {
//                 functionalOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
//                 display += value;
//                 document.getElementById("display").value = display;
//                 document.getElementById("functionalOutput").innerText = functionalOp;
//             }
//         ));


const solve = () => {
    const evalResult = eval(functionalOp + `(result)`);

    displayOutput.value = evalResult;
    functionalOutput.innerText = functionalOp + " ===> " + evalResult;
    functionalOp = "calc";
    display = "";


    const evalLambdaResult = eval(lambdaOp + `(result) )`);
    lambdaOutput.innerText = lambdaOp + " ) ===> " + evalLambdaResult;
    lambdaOp = "jsnum( calc";
};

const clr = () => {
    displayOutput.value = "cleared";
    display = "";

    functionalOutput.innerText = "";
    functionalOp = "calc";

    lambdaOutput.innerText = "";
    lambdaOp = "jsnum( calc";
};

const operatorInputs = document.querySelectorAll("[lambda]");
operatorInputs.forEach(e => e.onclick = _ => operate(e.value)(e.getAttribute("lambda")));