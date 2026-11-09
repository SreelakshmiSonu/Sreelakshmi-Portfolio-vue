document.addEventListener("DOMContentLoaded", () => {

    const pageLoader = document.getElementById("page-loader");
    window.addEventListener("load", () => {
        window.setTimeout(() => pageLoader?.classList.add("is-hidden"), 300);
    }, { once: true });

    const copyrightYear = document.getElementById("copyright-year");
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

    const themeToggle = document.getElementById("theme-toggle");
    const menuToggle = document.getElementById("menu-icon");
    const navbar = document.getElementById("primary-navigation");
    const savedTheme = localStorage.getItem("portfolio-theme");
    document.body.classList.toggle("dark-theme", savedTheme !== "light");

    const updateThemeToggle = () => {
        const isDark = document.body.classList.contains("dark-theme");
        if (!themeToggle) return;
        const icon = themeToggle.querySelector("i");
        icon?.classList.toggle("bx-moon", !isDark);
        icon?.classList.toggle("bx-sun", isDark);
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
        themeToggle.setAttribute("aria-pressed", String(isDark));
    };

    updateThemeToggle();
    themeToggle?.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
        updateThemeToggle();
    });

    const closeMenu = () => {
        navbar?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation");
        const icon = menuToggle?.querySelector("i");
        icon?.classList.replace("bx-x", "bx-menu");
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = navbar?.classList.toggle("open") ?? false;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        const icon = menuToggle.querySelector("i");
        icon?.classList.toggle("bx-menu", !isOpen);
        icon?.classList.toggle("bx-x", isOpen);
    });

    navbar?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
    });

    const activityChart = document.getElementById("activity-chart");
    if (activityChart) {
        const activitySummary = document.getElementById("activity-summary");
        const activityDays = document.getElementById("activity-days");
        const username = "SreelakshmiSonu";

        (async () => {
                const today = new Date();
                const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
                const startDate = new Date(todayUtc - 6 * 86400000);
                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const commitsByDate = new Map();
                const recentEvents = [];

                for (let page = 1; page <= 3; page++) {
                    const eventResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=100&page=${page}`, {
                        headers: { Accept: "application/vnd.github+json" }
                    });
                    if (!eventResponse.ok) throw new Error("Could not load GitHub events");
                    const events = await eventResponse.json();
                    if (!events.length) break;
                    recentEvents.push(...events.filter(event => new Date(event.created_at).getTime() >= startDate.getTime()));

                    const oldestEvent = new Date(events[events.length - 1].created_at).getTime();
                    if (events.length < 100 || oldestEvent < startDate.getTime()) break;
                }

                const pushes = recentEvents.filter(event =>
                    event.type === "PushEvent" &&
                    event.payload?.before &&
                    event.payload?.head &&
                    !/^0+$/.test(event.payload.before)
                );

                for (let offset = 0; offset < pushes.length; offset += 4) {
                    const batch = pushes.slice(offset, offset + 4);
                    const comparisons = await Promise.all(batch.map(async event => {
                        const repoPath = event.repo.name.split("/").map(encodeURIComponent).join("/");
                        const before = encodeURIComponent(event.payload.before);
                        const head = encodeURIComponent(event.payload.head);
                        const response = await fetch(`https://api.github.com/repos/${repoPath}/compare/${before}...${head}`, {
                            headers: { Accept: "application/vnd.github+json" }
                        });
                        if (!response.ok) throw new Error("Could not load pushed commits");
                        const comparison = await response.json();
                        return { event, count: comparison.total_commits ?? 0 };
                    }));

                    comparisons.forEach(({ event, count }) => {
                        const dateKey = event.created_at.slice(0, 10);
                        commitsByDate.set(dateKey, (commitsByDate.get(dateKey) ?? 0) + count);
                    });
                }

                let total = 0;

                for (let index = 0; index < 7; index++) {
                    const date = new Date(startDate.getTime() + index * 86400000);
                    const dateKey = date.toISOString().slice(0, 10);
                    const count = commitsByDate.get(dateKey) ?? 0;
                    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
                    const dayLabel = document.createElement("span");
                    dayLabel.textContent = `${dayNames[date.getUTCDay()]} ${date.getUTCDate()}`;
                    activityDays.appendChild(dayLabel);

                    const cell = document.createElement("i");
                    cell.dataset.level = String(level);
                    cell.textContent = count ? String(count) : "";
                    cell.title = `${count} ${count === 1 ? "commit" : "commits"} pushed on ${dateKey}`;
                    activityChart.appendChild(cell);

                    total += count;
                }

                activitySummary.textContent = `${total.toLocaleString()} commits pushed in the last seven days`;
                activityChart.setAttribute("aria-label", `${total} commits pushed in the last seven days. Each tile represents one day.`);
        })().catch(() => {
                activitySummary.textContent = "Commit activity is temporarily unavailable.";
                activityChart.remove();
                activityDays.remove();
            });
    }

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



