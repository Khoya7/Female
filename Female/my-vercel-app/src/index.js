document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.createElement('h1');
    greetingElement.textContent = 'Welcome to My Vercel App!';
    document.body.appendChild(greetingElement);

    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Click Me';
    document.body.appendChild(buttonElement);

    buttonElement.addEventListener('click', () => {
        alert('Button was clicked!');
    });
});