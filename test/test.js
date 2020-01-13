import {jsnum} from "../src/lambda-calculus-library/church-numerals.js";
import {convertToJsBool} from "../src/lambda-calculus-library/lambda-calculus.js";

export {TestSuite}

const Assert = () => {
    let counter = 1;
    const ok = [];
    const equals = (actual, expected) => {
        const result = (actual === expected);
        addTest(actual, expected, result);
    };

    const churchNumberEquals = (actual, expected) => {
        const result = (jsnum(actual) === jsnum(expected));
        addTest(actual, expected, result);
    };

    const churchBooleanEquals = (actual, expected) => {
        const result = (convertToJsBool(actual) === convertToJsBool(expected));
        addTest(actual, expected, result);
    };

    const addTest = (actual, expected, result) => {
        ok.push({actual, expected, result, counter});
        counter++;
    };

    const arrayEquals = (actual, expected) => {
        if (actual.length === expected.length) {
            let counter = 0;
            let result = true;

            while (result && counter < actual.length) {
                result = actual[counter] === expected[counter];
                counter++;
            }

            addTest(actual, expected, result);
        } else {
            addTest(actual, expected, false);
        }
    };


    return {
        getOk: () => ok,
        equals: equals,
        churchNumberEquals: churchNumberEquals,
        churchBooleanEquals: churchBooleanEquals,
        arrayEquals: arrayEquals,
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
        add: add,
        report: report
    }
};

let totalTests = 0;
const renderReport = (name, tests) => {

    let outputHtml = "";

    let totalPassed = 0;
    let totalFailed = 0;

    tests.forEach(test => {
        const {origin, asserts} = test;

        totalTests += asserts.length;

        const failed = asserts.filter(testResult => !testResult.result);
        const passed = asserts.length - failed.length;

        totalPassed += passed;
        totalFailed += failed.length;

        let failMessage = "";
        let passedLine = ` <span>${passed} / ${asserts.length}   </span>`;

        failed.forEach(failedTest => {
            const {actual, expected, result, counter} = failedTest;
            failMessage += `<pre ><span class="dot red"></span> <b>Test Nr. ${counter}  failed!</b> <br>    Actual:   <b>${actual}</b> <br>    Expected: <b>${expected} </b></pre>`;
        });

        outputHtml += `
            <tr>
                <td> 
                    <span class="dot ${passed === asserts.length ? 'green' : 'red'}"></span>${origin} 
                </td>
                <td>  
                    ${passedLine} 
                </td>
            </tr>    
        `;

        if (failed.length > 0){
            outputHtml += `
            <tr>
                <td> 
                   <div class="failMessage">${failMessage} </div> 
                </td>
            </tr>    
        `;
        }
    });


    document.getElementById("totalTests").innerText = totalTests;

    const output = document.getElementById("output");
    output.insertAdjacentHTML("beforeend",
        `<fieldset style="border-color: ${totalFailed > 0 ? 'red' : 'green'}">
                    <legend>${name}</legend>
                        <table style="width: fit-content"> 
                            <tr>
                                <th>Function</th>
                                <th>Passed</th>
                            </tr>
                            
                            ${outputHtml}
                     
                        </table>
                     <h4>Total passed: ${totalPassed}   failed: ${totalFailed} </h4>
                </fieldset>`
    );
};
