document.addEventListener("DOMContentLoaded", function (event) {
    navActivePage();

    // Section-jump select behavior: smooth scroll + update hash
    const select = document.getElementById('section-select');
    if (!select) return;

    // Initialize select from current hash (if present)
    if (location.hash) {
        const current = location.hash.replace('#', '');
        if (Array.from(select.options).some(o => o.value === current)) {
            select.value = current;
        }
    }

    // small guard so programmatic updates from the observer don't fight user's explicit select action
    let ignoreObserver = false;

    select.addEventListener('change', function () {
        const id = this.value;
        if (!id) return;
        const el = document.getElementById(id);

        // temporarily suppress observer updates while animating
        ignoreObserver = true;
        setTimeout(() => { ignoreObserver = false; }, 600);

        if (el && 'scrollIntoView' in el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Offset for fixed navbar
            setTimeout(function () {
                window.scrollBy({ top: -200, left: 0, behavior: 'instant' });
            }, 300);
            // update the hash without the instant jump
            history.replaceState(null, '', '#' + id);
        } else {
            // fallback: set hash (will jump)
            location.hash = '#' + id;
        }

        // Move focus to the section heading for accessibility
        if (el) {
            const focusTarget = el.querySelector('h1,h2,h3,legend') || el;
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({ preventScroll: true });
            setTimeout(() => focusTarget.removeAttribute('tabindex'), 1000);
        }
    });

    // IntersectionObserver to update the select as the user scrolls
    const sectionElems = Array.from(document.querySelectorAll('#overview, #my-work, #about-show, #more-info'));
    if (sectionElems.length) {
        const observer = new IntersectionObserver((entries) => {
            if (ignoreObserver) return;
            // choose the entry with the largest intersectionRatio that's intersecting
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible && visible.target && visible.target.id) {
                const id = visible.target.id;
                if (Array.from(select.options).some(o => o.value === id)) {
                    select.value = id;
                    // keep URL hash in sync without causing a jump
                    history.replaceState(null, '', '#' + id);
                }
            }
        }, { root: null, rootMargin: '0px 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

        sectionElems.forEach(el => observer.observe(el));
    }
});