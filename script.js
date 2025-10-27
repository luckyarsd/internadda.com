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

// Hardcoded data to simulate Google Sheet
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

const coursesGrid = document.getElementById('coursesGrid'); // Reference for course listing page


// --- Internship Data (Used for internship page search) ---
const allInternships = [
    // --- Added URLs matching the links in internship.html ---
    { title: 'Data Science & Analytics', roles: 'Data Analyst, Data Scientist Intern', skills: 'Python, SQL, Tableau', image: '/images/test_data Science.png', url: '/intern/data_science_practice_test.html' }, // Example URL, adjust if needed
    { title: 'Artificial Intelligence & Machine Learning', roles: 'AI Intern, ML Intern', skills: 'Python, TensorFlow, ML Algorithms', image: '/images/test_Artificial Intelligence.png', url: '/intern/ai_ml_practice_test.html' },
    { title: 'Python Development & Software Engineering', roles: 'Python Developer Intern, Backend Developer Intern', skills: 'Python, Flask/Django, SQL', image: '/images/test_Python Development.png', url: '/intern/python_dev_practice_test.html' },
    { title: 'Cloud Computing & DevOps', roles: 'Cloud Engineer Intern, DevOps Intern', skills: 'AWS, Docker, CI/CD', image: '/images/test_Cloud Computing.png', url: '/intern/cloud_devops_practice_test.html' },
    { title: 'Cybersecurity & Ethical Hacking', roles: 'Security Analyst Intern, Ethical Hacking Intern', skills: 'Networking, Linux, Penetration Testing', image: '/images/test_Cybersecurity & Ethical Hacking.png', url: '/intern/cybersecurity_practice_test.html' },
    { title: 'Web & Mobile Development', roles: 'Frontend/Full-Stack Developer Intern', skills: 'HTML/CSS/JS, React, Flutter', image: '/images/test_Web & Mobile Development.png', url: '/intern/web_mobile_practice_test.html' },
    { title: 'Blockchain & Web3', roles: 'Blockchain Developer Intern, Smart Contract Developer', skills: 'Solidity, Ethereum', image: '/images/test_Blockchain & Web3.png', url: '/intern/blockchain_practice_test.html' },
    { title: 'UI/UX & Product Design', roles: 'UI/UX Intern, Product Design Intern', skills: 'Figma, Wireframing', image: '/images/test_UIUX Design & Product Design.png', url: '/intern/uiux_practice_test.html' },
    { title: 'Content Creation & Video Editing', roles: 'Content Creator Intern, Video Editing Intern', skills: 'Canva, CapCut, Adobe Premiere Pro, Scriptwriting', image: '/images/test_Content Creation & Video Editing.png', url: '/intern/content_creation_practice_test.html' },
    { title: 'Prompt Engineering Internship', roles: 'AI Prompt Engineer Intern, ChatGPT Specialist Intern', skills: 'ChatGPT, Midjourney, Generative AI, Prompt Design', image: '/images/test_Prompt Engineering.png', url: '/intern/prompt_engineering_practice_test.html' },
    { title: 'Game Development Internship', roles: 'Game Developer Intern, Unity Developer Intern', skills: 'Unity, C#, Unreal Engine, Game Design', image: '/images/test_Game Development.png', url: '/intern/game_dev_practice_test.html' },
    { title: 'Digital Marketing & Growth Hacking', roles: 'Digital Marketing Intern, SEO/SEM Intern', skills: 'SEO, Content Marketing', image: '/images/test_Digital Marketing & Growth Hacking.png', url: '/intern/digital_marketing_practice_test.html' }
];

// Function to render courses (Used on course.html potentially)
function renderCourses(courses) {
    if (!coursesGrid) return;
    coursesGrid.innerHTML = ''; // Clear existing
    courses.forEach(course => {
        const card = document.createElement('a');
        card.href = course.url;
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
function generateStarRating(rating) { /* ... same ... */ }

// Function to get the correct avatar
function getAvatarUrl(progress, userUploadedImage) { /* ... same ... */ }

// Function to handle image preview from file input
function handleImagePreview(event) { /* ... same ... */ }

// Function to check against the simulated Google Sheet for verification
function checkVerificationStatus(userEmail, userName) { /* ... same ... */ }

// Utility Functions
function showSection(sectionElement) { /* ... same ... */ }
function showError(element, message) { /* ... same ... */ }
function showLoading(element, show) { /* ... same ... */ }

// --- UNIFIED Search Results Display Function ---
function showSearchResultsDropdown(results, resultType = 'course') { // Added resultType
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        resultsContainer.classList.remove('hidden');
        results.forEach(result => {
            const resultItem = document.createElement('a');
            // --- Use appropriate URL based on type ---
            resultItem.href = result.url || '#'; // Internship URLs might point to practice test/exam pages

            resultItem.className = 'search-result-item';
            resultItem.style.display = 'flex';
            resultItem.style.alignItems = 'center';
            resultItem.style.gap = '15px';
            resultItem.style.textDecoration = 'none';
            resultItem.style.color = 'inherit';

            // --- Use appropriate text based on type ---
            let detailsText = '';
            if (resultType === 'internship') {
                detailsText = `${result.roles || ''} - Skills: ${result.skills || ''}`;
            } else { // Default to course
                detailsText = result.instructor || '';
            }

            resultItem.innerHTML = `
                <img src="${result.image || '/images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0; font-size: 1em;">${result.title}</h4>
                    <p style="margin: 0; font-size: 0.9em; color: var(--gray);">${detailsText}</p>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `<p style="padding: 15px; text-align: center; color: var(--gray);">No ${resultType === 'internship' ? 'internships' : 'courses'} found.</p>`;
    }
}


// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    const isOnInternshipPage = window.location.pathname.includes('/intern/internship.html');
    const isOnCoursePage = window.location.pathname.includes('/courses/course.html'); // Add check for course listing page if needed

    // --- Modal, Auth, Profile, Hamburger, Notes, Seats Popup, Slider (Keep all these the same as previous version) ---
    // ... (Modal listeners) ...
    if (loginBtnHeader) loginBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(loginSection) showSection(loginSection); document.body.style.overflow = 'hidden'; });
    if (signupBtnHeader) signupBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(signupSection) showSection(signupSection); document.body.style.overflow = 'hidden'; });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; });
    if (authModal) window.addEventListener('click', (e) => { if (e.target === authModal) { authModal.classList.remove('active'); document.body.style.overflow = ''; } });
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); if(signupSection) showSection(signupSection); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); if(loginSection) showSection(loginSection); });
    // ... (Header Dropdown listeners) ...
    if (userProfile) userProfile.addEventListener('click', () => { if(userDropdown) userDropdown.classList.toggle('active'); });
    document.addEventListener('click', (e) => { if (userProfile && userDropdown && !userProfile.contains(e.target) && userDropdown.classList.contains('active')) userDropdown.classList.remove('active'); });
    // ... (Profile Button listener) ...
    if (profileBtnHeader) profileBtnHeader.addEventListener('click', () => { if(authModal) authModal.classList.add('active'); if(dashboardSection) showSection(dashboardSection); if(userDropdown) userDropdown.classList.remove('active'); document.body.style.overflow = 'hidden'; const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]'); if (profileTabBtn) profileTabBtn.click(); });
    // ... (Hamburger Menu listener) ...
    if (hamburgerMenu && navMenu) hamburgerMenu.addEventListener('click', () => { hamburgerMenu.classList.toggle('active'); navMenu.classList.toggle('active'); });
    // ... (Authentication listeners - Email, Google, Logout) ...
    async function signInWithGoogle() { /* ... */ }
    if (emailLoginBtn) { /* ... */ }
    if (emailSignupBtn) { /* ... */ }
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);
    const handleLogout = async () => { /* ... */ };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);
    // ... (Profile Management listeners - Tabs, Edit, Save, Image Preview) ...
    function updateProfileUI(profileData) { /* ... */ }
    if (tabButtons.length > 0) { /* ... */ }
    if (editProfileBtn) { /* ... */ }
    if (profileImageInput) { /* ... */ }
    if (saveProfileBtn) { /* ... */ }
    // ... (Notes listeners - Save, Delete, Listener Setup) ...
    if (saveDataBtn) { /* ... */ }
    window.deleteData = async function(docId) { /* ... */ };
    let notesUnsubscribe = null;
    function setupDataListener() { /* ... */ }
    function escapeHTML(str) { /* ... */ }
    // ... (Seats Popup function) ...
    function showSeatsPopup(domain, seats) { /* ... */ }
    // ... (Slider listeners) ...
    const sliderWrapper = document.querySelector('.hero-image-slider .slider-wrapper');
    if (sliderWrapper) { /* ... */ }


    // --- *** UNIFIED Search Functionality *** ---
    if (searchInput) {
        let searchDataSource = [];
        let resultType = 'course'; // Default
        let placeholderText = "Search for courses...";

        // Determine data source and placeholder based on page
        if (isOnInternshipPage) {
            searchDataSource = allInternships;
            resultType = 'internship';
            placeholderText = "Search for internships...";
        } else {
            // Combine course lists for searching on other pages
            const combinedCourses = [...allCourses, ...popularCourses];
            // Deduplicate based on URL or title
            searchDataSource = Array.from(new Map(combinedCourses.map(course => [course.url || course.title, course])).values());
            resultType = 'course';
            placeholderText = "Search for courses...";
        }

        searchInput.placeholder = placeholderText; // Set the correct placeholder

        // Generic filter function
        function filterItems(query, items, type) {
            const lowerCaseQuery = query.toLowerCase();
            return items.filter(item => {
                const titleMatch = item.title && item.title.toLowerCase().includes(lowerCaseQuery);
                let detailsMatch = false;
                if (type === 'internship') {
                    const rolesMatch = item.roles && item.roles.toLowerCase().includes(lowerCaseQuery);
                    const skillsMatch = item.skills && item.skills.toLowerCase().includes(lowerCaseQuery);
                    detailsMatch = rolesMatch || skillsMatch;
                } else { // Course
                    detailsMatch = item.instructor && item.instructor.toLowerCase().includes(lowerCaseQuery);
                }
                return titleMatch || detailsMatch;
            });
        }

        // Event listener for search input
        searchInput.addEventListener('input', () => {
             const query = searchInput.value.trim();
             const resultsContainer = document.getElementById('searchResults');
             if (query.length > 1) {
                 const filteredResults = filterItems(query, searchDataSource, resultType);
                 showSearchResultsDropdown(filteredResults, resultType); // Use the unified display function
             } else {
                 if (resultsContainer) resultsContainer.classList.add('hidden'); // Hide dropdown if query is short
             }
        });
    }

    // --- Click Outside Search to Close ---
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const searchResultsContainer = document.getElementById('searchResults'); // Dropdown container

        let clickedInsideSearch = searchContainer && searchContainer.contains(e.target);
        let clickedInsideResults = searchResultsContainer && searchResultsContainer.contains(e.target);

        if (!clickedInsideSearch && !clickedInsideResults) {
            if (searchInput) searchInput.value = ''; // Clear input
            if (searchResultsContainer) searchResultsContainer.classList.add('hidden'); // Hide dropdown
        }
    });

    // --- General Styling / Initial Load Effects (Same as before) ---
    const header = document.querySelector('header');
    if(header) { window.addEventListener('scroll', function() { /* ... */ }); }

    // --- RENDER COURSES (If on course listing page) ---
    if (isOnCoursePage && coursesGrid && typeof allCourses !== 'undefined' && allCourses.length > 0) {
        renderCourses(allCourses);
    }

    // --- Mobile Button Fixes (Same as before) ---
    const loginBtnMobile = document.getElementById('loginBtnHeaderMobile');
    const signupBtnMobile = document.getElementById('signupBtnHeaderMobile');
    const closeHamburgerMenu = () => { /* ... */ };
    if (loginBtnMobile) { /* ... */ }
    if (signupBtnMobile) { /* ... */ }

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


console.log('🚀 Internadda Script Loaded! (Unified Search Added)');
