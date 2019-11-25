import {
    calc, result, Minus, Add, Pow, Multi, Div,
    jsnum,  n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, cAdd, cMulti, cMinus
} from "./calculator.js";

// import {jsnum, n0, n1, n2, n3, n4, n5, n6, succ, cAdd, cMulti} from "./calculator.js";

// import {ifels, end} from "../LambdaCalculus/lambda.js";

let inputOp = "calc";
let lambdaOp = "jsnum( calc";
let display = "";

const operate = value => lambda => {
    if (lambda === "result") {
        solve();
    } else if (lambda === "clr") {
        clr();
    } else {
        inputOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
        lambdaOp += (isNaN(value)) ? `(c${lambda})` : `(${lambda})`;
        display += value;
        document.getElementById("display").value = display;
        document.getElementById("functionalOutput").innerText = inputOp;
        document.getElementById("lambdaOutput").innerText = lambdaOp;

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


    const evalLambdaResult = eval(lambdaOp + `(result) )`);
    document.getElementById("lambdaOutput").innerText = lambdaOp + " ===> " + evalLambdaResult;
    lambdaOp = "jsnum( calc";
};

const clr = () => {
    document.getElementById("display").value = "cleared";
    document.getElementById("functionalOutput").innerText = "";
    inputOp = "calc";
    display = "";

    document.getElementById("lambdaOutput").innerText = "";
    lambdaOp = "jsnum( calc";
};

const operatorInputs = document.querySelectorAll("[lambda]");
operatorInputs.forEach(e => e.onclick = _ => operate(e.value)(e.getAttribute("lambda")));