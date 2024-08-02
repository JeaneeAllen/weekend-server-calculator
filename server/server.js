const express = require('express');
const app = express();
let PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static('server/public'));

// Global variable that will contain all of the
// calculation objects:
let calculations = []


// Here's a wonderful place to make some routes:

// GET /calculations - route to get calc
app.get('/calculations', (req, res) => {
  res.json(calculations);
});

// POST /calculations - route to perform & store cal.

app.post('/calculations', (req, res) => {
  const { numOne, numTwo, operator } = req.body;

  if (numOne === undefined || numTwo === undefined || operator === undefined) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const numOneFloat = parseFloat(numOne);
  const numTwoFloat = parseFloat(numTwo);

  if (isNaN(numOneFloat) || isNaN(numTwoFloat)) {
    return res.status(400).json({ error: 'Invalid numbers' });
  }

  let result;

  // Performs the calculation based on the operator
  switch (operator) {
    case '+':
      result = numOneFloat + numTwoFloat;
      break;
    case '-':
      result = numOneFloat - numTwoFloat;
      break;
    case '*':
      result = numOneFloat * numTwoFloat;
      break;
    case '/':
      if (numTwoFloat === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = numOneFloat / numTwoFloat;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operator' });
  }

  // Create a calculation object
  const calculation = {
    numOne: numOneFloat,
    numTwo: numTwoFloat,
    operator,
    result
  };

  // Add the calculation to the history
  calculations.push(calculation);

  // Send the calculation result back to the client
  res.status(201).json(calculation);
});

// PLEASE DO NOT MODIFY ANY CODE BELOW THESE BEARS:
// 🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸  🐻  🐻‍❄️  🧸

// Makes it so you don't have to kill the server
// on 5000 in order to run the tests:
if (process.env.NODE_ENV === 'test') {
  PORT = 5002;
}

// This starts the server...but also stores it in a variable.
// This is weird. We have to do it for testing reasons. There
// is absolutely no need for you to reason about this.
const server = app.listen(PORT, () => {
  console.log('server running on: ', PORT);
});

// server.setTimeout(500)

// This is more weird "for testing reasons" code. There is
// absolutely no need for you to reason about this.
app.closeServer = () => {
  server.close();
}

app.setCalculations = (calculationsToSet) => {
  calculations = calculationsToSet;
}

module.exports = app;
