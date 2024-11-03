let display = document.getElementById('display');
let buttons = Array.from(document.getElementsByClassName('btn'));
let lastWasEqual = false; // Track if the last action was an equals operation

// Function to handle button clicks
const handleButtonClick = (value) => {
    switch (value) {
        case 'Clear':
            display.innerText = '';
            lastWasEqual = false; // Reset the flag
            break;
        case '=':
            evaluateExpression();
            break;
        case 'Del':
            if (display.innerText) {
                display.innerText = display.innerText.slice(0, -1);
            }
            lastWasEqual = false; // Reset the flag on delete
            break;
        default:
            if (lastWasEqual) {
                if (isOperator(value)) {
                    // Append the operator to the result if it's an operator
                    display.innerText += value;
                } else {
                    // Replace the result if it's a number
                    display.innerText = value;
                }
                lastWasEqual = false; // Reset the flag after using the new input
            } else {
                display.innerText += value; // Append input
            }
            break;
    }
};

// Helper function to check if a value is an operator
const isOperator = (value) => {
    return ['+', '-', '*', '/'].includes(value);
};

// Function to evaluate the expression
const evaluateExpression = () => {
    try {
        // Replace √ with Math.sqrt( and π with Math.PI
        let input = display.innerText
            .replace(/√/g, 'Math.sqrt(') // Replace √ with Math.sqrt(
            .replace(/π/g, 'Math.PI');    // Replace π with Math.PI

        // Add closing parentheses for any unclosed square root expressions
        let openParens = (input.match(/\(/g) || []).length;
        let closeParens = (input.match(/\)/g) || []).length;

        if (openParens > closeParens) {
            input += ')'.repeat(openParens - closeParens); // Add closing parentheses if needed
        }

        // Evaluate the transformed expression
        display.innerText = eval(input);
        lastWasEqual = true; // Set the flag to true after evaluation
    } catch (error) {
        display.innerText = "Error";
        lastWasEqual = false; // Reset the flag on error
    }
};

// Add event listeners for button clicks
buttons.map((b) => {
    b.addEventListener('click', (e) => {
        handleButtonClick(e.target.innerText);
    });
});

// Add event listener for keyboard input
document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key) || ['+', '-', '*', '/', '(', ')'].includes(e.key)) {
        handleButtonClick(e.key);
    } else if (e.key === 'Backspace') {
        handleButtonClick('Del'); // Call the delete action
    } else if (e.key === 'Enter') {
        // Directly call evaluateExpression for Enter key to ensure transformations are applied
        evaluateExpression();
    } else if (e.key === 'c' || e.key === 'C') {
        handleButtonClick('Clear'); // Call the clear action
    } else if (e.key === 'p' || e.key === 'P') {
        handleButtonClick('π'); // Allow input of π with 'p'
    } else if (e.key === 's' || e.key === 'S') {
        handleButtonClick('√'); // Allow input of √ with 's'
    }
});
