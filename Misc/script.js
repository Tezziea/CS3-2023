const yesButton = document.querySelector('#yes-btn');
const noButton = document.querySelector('#no-btn');
const overlay = document.querySelector('.overlay');

// Function to reset the website to its initial state
const reset = () => {
  overlay.style.opacity = 0;
};

yesButton.addEventListener('click', () => {
  alert('uy inaccept ang flowers, enjoy the special day gwen:)');
  reset
