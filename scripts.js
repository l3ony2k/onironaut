document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.film-card');

    function setCanvasSize() {
        const canvasWidth = window.innerWidth;
        const canvasHeight = canvasWidth * 2;

        // Set the size of the container
        const filmContainer = document.querySelector('.film-container');
        filmContainer.style.width = `${canvasWidth}px`;
        filmContainer.style.height = `${canvasHeight}px`;
        filmContainer.style.position = 'relative'; // Ensure container is positioned
        filmContainer.style.overflow = 'hidden'; // Ensure no overflow from the container
    }

    // Call it once to set initial size
    setCanvasSize();

    // Function to move each card
    function drift(card) {
        let xPos = Math.random() * window.innerWidth;
        let yPos = Math.random() * window.innerHeight;
        let xMove = (Math.random() * 0.5 + 0.1); // Slow speed for x-axis
        let yMove = (Math.random() * 0.5 + 0.1); // Slow speed for y-axis

        // Randomize initial direction (left/right, up/down)
        let xDirection = Math.random() > 0.5 ? 1 : -1;
        let yDirection = Math.random() > 0.5 ? 1 : -1;

        card.style.position = 'absolute'; // Allow card to move freely within the container
        card.style.left = `${xPos}px`;
        card.style.top = `${yPos}px`;

        function animate() {
            const canvasWidth = window.innerWidth;
            const canvasHeight = canvasWidth * 2;

            // Update positions based on direction
            xPos += xMove * xDirection;
            yPos += yMove * yDirection;

            // Bounce back if the card hits the right/left edge
            if (xPos + card.offsetWidth >= canvasWidth || xPos <= 0) {
                xDirection *= -1; // Reverse the horizontal direction
            }

            // Bounce back if the card hits the top/bottom edge
            if (yPos + card.offsetHeight >= canvasHeight || yPos <= 0) {
                yDirection *= -1; // Reverse the vertical direction
            }

            // Apply the new positions to the card
            card.style.transform = `translate(${xPos}px, ${yPos}px)`;

            // Request the next animation frame
            requestAnimationFrame(animate);
        }

        // Start the animation for this card
        animate();
    }

    // Apply the drift effect to each card
    cards.forEach(card => drift(card));

    // Handle window resizing to adjust canvas dimensions dynamically
    window.addEventListener('resize', setCanvasSize);
});
// Prevent text selection
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});