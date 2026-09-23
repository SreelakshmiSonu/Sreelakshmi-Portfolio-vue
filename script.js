document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       ABOUT SECTION OBSERVER
    ============================ */
    const aboutSection = document.querySelector(".about");

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.classList.add("show");
            } else {
                aboutSection.classList.remove("show");
            }
        });
    }, { threshold: 0.4 });

    aboutObserver.observe(aboutSection);


    /* ===========================
       PROJECTS SECTION OBSERVER
    ============================ */
    const projectsSection = document.querySelector(".projects");

    // Trigger animation if already visible on load
    if (projectsSection.getBoundingClientRect().top < window.innerHeight) {
        projectsSection.classList.add("show");
    }

    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                projectsSection.classList.add("show");
            } else {
                projectsSection.classList.remove("show");
            }
        });
    }, { threshold: 0.3 });

    projectsObserver.observe(projectsSection);

});

document.addEventListener("DOMContentLoaded", () => {
    const extra = document.getElementById("about-extra");
    const btn = document.getElementById("about-toggle-btn");

    btn.addEventListener("click", () => {
        const isOpen = extra.classList.contains("open");

        if (isOpen) {
            extra.classList.remove("open");
            btn.textContent = "Read More";
        } else {
            extra.classList.add("open");
            btn.textContent = "Hide Details";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const submitBtn = document.getElementById("contact-submit-btn");

    form.addEventListener("submit", () => {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
    });
});



