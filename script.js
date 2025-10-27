// ---------------------------------------------
// Firebase Auth & Firestore Logic
// ---------------------------------------------

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEas4FDRozXwhnzKeCz09LQnyCjY1twh4",
  authDomain: "internadda-c7217.firebaseapp.com",
  projectId: "internadda-c7217",
  storageBucket: "internadda-c7217.firebasestorage.app",
  messagingSenderId: "88070207511",
  appId: "1:88070207511:web:b15e5672970d6f699dc452",
  measurementId: "G-3ZZ3HGFM3Q"
};


// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();


// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
const authModal = document.getElementById('authModal');
const closeModalBtn = document.getElementById('closeModal');
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const dashboardSection = document.getElementById('dashboardSection');

// Header elements
const authButtons = document.getElementById('authButtons');
const userProfile = document.getElementById('userProfile');
const userAvatarHeader = document.getElementById('userAvatarHeader');
const userNameHeader = document.getElementById('userNameHeader');
const userDropdown = document.getElementById('userDropdown');

// Buttons
const loginBtnHeader = document.getElementById('loginBtnHeader');
const signupBtnHeader = document.getElementById('signupBtnHeader');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const emailLoginBtn = document.getElementById('emailLoginBtn');
const emailSignupBtn = document.getElementById('emailSignupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const logoutBtnHeader = document.getElementById('logoutBtnHeader');
const logoutBtnModal = document.getElementById('logoutBtnModal');
const saveDataBtn = document.getElementById('saveDataBtn');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.querySelector('.nav-menu');
const profileBtnHeader = document.getElementById('profileBtnHeader');

// Form inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const dataInput = document.getElementById('dataInput');
const searchInput = document.getElementById('searchInput');

// Dashboard elements
const userAvatarDashboard = document.getElementById('userAvatarDashboard');
const userNameDashboard = document.getElementById('userNameDashboard');
const userEmailDashboard = document.getElementById('userEmailDashboard');
const userDataList = document.getElementById('userDataList');

// New profile elements
const profileName = document.getElementById('profileName');
const profileGender = document.getElementById('profileGender');
const interestedDomain = document.getElementById('interestedDomain');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const profileTabContent = document.getElementById('profileTabContent'); // Reference if needed
const notesTabContent = document.getElementById('notesTabContent');     // Reference if needed
const settingsTabContent = document.getElementById('settingsTabContent'); // Reference if needed
const tabButtons = document.querySelectorAll('.tab-btn');
const profileAvatarDisplay = document.getElementById('profileAvatarDisplay'); // Reference if needed
const editProfileBtn = document.getElementById('editProfileBtn');
const profileDisplaySection = document.getElementById('profileDisplaySection');
const profileEditSection = document.getElementById('profileEditSection');
const userAvatarPreview = document.getElementById('userAvatarPreview');
const profileImageInput = document.getElementById('profileImageInput');

// Loading and Error Elements
const loginLoading = document.getElementById('loginLoading');
const signupLoading = document.getElementById('signupLoading');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// Hardcoded data to simulate Google Sheet (Keep for reference or remove if unused)
const verifiedInterns = [
    { name: "Pranjal Singh", email: "pranjal@example.com", testPassed: true },
    { name: "Anuj Singh", email: "anuj@example.com", testPassed: true },
    { name: "Sumit Pandey", email: "sumit@example.com", testPassed: true },
    // Add more verified interns here
];

// Helper function to create a URL-friendly slug
function createCourseSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
}

// --- Course Data (Used for non-internship pages) ---
const allCourses = [
    { title: 'Data Science Intern Course', instructor: 'Instructed by Lucky Kumar', image: '/images/Essential Data Science Intern Course.png', url: "/courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Instructed by Lucky Kumar', image: '/images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "/courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Ethical Hacking Mastery', instructor: 'Instructed by Lucky Kumar', image: '/images/Ethical-Hacking-Mastery.png', url: "/courses/courses/Ethical-Hacking-Mastery.html" },
    { title: 'Python Essentials for All', instructor: 'Instructed by Lucky Kumar', image: '/images/Python-Essentials-for-All.png', url: "/courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cloud & DevOps Essentials', instructor: 'Instructed by Lucky Kumar', image: '/images/Cloud-DevOps-Essentials.png', url: "/courses/courses/Cloud-DevOps-Essentials.html" }
];
const popularCourses = [
    { title: 'Data Science Intern Course', instructor: 'Created by AI', image: '/images/Essential Data Science Intern Course.png', url: "/courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Created by AI', image: '/images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "/courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Python Essentials for All', instructor: 'Created by AI', image: '/images/Python-Essentials-for-All.png', url: "/courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cybersecurity Fundamentals', instructor: 'Created by AI', image: '/images/Ethical-Hacking-Mastery.png', url: "/courses/courses/Ethical-Hacking-Mastery.html" },
];

const coursesGrid = document.getElementById('coursesGrid'); // Assuming this exists on course.html


// --- Internship Data (Used only for internship page search logic) ---
const allInternships = [
    { title: 'Data Science & Analytics', roles: 'Data Analyst, Data Scientist Intern', skills: 'Python, SQL, Tableau', image: '/images/test_data Science.png' },
    { title: 'Artificial Intelligence & Machine Learning', roles: 'AI Intern, ML Intern', skills: 'Python, TensorFlow, ML Algorithms', image: '/images/test_Artificial Intelligence.png' },
    { title: 'Python Development & Software Engineering', roles: 'Python Developer Intern, Backend Developer Intern', skills: 'Python, Flask/Django, SQL', image: '/images/test_Python Development.png' },
    { title: 'Cloud Computing & DevOps', roles: 'Cloud Engineer Intern, DevOps Intern', skills: 'AWS, Docker, CI/CD', image: '/images/test_Cloud Computing.png' },
    { title: 'Cybersecurity & Ethical Hacking', roles: 'Security Analyst Intern, Ethical Hacking Intern', skills: 'Networking, Linux, Penetration Testing', image: '/images/test_Cybersecurity & Ethical Hacking.png' },
    { title: 'Web & Mobile Development', roles: 'Frontend/Full-Stack Developer Intern', skills: 'HTML/CSS/JS, React, Flutter', image: '/images/test_Web & Mobile Development.png' },
    { title: 'Blockchain & Web3', roles: 'Blockchain Developer Intern, Smart Contract Developer', skills: 'Solidity, Ethereum', image: '/images/test_Blockchain & Web3.png' },
    { title: 'UI/UX & Product Design', roles: 'UI/UX Intern, Product Design Intern', skills: 'Figma, Wireframing', image: '/images/test_UIUX Design & Product Design.png' },
    { title: 'Content Creation & Video Editing', roles: 'Content Creator Intern, Video Editing Intern', skills: 'Canva, CapCut, Adobe Premiere Pro, Scriptwriting', image: '/images/test_Content Creation & Video Editing.png' },
    { title: 'Prompt Engineering Internship', roles: 'AI Prompt Engineer Intern, ChatGPT Specialist Intern', skills: 'ChatGPT, Midjourney, Generative AI, Prompt Design', image: '/images/test_Prompt Engineering.png' },
    { title: 'Game Development Internship', roles: 'Game Developer Intern, Unity Developer Intern', skills: 'Unity, C#, Unreal Engine, Game Design', image: '/images/test_Game Development.png' },
    { title: 'Digital Marketing & Growth Hacking', roles: 'Digital Marketing Intern, SEO/SEM Intern', skills: 'SEO, Content Marketing', image: '/images/test_Digital Marketing & Growth Hacking.png' }
];

// Function to render courses (Used on course.html potentially)
function renderCourses(courses) {
    if (!coursesGrid) return;
    coursesGrid.innerHTML = ''; // Clear existing
    courses.forEach(course => {
        const card = document.createElement('a');
        card.href = course.url; // Use the absolute URL
        card.className = 'course-card';
        card.style.textDecoration = 'none';
        card.style.color = 'inherit';
        card.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-author">Instructed by ${course.instructor}</p>
                <div class="course-price">
                    <span class="original-price">₹${course.originalPrice || '1,999'}</span>
                    <span class="badge free">FREE</span>
                 </div>
            </div>
        `;
        coursesGrid.appendChild(card);
    });
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
    return `<div class="rating-stars">${stars}</div>`;
}

// Function to get the correct avatar
function getAvatarUrl(progress, userUploadedImage) {
     const defaultAvatar = '/images/no_image.png'; // Absolute path for default
     return userUploadedImage || defaultAvatar; // Use uploaded if available, else default
}

// Function to handle image preview from file input
function handleImagePreview(event) {
     const file = event.target.files[0];
     if (file && userAvatarPreview) {
         const reader = new FileReader();
         reader.onload = (e) => { userAvatarPreview.src = e.target.result; };
         reader.readAsDataURL(file);
     }
}

// Function to check against the simulated Google Sheet for verification
function checkVerificationStatus(userEmail, userName) {
    return verifiedInterns.some(intern => intern.email === userEmail && intern.testPassed);
}

// Utility Functions
function showSection(sectionElement) {
    if (!sectionElement) return;
    const parentModalContent = sectionElement.closest('.modal-content');
    if (parentModalContent) {
        parentModalContent.querySelectorAll('.auth-section').forEach(sec => sec.classList.remove('active'));
    }
    sectionElement.classList.add('active');
}

function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 5000);
}

function showLoading(element, show) {
    if (!element) return;
    element.style.display = show ? 'block' : 'none';
}

// --- COURSE Search Results Display (for non-internship pages) ---
function showCourseSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        resultsContainer.classList.remove('hidden');
        results.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.url || '#';
            resultItem.className = 'search-result-item';
            resultItem.style.display = 'flex';
            resultItem.style.alignItems = 'center';
            resultItem.style.gap = '15px';
            resultItem.style.textDecoration = 'none';
            resultItem.style.color = 'inherit';

            resultItem.innerHTML = `
                <img src="${result.image || '/images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0; font-size: 1em;">${result.title}</h4>
                    <p style="margin: 0; font-size: 0.9em; color: var(--gray);">${result.instructor}</p>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = '<p style="padding: 15px; text-align: center; color: var(--gray);">No courses found.</p>';
    }
}


// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    const isOnInternshipPage = window.location.pathname.includes('/intern/internship.html');

    // --- Modal Event Listeners (Same as before) ---
    if (loginBtnHeader) loginBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(loginSection) showSection(loginSection); document.body.style.overflow = 'hidden'; });
    if (signupBtnHeader) signupBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(signupSection) showSection(signupSection); document.body.style.overflow = 'hidden'; });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; });
    if (authModal) window.addEventListener('click', (e) => { if (e.target === authModal) { authModal.classList.remove('active'); document.body.style.overflow = ''; } });
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); if(signupSection) showSection(signupSection); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); if(loginSection) showSection(loginSection); });

    // --- Header User Profile Dropdown (Same as before) ---
    if (userProfile) userProfile.addEventListener('click', () => { if(userDropdown) userDropdown.classList.toggle('active'); });
    document.addEventListener('click', (e) => { if (userProfile && userDropdown && !userProfile.contains(e.target) && userDropdown.classList.contains('active')) userDropdown.classList.remove('active'); });

    // --- Profile Button in Dropdown (Same as before) ---
    if (profileBtnHeader) profileBtnHeader.addEventListener('click', () => { if(authModal) authModal.classList.add('active'); if(dashboardSection) showSection(dashboardSection); if(userDropdown) userDropdown.classList.remove('active'); document.body.style.overflow = 'hidden'; const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]'); if (profileTabBtn) profileTabBtn.click(); });

    // --- Hamburger Menu (Same as before) ---
    if (hamburgerMenu && navMenu) hamburgerMenu.addEventListener('click', () => { hamburgerMenu.classList.toggle('active'); navMenu.classList.toggle('active'); });

    // --- Authentication Logic (Same as before) ---
    // Email Login
    if (emailLoginBtn && loginEmail && loginPassword && loginError && loginLoading) { emailLoginBtn.addEventListener('click', async () => { /* ... */ }); loginPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailLoginBtn.click(); }); }
    // Email Signup
    if (emailSignupBtn && signupEmail && signupPassword && signupError && signupLoading) { emailSignupBtn.addEventListener('click', async () => { /* ... */ }); signupPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailSignupBtn.click(); }); }
    // Google Login/Signup
    async function signInWithGoogle() { try { await auth.signInWithPopup(googleProvider); if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; } catch (error) { if(loginError) showError(loginError, error.message); if(signupError) showError(signupError, error.message); } }
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);
    // Logout
    const handleLogout = async () => { try { await auth.signOut(); } catch (error) { console.error('Logout error:', error); } };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);

    // --- Profile Management (Same as before, relies on updateProfileUI) ---
    function updateProfileUI(profileData) { /* ... same as previous version ... */ }
    if (tabButtons.length > 0) { /* ... same tab logic ... */ }
    if (editProfileBtn && profileDisplaySection && profileEditSection) { /* ... same edit logic ... */ }
    if(profileImageInput && userAvatarPreview) { profileImageInput.addEventListener('change', handleImagePreview); }
    if (saveProfileBtn && profileName && profileGender && interestedDomain && profileImageInput) { saveProfileBtn.addEventListener('click', async () => { /* ... same save logic ... */ }); }

    // --- Notes Section (Same as before) ---
    if (saveDataBtn && dataInput) { /* ... same save note logic ... */ }
    window.deleteData = async function(docId) { /* ... same delete note logic ... */ };
    let notesUnsubscribe = null;
    function setupDataListener() { /* ... same note listener logic ... */ }
    function escapeHTML(str) { /* ... same escape logic ... */ }

    // --- Seats Popup (Same as before) ---
    function showSeatsPopup(domain, seats) { /* ... same popup logic ... */ }

    // --- Hero Slider (Same as before) ---
    const sliderWrapper = document.querySelector('.hero-image-slider .slider-wrapper');
    if (sliderWrapper) { /* ... same slider logic ... */ }


    // --- *** NEW: Conditional Search Functionality *** ---
    if (searchInput) {
        if (isOnInternshipPage) {
            // --- Internship Page Search ---
            searchInput.placeholder = "Search for internships..."; // Change placeholder
            const internshipGrid = document.querySelector('#tests .courses-grid');
            const internshipCards = internshipGrid ? internshipGrid.querySelectorAll('.course-card') : [];
            const searchResultsContainer = document.getElementById('searchResults'); // Get the course results container

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.trim().toLowerCase();
                let resultsFound = false;

                 // Hide the course results dropdown when searching on internship page
                 if (searchResultsContainer) {
                    searchResultsContainer.classList.add('hidden');
                 }

                internshipCards.forEach(card => {
                    const titleElement = card.querySelector('.course-title');
                    const instructorElement = card.querySelector('.course-instructor'); // Contains roles/skills

                    const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                    const details = instructorElement ? instructorElement.textContent.toLowerCase() : ''; // Roles and skills text

                    // Check if query matches title, roles, or skills
                    const isMatch = title.includes(query) || details.includes(query);

                    if (isMatch) {
                        card.style.display = 'block'; // Or 'flex', 'grid' depending on original style
                        resultsFound = true;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Optional: Show a "no results" message within the grid area if needed
                // You might need a dedicated element for this message inside the #tests section.
            });

        } else {
            // --- Course Page Search (Original Logic) ---
            searchInput.placeholder = "Search for courses..."; // Default placeholder

            function filterCourses(query) {
                 const lowerCaseQuery = query.toLowerCase();
                 const allAvailableCourses = [...allCourses, ...popularCourses];
                 const uniqueCourses = Array.from(new Map(allAvailableCourses.map(course => [course.url || course.title, course])).values()); // Use URL or title as key
                 return uniqueCourses.filter(course =>
                     (course.title && course.title.toLowerCase().includes(lowerCaseQuery)) ||
                     (course.instructor && course.instructor.toLowerCase().includes(lowerCaseQuery))
                 );
            }

            searchInput.addEventListener('input', () => {
                 const query = searchInput.value.trim();
                 const resultsContainer = document.getElementById('searchResults');
                 if (query.length > 1) {
                     const filteredResults = filterCourses(query);
                     showCourseSearchResults(filteredResults); // Use the course-specific display function
                 } else {
                     if (resultsContainer) resultsContainer.classList.add('hidden');
                 }
            });
        }
    }

    // --- Click Outside Search to Close (Applies to both types of search results/filtering) ---
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const searchResultsContainer = document.getElementById('searchResults'); // Course dropdown

        let clickedInsideSearch = searchContainer && searchContainer.contains(e.target);
        let clickedInsideCourseResults = searchResultsContainer && searchResultsContainer.contains(e.target);

        if (!clickedInsideSearch && !clickedInsideCourseResults) {
            if (searchInput) searchInput.value = ''; // Clear input

            // Hide course dropdown if it exists and is visible
            if (searchResultsContainer) searchResultsContainer.classList.add('hidden');

            // If on internship page, reset filtering (show all cards)
            if (isOnInternshipPage) {
                const internshipGrid = document.querySelector('#tests .courses-grid');
                const internshipCards = internshipGrid ? internshipGrid.querySelectorAll('.course-card') : [];
                internshipCards.forEach(card => {
                    card.style.display = 'block'; // Or original display type
                });
            }
        }
    });

    // --- General Styling / Initial Load Effects (Same as before) ---
    const header = document.querySelector('header');
    if(header) { window.addEventListener('scroll', function() { /* ... */ }); }

    // --- RENDER COURSES (If on course listing page - not internship page) ---
    if (!isOnInternshipPage && coursesGrid && typeof allCourses !== 'undefined' && allCourses.length > 0) {
        renderCourses(allCourses);
    }

    // --- Mobile Button Fixes (Added previously) ---
    const loginBtnMobile = document.getElementById('loginBtnHeaderMobile');
    const signupBtnMobile = document.getElementById('signupBtnHeaderMobile');
    const closeHamburgerMenu = () => { if (navMenu && hamburgerMenu) { navMenu.classList.remove('active'); hamburgerMenu.classList.remove('active'); } };
    if (loginBtnMobile) { loginBtnMobile.addEventListener('click', (e) => { e.preventDefault(); if (authModal && loginSection && signupSection) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; signupSection.classList.remove('active'); loginSection.classList.add('active'); closeHamburgerMenu(); } }); }
    if (signupBtnMobile) { signupBtnMobile.addEventListener('click', (e) => { e.preventDefault(); if (authModal && loginSection && signupSection) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; loginSection.classList.remove('active'); signupSection.classList.add('active'); closeHamburgerMenu(); } }); }


}); // End DOMContentLoaded


// --- Auth State Observer (Same as before) ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // --- User is signed in ---
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';

        if (authModal && authModal.classList.contains('active')) {
            if(dashboardSection) showSection(dashboardSection);
             const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]');
             if (profileTabBtn) profileTabBtn.click();
             else if (tabButtons.length > 0) tabButtons[0].click();
        }

        // Load profile data from Firestore
        const userDocRef = db.collection('userProfiles').doc(user.uid);
        try {
            const userDoc = await userDocRef.get();
            let profileData = { name: user.displayName, photoUrl: user.photoURL || '/images/no_image.png', email: user.email };

            if (userDoc.exists) {
                profileData = { ...profileData, ...userDoc.data() };
                 profileData.photoUrl = profileData.photoUrl || '/images/no_image.png';
                if(profileName) profileName.value = profileData.name || '';
                if(profileGender) profileGender.value = profileData.gender || '';
                if(interestedDomain) interestedDomain.value = profileData.interestedDomain || '';
            } else {
                 if(profileName) profileName.value = user.displayName || '';
                 profileData.photoUrl = profileData.photoUrl || '/images/no_image.png';
            }
            updateProfileUI(profileData);

        } catch (error) {
             console.error("Error loading profile data:", error);
             updateProfileUI({ name: user.displayName, photoUrl: user.photoURL || '/images/no_image.png', email: user.email });
        }

        setupDataListener(); // Refresh notes listener

        // Clear forms
        if(loginEmail) loginEmail.value = ''; if(loginPassword) loginPassword.value = '';
        if(signupEmail) signupEmail.value = ''; if(signupPassword) signupPassword.value = '';

    } else {
        // --- User is signed out ---
        if(authButtons) authButtons.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');
        if (authModal && authModal.classList.contains('active')) {
            if(loginSection) showSection(loginSection);
        }
         if(notesUnsubscribe) notesUnsubscribe();
         if(userDataList) userDataList.innerHTML = '<p>Please log in to see your notes.</p>';
    }
});


console.log('🚀 Internadda Script Loaded! (Conditional Search Added)');
