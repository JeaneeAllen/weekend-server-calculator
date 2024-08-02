console.log('client.js is sourced!');

document.addEventListener('DOMContentLoaded', () => { // event listener that executes code when DOM is fully loaded 
    const form = document.querySelector('[data-testid="calculator"]');
    const numOneInput = document.querySelector('[data-testid="numOne"]');
    const numTwoInput = document.querySelector('[data-testid="numTwo"]');
    const clearButton = document.querySelector('[id="clear"]');
    const equalButton = document.querySelector('[id="equal"]');
    const recentResult = document.querySelector('[data-testid="recentResult"]');
    const resultHistory = document.querySelector('[data-testid="resultHistory"]');

    let operator = '+'; // default operator for calc.

    function makeCalculation() { // function to handle calc
        axios.get('/calculations') // sends a GET req to /calculations
            .then(response => { // response/results from server
                const calculations = response.data;

                let historyHTML = '';  // will be used to build up a string of HTML representing a list of calculations
                for (const calc of calculations) {
                    historyHTML += `<li>${calc.numOne} ${calc.operator} ${calc.numTwo} = ${calc.result}</li>`;
                }

                resultHistory.innerHTML = historyHTML; //updates with results from server calcs.

                if (calculations.length > 0) { //checks if there are any calculations to display.
                    const mostRecentResult = calculations[calculations.length - 1].result;
                    recentResult.innerHTML = `<h2>${mostRecentResult}</h2>`;
                } else {
                    recentResult.innerHTML = '<h2>0</h2>';
                }
            })
            .catch(error => {
                console.error('Error fetching calculations:', error);
            });
    }

    function handleCalculation() {  // handles calcs from user inputs
        const numOne = numOneInput.value;
        const numTwo = numTwoInput.value;

        axios.post('/calculate', { numOne, numTwo, operator })
            .then(response => {
                makeCalculation();
                numOneInput.value = '';
                numTwoInput.value = '';
            })
            .catch(error => {
                console.error('Error performing calculation:', error);
            });
    }

    // operator based on button clicks
    document.querySelector('[id="add"]').addEventListener('click', () => operator = '+');
    document.querySelector('[id="substract"]').addEventListener('click', () => operator = '-');
    document.querySelector('[id="multiply"]').addEventListener('click', () => operator = '*');
    document.querySelector('[id="divide"]').addEventListener('click', () => operator = '/');

    equalButton.addEventListener('click', handleCalculation);

    clearButton.addEventListener('click', () => {
        numOneInput.value = '';
        numTwoInput.value = '';
        recentResult.innerHTML = '<h2>0</h2>';
        resultHistory.innerHTML = '';
    });

    // load of calculations
    makeCalculation();
});
