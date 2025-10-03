
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
        const cardContainer = document.getElementById("cardContainer");
        document.getElementById("nextBtn1").addEventListener("click", () => {
            cardContainer.scrollBy({ left: 300, behavior: "smooth" });
        });
        document.getElementById("prevBtn1").addEventListener("click", () => {
            cardContainer.scrollBy({ left: -300, behavior: "smooth" });
        });
        const slider = document.getElementById("slider");
        const cards = document.querySelectorAll("#slider .card");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        let currentIndex = 1;

        function updateSlider() {
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add("scale-110", "z-10");
                } else {
                    card.classList.remove("scale-110", "z-10");
                }
            });
            const cardWidth = cards[0].offsetWidth + 16;
            const offset = slider.offsetWidth / 2 - (currentIndex * cardWidth + cardWidth / 2);
            slider.style.transform = `translateX(${offset}px)`;
        }
        nextBtn.addEventListener("click", () => { if (currentIndex < cards.length - 1) { currentIndex++; updateSlider(); } });
        prevBtn.addEventListener("click", () => { if (currentIndex > 0) { currentIndex--; updateSlider(); } });
        window.addEventListener("resize", updateSlider);
        updateSlider();
    