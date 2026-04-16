
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.menu-wrapper');
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
            "-=0.4" // Start staggering before shutter completes
        );

    menuToggle.addEventListener('click', () => {
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
    });

    /* STICKY HEADER */
    let lastScrollTop = 0;
    const header = document.querySelector(".header-area");

    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let width = window.innerWidth;

        if (width > 768) {
            if (scrollTop > lastScrollTop) {
                header.classList.add("header-fixed");
            } else if (scrollTop <= 48) {
                header.classList.remove("header-fixed");
            }
        } else {
            if (scrollTop > lastScrollTop) {
                header.style.top = "-92px";
                header.classList.add("header-fixed");
            } else {
                header.style.top = "0";
                if (scrollTop <= 48) {
                    header.style.top = "0px";
                    header.classList.remove("header-fixed");
                }
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
    /* STICKY HEADER END */

    /* START CAMPAING CALENDER IMAGE ANIMATION */

    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);


    /* SMOOTH SCROLLER START (GSAP) START */
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
})  