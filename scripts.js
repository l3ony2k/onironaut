document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.film-card');

    function setCanvasSize() {
        const canvasWidth = window.innerWidth; // Canvas width equals the browser's width
        const canvasHeight = canvasWidth * 1.4; // Canvas height is 1.4 times the width

        // Set the size of the container to match the canvas
        const filmContainer = document.querySelector('.film-container');
        filmContainer.style.width = `${canvasWidth}px`; // Width = viewport width
        filmContainer.style.height = `${canvasHeight}px`; // Height = 1.4 times the width
        filmContainer.style.position = 'relative'; // Relative positioning for drift area
        filmContainer.style.overflow = 'hidden'; // Prevent any overflow
        filmContainer.style.padding = '0'; // No padding in the container
        filmContainer.style.margin = '0'; // No margin in the container
    }

    // Call it once to set the initial canvas size
    setCanvasSize();

    // Function to move each card at a constant, slow speed
    function drift(card) {
        let xPos = Math.random() * (window.innerWidth - card.offsetWidth); // Ensure card starts within the width
        let yPos = Math.random() * ((window.innerWidth * 1.4) - card.offsetHeight); // Ensure card starts within the height
        let xMove = (Math.random() * 0.2 + 0.05); // Slow random speed for x-axis
        let yMove = (Math.random() * 0.2 + 0.05); // Slow random speed for y-axis

        let xDirection = Math.random() > 0.5 ? 1 : -1;
        let yDirection = Math.random() > 0.5 ? 1 : -1;

        card.style.position = 'absolute'; // Allow card to move freely within the container
        card.style.left = `${xPos}px`;
        card.style.top = `${yPos}px`;

        let isPaused = false; // Flag to control if the card should stop moving

        function animate() {
            if (!isPaused) {
                const canvasWidth = window.innerWidth; // Drift area width = browser width
                const canvasHeight = canvasWidth * 1.4; // Drift area height = 1.4 times the width

                xPos += xMove * xDirection;
                yPos += yMove * yDirection;

                if (xPos + card.offsetWidth > canvasWidth) {
                    xPos = canvasWidth - card.offsetWidth;
                    xDirection *= -1;
                }
                if (xPos < 0) {
                    xPos = 0;
                    xDirection *= -1;
                }
                if (yPos + card.offsetHeight > canvasHeight) {
                    yPos = canvasHeight - card.offsetHeight;
                    yDirection *= -1;
                }
                if (yPos < 0) {
                    yPos = 0;
                    yDirection *= -1;
                }

                card.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }
            requestAnimationFrame(animate);
        }

        // Start the animation for this card
        animate();

        // Event listeners to handle hover behavior
        card.addEventListener('mouseenter', () => {
            isPaused = true; // Pause movement on hover
            card.style.opacity = '1'; // Set opacity to 100%
        });

        card.addEventListener('mouseleave', () => {
            isPaused = false; // Resume movement when not hovered
            card.style.opacity = '0.4'; // Set opacity back to 40%
        });
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
