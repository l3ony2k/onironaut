document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.film-card');
    let specialCards = []; // Array to store the 3 cards with fixed blur of 1.5px

    // Function to get 10 random unique indices
    function getRandomCardsIndices(count, max) {
        const indices = [];
        while (indices.length < count) {
            const randIndex = Math.floor(Math.random() * max);
            if (!indices.includes(randIndex)) {
                indices.push(randIndex);
            }
        }
        return indices;
    }

    // Hide all cards initially
    cards.forEach(card => card.style.display = 'none');

    // Get random indices of 20 cards to show
    const randomIndices = getRandomCardsIndices(20, cards.length);

    // Show only the 20 random cards
    randomIndices.forEach(index => {
        cards[index].style.display = 'block';
    });

    function setCanvasSize() {
        const canvasWidth = window.innerWidth; // Canvas width equals the browser's width
        const canvasHeight = canvasWidth * 1.3; // Set height to 130vw, proportional to width

        // Set the size of the container to match the canvas
        const filmContainer = document.querySelector('.film-container');
        filmContainer.style.width = '100vw'; // Width = 100% of the viewport width
        filmContainer.style.height = '130vw'; // Height = 130% of the viewport width
        filmContainer.style.position = 'relative'; // Relative positioning for drift area
        filmContainer.style.padding = '0'; // No padding in the container
        filmContainer.style.margin = '0'; // No margin in the container
        filmContainer.style.overflow = 'hidden'; // Prevent overflow
    }

    // Call it once to set the initial canvas size
    setCanvasSize();

    // Function to move each card at a constant, slow speed (drifting)
    function drift(card) {
        let xPos = Math.random() * (window.innerWidth - card.offsetWidth); // Ensure card starts within the width
        let yPos = Math.random() * (window.innerWidth * 1.3 - card.offsetHeight); // Ensure card starts within the height
        let xMove = (Math.random() * 0.2 + 0.05); // Slow random speed for x-axis
        let yMove = (Math.random() * 0.2 + 0.05); // Slow random speed for y-axis

        let xDirection = Math.random() > 0.5 ? 1 : -1;
        let yDirection = Math.random() > 0.5 ? 1 : -1;

        card.style.position = 'absolute'; // Allow card to move freely within the container
        card.style.left = `${xPos}px`;
        card.style.top = `${yPos}px`;

        // Apply a random blur between 0px and 5px to each card in the default state
        const randomBlur = Math.random() * 10;
        card.style.filter = `blur(${randomBlur}px)`;

        // Apply a random transparency between 10% (0.1) and 50% (0.5)
        const randomOpacity = Math.random() * (0.7 - 0.15) + 0.15;
        card.style.opacity = randomOpacity;

        // Add the "X" button to each card
        const closeButton = document.createElement('div');
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => deleteCard(card));
        card.appendChild(closeButton);

        let isPaused = false; // Flag to control if the card should stop moving

        function animate() {
            if (!isPaused) {
                const canvasWidth = window.innerWidth; // Drift area width = 100vw
                const canvasHeight = canvasWidth * 1.3; // Drift area height = 130vw

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

                card.style.left = `${xPos}px`;
                card.style.top = `${yPos}px`;
            }
            requestAnimationFrame(animate);
        }

        // Start the animation for this card
        animate();

        // Event listeners to handle hover behavior
        card.addEventListener('mouseenter', () => {
            isPaused = true; // Pause movement on hover
            card.style.filter = 'blur(0px)'; // Disable blur on hover
            card.style.opacity = '1'; // Full opacity on hover
            card.style.zIndex = '100'; // Bring the hovered card to the front
            closeButton.style.display = 'block'; // Show the "X" button
        });

        card.addEventListener('mouseleave', () => {
            isPaused = false; // Resume movement when not hovered
            card.style.filter = `blur(${randomBlur}px)`; // Reset to original random blur
            card.style.opacity = randomOpacity; // Reset to original random opacity
            card.style.zIndex = '1'; // Reset the z-index to default
            closeButton.style.display = 'none'; // Hide the "X" button
        });

        // Dragging functionality
        card.addEventListener('mousedown', startDragging);

        function startDragging(event) {
            isPaused = true; // Stop movement during dragging

            // Fix offset issue by calculating the exact position when mouse is pressed down
            const cardRect = card.getBoundingClientRect();
            let offsetX = event.clientX - cardRect.left;
            let offsetY = event.clientY - cardRect.top;

            function moveCard(e) {
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;

                // Ensure the card stays within bounds
                if (x < 0) x = 0;
                if (y < 0) y = 0;
                if (x + card.offsetWidth > window.innerWidth) x = window.innerWidth - card.offsetWidth;
                if (y + card.offsetHeight > window.innerWidth * 1.3) y = window.innerWidth * 1.3 - card.offsetHeight;

                card.style.left = `${x}px`;
                card.style.top = `${y}px`;
            }

            function stopDragging() {
                document.removeEventListener('mousemove', moveCard);
                document.removeEventListener('mouseup', stopDragging);
                isPaused = false; // Resume drifting after dragging
            }

            document.addEventListener('mousemove', moveCard);
            document.addEventListener('mouseup', stopDragging);
        }
    }

    // Function to delete a card with a fade-out and blur effect
    function deleteCard(card) {
        card.style.transition = 'opacity 1s ease, filter 1s ease'; // Smooth transition for opacity and blur
        card.style.opacity = '0'; // Fade out
        card.style.filter = 'blur(10px)'; // Increase blur
        setTimeout(() => card.remove(), 1000); // Remove the card after the transition
    }

    // Apply the drift effect and random blur to each of the visible random 10 cards
    randomIndices.forEach(index => {
        drift(cards[index]);
    });

    // Handle window resizing to adjust canvas dimensions dynamically
    window.addEventListener('resize', setCanvasSize);
});

// Prevent text selection
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

let isDragging = false;
let startX, startY, rect;

// floating title animation

document.addEventListener('DOMContentLoaded', () => {
    const floatingTitle = document.querySelector('.floating-title');

    function driftFloatingTitle() {
        // Initial position
        let xPos = Math.random() * (window.innerWidth - floatingTitle.offsetWidth);
        let yPos = Math.random() * (window.innerHeight * 0.3 - floatingTitle.offsetHeight); // Keep within top 30%
        
        // Random movement speed
        let xMove = (Math.random() * 0.2 + 0.05);
        let yMove = (Math.random() * 0.2 + 0.05);

        // Random direction for movement
        let xDirection = Math.random() > 0.5 ? 1 : -1;
        let yDirection = Math.random() > 0.5 ? 1 : -1;

        // Ensure the title is fully within the canvas initially
        floatingTitle.style.left = `${xPos}px`;
        floatingTitle.style.top = `${yPos}px`;

        function animate() {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight * 0.3; // Restrict to top 30%

            // Update position based on movement direction and speed
            xPos += xMove * xDirection;
            yPos += yMove * yDirection;

            // Check for boundaries and reverse direction if the title hits any edge
            if (xPos + floatingTitle.offsetWidth > canvasWidth) {
                xPos = canvasWidth - floatingTitle.offsetWidth;
                xDirection *= -1; // Reverse horizontal direction
            }
            if (xPos < 0) {
                xPos = 0;
                xDirection *= -1; // Reverse horizontal direction
            }
            if (yPos + floatingTitle.offsetHeight > canvasHeight) {
                yPos = canvasHeight - floatingTitle.offsetHeight;
                yDirection *= -1; // Reverse vertical direction
            }
            if (yPos < 0) {
                yPos = 0;
                yDirection *= -1; // Reverse vertical direction
            }

            // Set the new position
            floatingTitle.style.left = `${xPos}px`;
            floatingTitle.style.top = `${yPos}px`;

            // Request the next animation frame to continue the animation
            requestAnimationFrame(animate);
        }

        // Start the animation
        animate();
    }

    // Initialize drifting behavior for the floating title
    driftFloatingTitle();
});



// Function to generate random RGBA color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;  // 20% transparent
}

// Function to create a random gradient
function createRandomGradient() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `linear-gradient(45deg, ${color1}, ${color2})`;
}

document.body.addEventListener('mousedown', function (e) {
    isDragging = true;

    // Capture the starting position of the drag
    startX = e.pageX;
    startY = e.pageY;

    // Create the gradient rectangle
    rect = document.createElement('div');
    rect.classList.add('gradient-rect');

    // Set a random gradient as the background
    rect.style.background = createRandomGradient();

    // Initially place the rectangle at the starting position with zero width and height
    rect.style.left = `${startX}px`;
    rect.style.top = `${startY}px`;
    rect.style.width = `0px`;
    rect.style.height = `0px`;

    document.body.appendChild(rect);
});

document.body.addEventListener('mousemove', function (e) {
    if (isDragging && rect) {
        // Calculate the current width and height based on mouse movement
        const currentX = e.pageX;
        const currentY = e.pageY;

        // Update width and height of the rectangle based on drag area
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        // Adjust position if dragging in the opposite direction
        rect.style.width = `${width}px`;
        rect.style.height = `${height}px`;

        // Adjust position if dragging to the left or upwards
        rect.style.left = `${Math.min(currentX, startX)}px`;
        rect.style.top = `${Math.min(currentY, startY)}px`;
    }
});

document.body.addEventListener('mouseup', function () {
    if (isDragging) {
        // Trigger the fade and blur effect when the mouse is released
        rect.classList.add('fade');
        
        // Remove the rectangle after it has fully faded out, with some extra time for a smooth transition
        setTimeout(() => {
            if (rect && rect.parentElement) {
                rect.parentElement.removeChild(rect);
            }
        }, 50000);  // Wait slightly longer than the 5s fade-out time to avoid sudden cut-off
    }

    isDragging = false;
});

// info box
document.addEventListener('DOMContentLoaded', () => {
    const floatingTitle = document.querySelector('.floating-title');
    const infoBox = document.querySelector('.info-box');

    // Show the info box on hover
    floatingTitle.addEventListener('mouseenter', () => {
        infoBox.style.display = 'block';
        setTimeout(() => {
            infoBox.style.opacity = '1'; // Fade in
        }, 50); // Delay for smooth transition
    });

    // Hide the info box when not hovered
    floatingTitle.addEventListener('mouseleave', () => {
        infoBox.style.opacity = '0'; // Fade out
        setTimeout(() => {
            infoBox.style.display = 'none';
        }, 500); // Wait for the fade-out transition before hiding
    });
});

// music autoplay
document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    
    // Check if the user has interacted with the page before playing the music
    function playMusic() {
        if (music.paused) {
            music.play().catch(error => {
                console.log('Autoplay was prevented. User interaction required.');
            });
        }
    }

    // Attempt to play music on page load
    playMusic();

    // Optional: You can retry playing after a user interaction if autoplay is blocked
    document.body.addEventListener('click', () => {
        playMusic();
    });
});
