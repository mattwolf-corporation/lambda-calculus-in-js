import {pair, snd} from "../src/lambda-calculus-library/lambda-calculus.js";

export {test}


const Assert = () => {
    let counter = 1;
    const ok = [];
    const equals = (actual, expected) => {

        const result = (actual === expected);
        if (!result) {
            console.error(`not equal! actual was '${actual}' but expected '${expected}'`);
        }

        ok.push({actual, expected, result, counter});
        counter++;
    };
    return {
        getOk: () => ok,
        equals: equals
    }
};

const test = (origin, callback) => {
    const assert = Assert();          //    das ok anlegen
    callback(assert);                 //    das ok befüllen
    report(origin, assert.getOk());   //    report mit name und ok aufrufen
};


function report(origin, ok) {

    const output = document.getElementById("output");

    const failed = ok.filter(testResult => !testResult.result);
    const passed = ok.length - failed.length;

    let resultLine = `<p> ${passed} Test's passed of ${ok.length}`;
    failed.forEach(failedTest => {
        const {actual, expected, result, counter} = failedTest;
        resultLine += `<li><p>Test Nr. ${counter} failed: not equal! actual was ${actual} but expected ${expected}</p></li>`;
    });

    output.insertAdjacentHTML("beforeend",
        `
        <h3> ${origin} </h3>
        <ul>
            ${resultLine}
        </ul>
    `);
    // ok.forEach(e => {
    //     const {actual, expected, result} = e;
    //     // TODO : anzeige Total "passed" und "failed" anstelle, jedes einzeln Zeigen. Wenn "failed" zeige "actual & expected" und Testnummer

    //     testList += `<p> <span class="dot ${result ? "green" : "red"}"></span> ${actual} ${expected} </p>`;
    // });
    // output.insertAdjacentHTML("beforeend",
    //     `
    //     <h3> ${origin} </h3>
    //     <ul>
    //         ${testList}
    //     </ul>
    // `);
}
