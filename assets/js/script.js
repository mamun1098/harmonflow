
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.menu-wrapper');

    let mm = gsap.matchMedia();

    mm.add("(max-width: 991px)", () => {
        const staggerItems = document.querySelectorAll('.nav-menu .nav-link, .nav-actions-mobile');
        const menuTimeline = gsap.timeline({ paused: true });

        menuTimeline.to(navMenu, {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.8,
            ease: "power4.inOut"
        })
            .fromTo(staggerItems,
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: "power4.out" },
                "-=0.4"
            );

        const toggleMenu = () => {
            const spans = menuToggle.querySelectorAll('span');
            menuToggle.classList.toggle('open');

            if (menuToggle.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
                menuTimeline.play();
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                document.body.style.overflow = '';
                menuTimeline.reverse();
                spans.forEach(s => s.style.transform = 'none');
                spans[1].style.opacity = '1';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        return () => {
            // Cleanup
            menuToggle.removeEventListener('click', toggleMenu);
            gsap.set([navMenu, staggerItems], { clearProps: "all" });
            document.body.style.overflow = '';
        };
    });


    /* STICKY HEADER */
    let lastScrollTop = 0;
    const header = document.querySelector(".header-area");
    const threshold = 50; // pixels to scroll before sticking

    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let width = window.innerWidth;

        // Add background/shadow if scrolled past threshold
        if (scrollTop > threshold) {
            header.classList.add("header-fixed");
        } else {
            header.classList.remove("header-fixed");
        }

        // Hide/Show logic for both mobile and desktop (optional, keeping current mobile preference)
        if (width <= 991) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.top = "-110px"; // Hide header when scrolling down
            } else {
                header.style.top = "0"; // Show header when scrolling up
            }
        } else {
            // Ensure desktop top is reset if resized
            header.style.top = "0";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
    /* STICKY HEADER END */


    /* HERO SLIDER START */
    gsap.registerPlugin(Draggable);

    let xPos = 0;
    let ring = document.querySelector("#ring");
    let dragger = document.querySelector("#dragger");
    let items = document.querySelectorAll(".slider-img");

    if (!ring || !dragger || items.length === 0) return;

    // Calculate angle based on actual number of images
    let count = items.length;
    let angle = 360 / count;

    gsap.timeline()
        .set(dragger, { opacity: 0 })
        .set(ring, { rotationY: 180 })
        .set('.slider-img', {
            rotateY: (i) => i * -angle,
            transformOrigin: `50% 50% 550px`, // You can also make this dynamic if needed
            z: -550,
            backfaceVisibility: 'hidden'
        })

    Draggable.create(dragger, {
        onDragStart: (e) => {
            if (e.touches) e.clientX = e.touches[0].clientX;
            xPos = Math.round(e.clientX);
        },
        onDrag: (e) => {
            if (e.touches) e.clientX = e.touches[0].clientX;
            // Adjust rotation sensitivity based on item count if needed
            gsap.to(ring, {
                rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360)
            });
            xPos = Math.round(e.clientX);
        },
        onDragEnd: () => {
            gsap.set(dragger, { x: 0, y: 0 })
        }
    })
    /* HERO SLIDER END */


    /* SMOOTH SCROLLER START (GSAP) START */
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);

    // --- GSAP & ScrollSmoother ---
    gsap.registerPlugin(ScrollSmoother);

    const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        speed: 0.6,
        smoothTouch: 0.1,
        normalizeScroll: false, // Performance fix: Disable to prevent scroll jitter
        ignoreMobileResize: true,
    });

    // --- Performance Optimization ---
    ScrollTrigger.config({ limitCallbacks: true });
    /* SMOOTH SCROLLER START (GSAP) END */


    /* BUTTON SPLIT LETTERS ANIMATION START */

    // 1. Reusable text-split function
    function splitTextToChars(element) {
        if (!element) return [];
        // Use textContent instead of innerText to get raw HTML text, 
        // avoiding CSS text-transform forcing it to uppercase!
        const text = element.textContent.trim();
        element.innerHTML = "";

        let chars = [];
        for (let i = 0; i < text.length; i++) {
            let span = document.createElement("span");
            span.className = "char";
            span.style.willChange = "transform, opacity";
            span.style.display = "inline-block";
            // Prevent text-transform: capitalize on parent from making EVERY letter uppercase!
            span.style.textTransform = "none";

            // Preserve layout for spaces
            if (text[i] === " ") {
                span.innerHTML = "&nbsp;";
                span.style.width = "4px"; // typical space width
            } else {
                span.innerText = text[i];
            }

            element.appendChild(span);
            chars.push(span);
        }
        return chars;
    }
    // 2. Animate all [letters-hover] buttons
    document.querySelectorAll("[letters-hover]").forEach((button) => {

        const normalText = button.querySelector(".link-text");
        const hoverText = button.querySelector(".link-text-hover");

        // Split text only when JS loads, fulfilling the requirement!
        const normalChars = splitTextToChars(normalText);
        const hoverChars = splitTextToChars(hoverText);

        // Initial state 
        gsap.set(hoverChars, { yPercent: 100, opacity: 0 });
        gsap.set(normalChars, { yPercent: 0, opacity: 1 });

        const tl = gsap.timeline({ paused: true });

        // Wave out default text
        tl.to(normalChars, {
            yPercent: -100,
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: {
                each: 0.02,
                from: "start"
            }
        }, 0);

        // Wave in hover text
        tl.to(hoverChars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: {
                each: 0.02,
                from: "start"
            }
        }, 0); // start at same time as normal chars

        // Play and reverse nicely
        button.addEventListener("mouseenter", () => tl.play());
        button.addEventListener("mouseleave", () => tl.reverse());

    });

    /* BUTTON SPLIT LETTERS ANIMATION  END */

    /* REUSABLE FADE UP ANIMATION START */
    function animateFadeUp(selector) {
        gsap.utils.toArray(selector).forEach((el) => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // Apply to accordion items
    // animateFadeUp('.accordion-item');
    /* REUSABLE FADE UP ANIMATION END */

    /* TESTIMONI SWIPER START */
    const swiper = new Swiper(".testimoni-swiper", {
        grabCursor: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        speed: 800,
        loop: false,
        effect: "creative",
        creativeEffect: {

            prev: {
                shadow: true,
                translate: ["-120%", 0, -500],
            },
            next: {
                translate: ["100%", 0, 0],
            },
        },
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });
    /* TESTIMONI SWIPER END */

    /* PARTNERS MARQUEE START */
    const heroAutoPlaySlider = document.querySelector('.hero-logo-swiper');
    if (heroAutoPlaySlider) {
        const marqueeSpeed = heroAutoPlaySlider.dataset.speed ? parseInt(heroAutoPlaySlider.dataset.speed) : 10000;

        new Swiper(".hero-logo-swiper", {
            autoplay: {
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
            },
            slidesPerView: 9,
            speed: marqueeSpeed,
            spaceBetween: 24,
            loop: true,
            allowTouchMove: false,
            resistanceRatio: 0,
            // Added to keep transitions linear for marquee effect
            easing: 'linear',
            cssMode: false,
            // freeMode: true,
            freeModeMomentum: false,
            breakpoints: {
                0: {
                    slidesPerView: 2,
                },
                576: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 5,
                },
                1024: {
                    slidesPerView: 7,
                },
                1360: {
                    slidesPerView: 8,
                },
                1440: {
                    slidesPerView: 9,
                },
            }
        });
    }
    /* PARTNERS MARQUEE END */


    /* START HOW IT WORK CARD ANIMATION */

    mm.add("(min-width: 992px)", function () {
        const stackWrapper = document.querySelector(".stack-wrapper");
        const cards = gsap.utils.toArray(".wrapper-box");

        if (!stackWrapper || cards.length <= 1) return;

        // Dynamic gap calculation
        const baseGap = 80; // Starting gap
        const increment = 6; // Gap increases by 6px for each card

        // Calculate cumulative gap for each card
        const getCumulativeGap = (index) => {
            let total = 0;
            for (let i = 1; i <= index; i++) {
                total += baseGap + ((i - 1) * increment);
            }
            return total;
        };

        // Initial setup: All cards start at full scale
        cards.forEach((card, i) => {
            gsap.set(card, {
                zIndex: i + 1,
                y: i === 0 ? 0 : "100vh",
                scale: 1 // All start at full scale
            });
        });

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".how-it-work",
                start: "top+=200 top",
                end: () => `+=${cards.length * 400}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // Animate cards sliding up
        cards.forEach((card, i) => {
            if (i === 0) return;

            // Animate the current card coming in with progressive gap
            tl.to(card, {
                y: getCumulativeGap(i),
                scale: 1,
                duration: 1,
                ease: "none"
            }, i - 1);

            // Animate all previous cards (cards below) to scale down
            for (let j = 0; j < i; j++) {
                tl.to(cards[j], {
                    scale: 1 - ((i - j) * 0.05), // Each card below reduces by 5%
                    duration: 1,
                    ease: "none"
                }, i - 1); // Same timing as the card coming in
            }
        });
    });

    /* END HOW IT WORK CARD ANIMATION */


    /* START SMOOTH SCROLL & ACTIVE NAV */
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    const navLinks = document.querySelectorAll(".nav-menu .nav-link");

    // 1. Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (id && id.startsWith("#")) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();

                    // Close mobile menu if it's open
                    if (menuToggle && menuToggle.classList.contains('open')) {
                        menuToggle.click();
                    }

                    // Scrolled position calculation
                    smoother.scrollTo(target, {
                        duration: 1.2,
                        offsetY: 80 // Adjust based on sticky header height
                    });
                }
            }
        });
    });

    // 2. ScrollSpy: Update active class on scroll
    const updateActiveNav = () => {
        navLinks.forEach(link => {
            const id = link.getAttribute("href");
            if (id && id.startsWith("#")) {
                const section = document.querySelector(id);
                if (section) {
                    ScrollTrigger.create({
                        trigger: section,
                        start: "top 40%", // Trigger when section top hits 40% of viewport
                        end: "bottom 40%",
                        onToggle: (self) => {
                            if (self.isActive) {
                                navLinks.forEach(l => l.classList.remove("active"));
                                link.classList.add("active");
                            }
                        }
                    });
                }
            }
        });
    };

    updateActiveNav();

    // Refresh ScrollTrigger to account for dynamic heights/animations
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    /* END SMOOTH SCROLL & ACTIVE NAV */


});
