// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // In a real application, you would filter the cards here
    });
});

// Simple Animation on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .feature-box');

    elements.forEach(element => {
        const position = element.getBoundingClientRect();

        // If element is in viewport
        if (position.top < window.innerHeight - 100) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
document.querySelectorAll('.card, .feature-box').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Trigger once on load
window.addEventListener('load', animateOnScroll);



// Video Section


const btn = document.getElementById("watch-btn");
const popup = document.getElementById("videoPopup");
const player = document.getElementById("ytPlayer");

btn.addEventListener("click", () => {
    // show popup
    popup.style.display = "flex";

    // autoplay video (add autoplay=1 in src)
    let src = player.src;
    if (!src.includes("autoplay=1")) {
        player.src = src + "?autoplay=1";
    }
});

// agar ESC press kare to video band ho jaye
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        popup.style.display = "none";
        // autoplay band karne ke liye src reset
        player.src = player.src.replace("?autoplay=1", "");
    }
});


// ----------



const closeBtn = document.getElementById("closeBtn");

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    // autoplay band karne ke liye reset
    player.src = player.src.replace("&autoplay=1", "");
});


popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
        player.src = player.src.replace("&autoplay=1", "");
    }
});
