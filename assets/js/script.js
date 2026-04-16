
document.addEventListener("DOMContentLoaded", function () {

    // const menuToggle = document.querySelector('#mobile-menu');
    // const navMenu = document.querySelector('.nav-menu');

    // menuToggle.addEventListener('click', () => {
    //     navMenu.classList.toggle('is-active');

    //     // Simple rotation for hamburger to X
    //     const spans = menuToggle.querySelectorAll('span');
    //     menuToggle.classList.toggle('open');

    //     if (menuToggle.classList.contains('open')) {
    //         spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    //         spans[1].style.opacity = '0';
    //         spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    //     } else {
    //         spans.forEach(s => s.style.transform = 'none');
    //         spans[1].style.opacity = '1';
    //     }
    // });

    /* STICKY HEADER */
    // let lastScrollTop = 0;
    // const header = document.querySelector(".lp-header");

    // window.addEventListener("scroll", () => {
    //     let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     let width = window.innerWidth;

    //     if (width > 768) {
    //         if (scrollTop > lastScrollTop) {
    //             header.classList.add("is-sticky");
    //         } else if (scrollTop <= 48) {
    //             header.classList.remove("is-sticky");
    //         }
    //     } else {
    //         if (scrollTop > lastScrollTop) {
    //             header.style.top = "-92px";
    //             header.classList.add("is-sticky");
    //         } else {
    //             header.style.top = "0";
    //             if (scrollTop <= 48) {
    //                 header.style.top = "0px";
    //                 header.classList.remove("is-sticky");
    //             }
    //         }
    //     }

    //     lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    // }, { passive: true });
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