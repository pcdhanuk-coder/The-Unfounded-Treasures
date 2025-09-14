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



// ---------Dynamic Rendering--------


document.addEventListener('DOMContentLoaded', () => {
  const placesGrid = document.getElementById('placesGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-box input');
  let placesData = [];
  let activeCategory = 'All';
  let searchTerm = '';

  // fetch the "API"
  fetch('./places.json')
    .then(res => res.json())
    .then(data => {
      placesData = data;
      renderPlaces(placesData);
      setupFilters();
    })
    .catch(err => {
      console.error('places.json fetch error:', err);
      placesGrid.innerHTML = '<p>Could not load places data.</p>';
    });

  function renderPlaces(data) {
    placesGrid.innerHTML = '';
    if (!data || data.length === 0) {
      placesGrid.innerHTML = '<p>No places found.</p>';
      return;
    }

    data.forEach(place => {
      // Create card element
      const card = document.createElement('div');
      card.className = 'card';

      // create content - wrap in anchor so whole card is clickable
      const link = document.createElement('a');
      link.href = `place.html?id=${encodeURIComponent(place.id)}`;
      link.style = 'text-decoration: none; color: inherit; display: block;';

      const cardImg = document.createElement('div');
      cardImg.className = 'card-img';
      const img = document.createElement('img');
      img.src = place.images && place.images[0] ? place.images[0] : '';
      img.alt = place.title;
      img.loading = 'lazy';
      cardImg.appendChild(img);

      const badge = document.createElement('div');
      badge.className = 'card-badge';
      badge.textContent = place.badge || place.category || '';
      cardImg.appendChild(badge);

      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';
      const h3 = document.createElement('h3');
      h3.textContent = place.title;
      const p = document.createElement('p');
      p.textContent = place.short;
      cardContent.appendChild(h3);
      cardContent.appendChild(p);

      const cardMeta = document.createElement('div');
      cardMeta.className = 'card-meta';
      const ratingDiv = document.createElement('div');
      ratingDiv.className = 'rating';
      ratingDiv.innerHTML = renderStars(place.rating || 0);
      cardMeta.appendChild(ratingDiv);
      cardContent.appendChild(cardMeta);

      link.appendChild(cardImg);
      link.appendChild(cardContent);
      card.appendChild(link);

      // wishlist button
      const wishBtn = document.createElement('button');
      wishBtn.className = 'wish-btn';
      wishBtn.innerHTML = '♡';
      wishBtn.setAttribute('data-id', place.id);
      updateWishButton(wishBtn);
      wishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(place.id);
        updateWishButton(wishBtn);
      });

      card.appendChild(wishBtn);

      placesGrid.appendChild(card);
    });
  }

  function renderStars(rating) {
    // return up to 5 stars (rounded to nearest 0.5)
    let out = '';
    const full = Math.floor(rating);
    const half = (rating - full) >= 0.5;
    for (let i = 0; i < full; i++) out += '<i class="fas fa-star"></i>';
    if (half) out += '<i class="fas fa-star-half-alt"></i>';
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) out += '<i class="far fa-star"></i>';
    return out;
  }

  // -- Filters / Search --
  function setupFilters() {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.textContent.trim();
        runFilterSearch();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.trim().toLowerCase();
        runFilterSearch();
      });
    }
  }

  function runFilterSearch() {
    let filtered = placesData.slice();

    if (activeCategory && activeCategory.toLowerCase() !== 'all') {
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        (p.title || '').toLowerCase().includes(searchTerm) ||
        (p.short || '').toLowerCase().includes(searchTerm)
      );
    }

    renderPlaces(filtered);
  }

  // -- Wishlist (localStorage) --
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('avaloria_wishlist') || '[]');
    } catch {
      return [];
    }
  }
  function setWishlist(arr) {
    localStorage.setItem('avaloria_wishlist', JSON.stringify(arr));
  }
  function toggleWishlist(id) {
    const list = getWishlist();
    const idx = list.indexOf(id);
    if (idx === -1) {
      list.push(id);
    } else {
      list.splice(idx, 1);
    }
    setWishlist(list);
  }
  function updateWishButton(btn) {
    const id = btn.getAttribute('data-id');
    const list = getWishlist();
    if (list.indexOf(id) !== -1) {
      btn.classList.add('wished');
      btn.innerHTML = '❤️';
    } else {
      btn.classList.remove('wished');
      btn.innerHTML = '♡';
    }
  }
});



// Lightbox functionality
function initLightbox(images) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const close = document.querySelector(".lightbox .close");
  const prev = document.querySelector(".lightbox .prev");
  const next = document.querySelector(".lightbox .next");

  let currentIndex = 0;

  // Show image in lightbox
  function showImage(index) {
    currentIndex = index;
    lightbox.style.display = "block";
    lightboxImg.src = images[index];
  }

  // Event listeners for thumbnails
  document.querySelectorAll(".gallery-img").forEach((img, i) => {
    img.addEventListener("click", () => showImage(i));
  });

  // Close
  close.onclick = () => (lightbox.style.display = "none");

  // Prev/Next
  prev.onclick = () => showImage((currentIndex - 1 + images.length) % images.length);
  next.onclick = () => showImage((currentIndex + 1) % images.length);

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "block") {
      if (e.key === "ArrowLeft") prev.onclick();
      if (e.key === "ArrowRight") next.onclick();
      if (e.key === "Escape") close.onclick();
    }
  });
}
