import {pair, snd} from "../src/lambda-calculus-library/lambda-calculus.js";

export {TestSuite}


const Assert = () => {
    let counter = 1;
    const ok = [];
    const equals = (actual, expected) => {
        const result = (actual === expected);
        ok.push({actual, expected, result, counter});
        counter++;
    };
    return {
        getOk: () => ok,
        equals: equals
    }
};

const TestSuite = name => {
    const tests = [];
    const add = (origin, callback) => {
        const assert = Assert();          //    das ok anlegen
        callback(assert);
        tests.push({
            origin,
            asserts: [...assert.getOk()]
        });
    };

    const report = () => {
        renderReport(name, tests);
    };

    return {
        report: report,
        getName: () => name,
        getTests: () => tests,
        add: add
    }

};


function renderReport(name, tests) {
    let outputHtml = "";

    tests.forEach(test => {
        const {origin, asserts} = test;

        const failed = asserts.filter(testResult => !testResult.result);
        const passed = asserts.length - failed.length;
        let resultLine = "";
        let passedLine = ` <span> - Passed: ${passed} / ${asserts.length} <span class="dot green"></span> </span>`;

        failed.forEach(failedTest => {
            const {actual, expected, result, counter} = failedTest;
            resultLine += `<p><span class="dot red"></span>Test Nr. ${counter} failed: not equal! actual was ${actual} but expected ${expected}</p>`;
        });

        outputHtml += `
            <h6> ${origin} ${passedLine} </h6>
            <div class="testContainer">
                ${resultLine}
            </div>
        `;
    });

    const output = document.getElementById("output");
    output.insertAdjacentHTML("beforeend",
        `<fieldset>
                <legend>${name}</legend>
                     ${outputHtml}
                </fieldset>`
    );

}
