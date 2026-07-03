
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

if (navHamburger && navLinks) {
    navHamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });


    navLinks.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => navLinks.classList.remove('open'));
    });


    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('open');
        }
    });
}


const hero = document.querySelector(".hero");
const leftGlow = document.querySelector(".glow-left");
const rightGlow = document.querySelector(".glow-right");

if (hero) {
    hero.addEventListener("mousemove", function (e) {
        let x = (e.clientX / window.innerWidth - 0.5);
        let y = (e.clientY / window.innerHeight - 0.5);

        if (leftGlow) leftGlow.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        if (rightGlow) rightGlow.style.transform = `translate(${-x * 40}px, ${-y * 40}px)`;
    });
}

const helpPillMain = document.querySelector(".help-content");
const helpPillArrow = document.querySelector(".help-arrow");
const helpMenu = document.getElementById("helpMenu");
const helpArrowIcon = document.querySelector(".help-arrow i");

const modalOverlay = document.getElementById("comingSoonModal");
const closeBtn = document.getElementById("closeModalBtn");
const gotItBtn = document.getElementById("gotItBtn");

function openModal() {
    modalOverlay.classList.add("active");
}

function closeModal() {
    modalOverlay.classList.remove("active");
}

if (helpPillMain) {
    helpPillMain.addEventListener("click", function (e) {
        e.stopPropagation();
        openModal();
        if (helpMenu) helpMenu.classList.remove("active");
        if (helpArrowIcon) helpArrowIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
    });
}

if (helpPillArrow) {
    helpPillArrow.addEventListener("click", function (e) {
        e.stopPropagation();
        helpMenu.classList.toggle("active");

        if (helpMenu.classList.contains("active")) {
            helpArrowIcon.classList.replace("fa-chevron-down", "fa-chevron-up");
        } else {
            helpArrowIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
        }
    });
}

document.addEventListener("click", function (e) {
    if (helpMenu && helpMenu.classList.contains("active") && !e.target.closest('.need-help-now')) {
        helpMenu.classList.remove("active");
        helpArrowIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
    }
});

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (gotItBtn) gotItBtn.addEventListener("click", closeModal);

if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}


const filterPills = document.querySelectorAll('.filter-pill');
const proCards = document.querySelectorAll('.pro-card');

if (filterPills.length > 0 && proCards.length > 0) {
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {

            filterPills.forEach(p => p.classList.remove('active'));

            this.classList.add('active');

            const selectedCategory = this.textContent.trim();

            proCards.forEach(card => {
                const cardCategory = card.querySelector('.pro-category').textContent.trim();

                if (selectedCategory === 'All Services' || selectedCategory === cardCategory) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            

            const pageTitle = document.querySelector('.page-header h1');
            if (pageTitle) {
                if (selectedCategory === 'All Services') {
                    pageTitle.textContent = 'All Professionals';
                } else {
                    pageTitle.textContent = selectedCategory + ' Professionals';
                }
            }
        });
    });


    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {

        const targetPill = Array.from(filterPills).find(pill => pill.textContent.trim() === categoryParam);
        if (targetPill) {
            targetPill.click();
        }
    }
}


const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
if (viewProfileBtns.length > 0) {
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = this.closest('.pro-card');
            

            const nameEl = card.querySelector('.pro-name').cloneNode(true);
            const badge = nameEl.querySelector('.verified-badge');
            if(badge) badge.remove();
            
            const proData = {
                name: nameEl.textContent.trim(),
                isVerified: card.querySelector('.verified-badge') !== null,
                category: card.querySelector('.pro-category').textContent.trim(),
                ratingScore: card.querySelector('.rating-score').textContent.trim(),
                ratingCount: card.querySelector('.rating-count').textContent.trim(),
                location: card.querySelector('.pro-location span').textContent.trim(),
                imgSrc: card.querySelector('.pro-avatar img').getAttribute('src'),
                description: card.querySelector('.pro-description').textContent.trim()
            };
            
            localStorage.setItem('selectedPro', JSON.stringify(proData));
        });
    });
}


const profilePageElement = document.querySelector('.profile-page');
if (profilePageElement) {
    const proDataStr = localStorage.getItem('selectedPro');
    if (proDataStr) {
        const proData = JSON.parse(proDataStr);
        
        const avatar = document.querySelector('.profile-main-avatar');
        if (avatar) avatar.src = proData.imgSrc;
        
        const nameEl = document.querySelector('.profile-name');
        if (nameEl) nameEl.textContent = proData.name;
        
        document.title = `${proData.name} - Profile | Lincro`;
        
        const verifiedBadge = document.querySelector('.verified-badge-large');
        if (verifiedBadge) {
            verifiedBadge.style.display = proData.isVerified ? 'inline-block' : 'none';
        }
        
        const tagline = document.querySelector('.profile-tagline');
        if (tagline) tagline.textContent = `${proData.category} Professional`;
        
        const metrics = document.querySelectorAll('.profile-metrics .metric');
        if (metrics.length >= 3) {
            metrics[0].querySelector('.metric-val').textContent = proData.ratingScore;
            let countClean = proData.ratingCount.replace(/[()]/g, '');
            metrics[0].querySelector('.metric-sub').textContent = `(${countClean} Reviews)`;
            

            metrics[1].querySelector('.metric-val').textContent = proData.location.charAt(0).toUpperCase() + proData.location.slice(1);
        }
        
        const aboutContent = document.querySelector('.content-section p');
        if (aboutContent) {
            aboutContent.textContent = proData.description + " I am fully committed to providing the best service possible to all my clients, ensuring high quality and satisfaction.";
        }
        
        const servicesSection = document.querySelectorAll('.content-section')[1];
        if (servicesSection && proData.category !== 'Plumbing') {
             servicesSection.innerHTML = `<h2>Services Offered</h2>
                 <div class="services-chips">
                    <div class="service-chip"><i class="fa-solid fa-check"></i><span>General ${proData.category}</span></div>
                    <div class="service-chip"><i class="fa-solid fa-clock"></i><span>Emergency Service</span></div>
                    <div class="service-chip"><i class="fa-solid fa-shield-halved"></i><span>Quality Assured</span></div>
                 </div>`;
        }
    }
}


const hireBtn = document.querySelector('.hire-btn');
const hireMeModal = document.getElementById('hireMeModal');
const closeHireModalBtn = document.getElementById('closeHireModalBtn');
const hireForm = document.getElementById('hireForm');
const hireFormContainer = document.getElementById('hireFormContainer');
const hireConfirmation = document.getElementById('hireConfirmation');
const doneHireBtn = document.getElementById('doneHireBtn');
const hireProName = document.getElementById('hireProName');

if (hireBtn && hireMeModal) {
    hireBtn.addEventListener('click', () => {

        hireForm.reset();
        hireFormContainer.style.display = 'block';
        hireConfirmation.style.display = 'none';
        

        const proNameEl = document.querySelector('.profile-name');
        if (proNameEl && hireProName) {
            hireProName.textContent = proNameEl.textContent;
        }
        
        hireMeModal.classList.add('active');
    });

    closeHireModalBtn.addEventListener('click', () => {
        hireMeModal.classList.remove('active');
    });

    doneHireBtn.addEventListener('click', () => {
        hireMeModal.classList.remove('active');
    });

    hireMeModal.addEventListener('click', (e) => {
        if (e.target === hireMeModal) {
            hireMeModal.classList.remove('active');
        }
    });

    hireForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const preferredDate = document.getElementById('preferredDate').value;
        const preferredTime = document.getElementById('preferredTime').value;
        

        const dateObj = new Date(preferredDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        

        const [hours, minutes] = preferredTime.split(':');
        let hours12 = parseInt(hours);
        const ampm = hours12 >= 12 ? 'PM' : 'AM';
        hours12 = hours12 % 12;
        hours12 = hours12 ? hours12 : 12;
        const formattedTime = `${hours12}:${minutes} ${ampm}`;
        
        document.getElementById('confirmedArrivalDate').textContent = formattedDate;
        document.getElementById('confirmedArrivalTime').textContent = formattedTime;
        

        hireFormContainer.style.display = 'none';
        hireConfirmation.style.display = 'block';
    });
}
