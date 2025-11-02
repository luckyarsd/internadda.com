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
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navMenu = document.querySelector('.nav-menu');
const profileBtnHeader = document.getElementById('profileBtnHeader');

// Form inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const searchInput = document.getElementById('searchInput');

// Dashboard elements
const userAvatarDashboard = document.getElementById('userAvatarDashboard');
const userNameDashboard = document.getElementById('userNameDashboard');
const userEmailDashboard = document.getElementById('userEmailDashboard');
// Kept for empty div placeholder
const coursesListContainer = document.getElementById('coursesListContainer'); 
const internshipsListContainer = document.getElementById('internshipsListContainer'); 


// New profile elements
const profileName = document.getElementById('profileName');
const profileGender = document.getElementById('profileGender');
const interestedDomain = document.getElementById('interestedDomain');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const profileDisplaySection = document.getElementById('profileDisplaySection');
const profileEditSection = document.getElementById('profileEditSection');
const userAvatarPreview = document.getElementById('userAvatarPreview');
const profileImageInput = document.getElementById('profileImageInput');

// Dashboard Tabs (Removed Notes and Settings)
const tabButtons = document.querySelectorAll('.tab-btn');
const tabsContent = {
    profile: document.getElementById('profileTabContent'),
    courses: document.getElementById('coursesTabContent'),
    internships: document.getElementById('internshipsTabContent'),
};

// Loading and Error Elements
const loginLoading = document.getElementById('loginLoading');
const signupLoading = document.getElementById('signupLoading');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// Hardcoded data (used only for search/listings)
const allCourses = [
    { title: 'Data Science Intern Course', instructor: 'Lucky Kumar', image: '/images/Essential Data Science Intern Course.png', url: "/courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Lucky Kumar', image: '/images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "/courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Ethical Hacking Mastery', instructor: 'Lucky Kumar', image: '/images/Ethical-Hacking-Mastery.png', url: "/courses/courses/Ethical-Hacking-Mastery.html" },
    { title: 'Python Essentials for All', instructor: 'Lucky Kumar', image: '/images/Python-Essentials-for-All.png', url: "/courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cloud & DevOps Essentials', instructor: 'Lucky Kumar', image: '/images/Cloud-DevOps-Essentials.png', url: "/courses/courses/Cloud-DevOps-Essentials.html" }
];
const popularCourses = [...allCourses]; 

const allInternships = [
    { title: 'Data Science & Analytics', roles: 'Data Analyst, Data Scientist Intern', skills: 'Python, SQL, Tableau', image: '/images/test_data Science.png', practiceTestUrl: '/intern/data_science_practice_test.html', finalExamUrl: '/intern/data_science_final_exam.html' },
    { title: 'Artificial Intelligence & Machine Learning', roles: 'AI Intern, ML Intern', skills: 'Python, TensorFlow, ML Algorithms', image: '/images/test_Artificial Intelligence.png', practiceTestUrl: '/intern/ai_ml_practice_test.html', finalExamUrl: '/intern/ai_ml_final_exam.html' },
    { title: 'Python Development & Software Engineering', roles: 'Python Developer Intern, Backend Developer Intern', skills: 'Python, Flask/Django, SQL', image: '/images/test_Python Development.png', practiceTestUrl: '/intern/python_dev_practice_test.html', finalExamUrl: '/intern/python_dev_final_exam.html' },
];

const coursesGrid = document.getElementById('coursesGrid'); 


// Helper functions (omitted for brevity)
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
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file && userAvatarPreview) {
        const reader = new FileReader();
        reader.onload = (e) => { userAvatarPreview.src = e.target.result; };
        reader.readAsDataURL(file);
    }
}
function updateProfileUI(profileData) {
    const avatarUrl = profileData.photoUrl || '/images/no_image.png';
    if (userAvatarHeader) userAvatarHeader.src = avatarUrl;
    if (userAvatarDashboard) userAvatarDashboard.src = avatarUrl;
    if (userAvatarPreview) userAvatarPreview.src = avatarUrl;
    if (userNameHeader) userNameHeader.textContent = profileData.name ? profileData.name.split(' ')[0] : 'User';
    if (userNameDashboard) userNameDashboard.textContent = profileData.name || 'User';
    if (userEmailDashboard) userEmailDashboard.textContent = profileData.email;
    const genderDisplay = document.getElementById('profileGenderDisplay');
    const domainDisplay = document.getElementById('profileDomainDisplay');
    if (genderDisplay) genderDisplay.textContent = profileData.gender || 'Not specified';
    if (domainDisplay) domainDisplay.textContent = profileData.interestedDomain || 'Not specified';
}


// --- NEW/UPDATED PROGRESS TRACKING (SIMULATED FOR DEMO) ---

// Placeholder function to simulate saving data to Firestore (using localStorage here)
window.saveProgress = async (type, identifier, data) => {
    const user = auth.currentUser;
    if (!user) return; 

    // Use a unique key based on UID, type, and course/internship identifier
    const storageKey = `progress_${user.uid}_${type}_${identifier.replace(/\s/g, '_')}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
};

// Placeholder function to simulate loading data from Firestore (using localStorage here)
window.loadProgress = async (type, identifier) => {
    const user = auth.currentUser;
    if (!user) return null; 

    const storageKey = `progress_${user.uid}_${type}_${identifier.replace(/\s/g, '_')}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
};


// Function to render Course tracking in Dashboard (FIXED to show empty for new users)
function renderCourseProgress() {
    const coursesListContainer = document.getElementById('coursesListContainer');
    if (!coursesListContainer) return;
    coursesListContainer.innerHTML = '';
    
    // Simulating fetching empty array for a new/demo user
    const userCourses = []; 

    if (userCourses.length === 0) {
        coursesListContainer.innerHTML = '<p class="text-center" style="color: var(--gray); padding: 20px 0;">You are not currently enrolled in any courses. <a href="/courses/course.html" style="color: var(--primary); font-weight: 600;">Start learning now!</a></p>';
        return;
    }
    // Real rendering logic would go here if data was available.
}

// Function to render Internship tracking in Dashboard (FIXED to show empty for new users)
function renderInternshipHistory() {
    const internshipsListContainer = document.getElementById('internshipsListContainer');
    if (!internshipsListContainer) return;
    internshipsListContainer.innerHTML = '';

    const userInternships = [];

    if (userInternships.length === 0) {
        internshipsListContainer.innerHTML = '<p class="text-center" style="color: var(--gray); padding: 20px 0;">No internship application or test history found. <a href="/intern/internship.html" style="color: var(--primary); font-weight: 600;">Start your application!</a></p>';
        return;
    }
    // Real rendering logic would go here if data was available.
}


// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    const isOnInternshipPage = window.location.pathname.includes('/intern/internship.html');
    const isOnCoursePage = window.location.pathname.includes('/courses/course.html');
    
    // --- Header Scroll Animation (omitted for brevity) ---
    const headerElement = document.querySelector('header');
    if (headerElement) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        });
    }

    // --- Modal, Auth, Profile, Hamburger (omitted for brevity) ---
    if (loginBtnHeader) loginBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(loginSection) showSection(loginSection); document.body.style.overflow = 'hidden'; });
    if (signupBtnHeader) signupBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(signupSection) showSection(signupSection); document.body.style.overflow = 'hidden'; });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; });
    if (authModal) window.addEventListener('click', (e) => { if (e.target === authModal) { authModal.classList.remove('active'); document.body.style.overflow = ''; } });
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); if(signupSection) showSection(signupSection); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); if(loginSection) showSection(loginSection); });
    
    if (userProfile) userProfile.addEventListener('click', () => { if(userDropdown) userDropdown.classList.toggle('active'); });
    document.addEventListener('click', (e) => { if (userProfile && userDropdown && !userProfile.contains(e.target) && userDropdown.classList.contains('active')) userDropdown.classList.remove('active'); });
    
    if (profileBtnHeader) profileBtnHeader.addEventListener('click', () => { if(authModal) authModal.classList.add('active'); if(dashboardSection) showSection(dashboardSection); if(userDropdown) userDropdown.classList.remove('active'); document.body.style.overflow = 'hidden'; const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]'); if (profileTabBtn) profileTabBtn.click(); });
    
    if (hamburgerMenu && navMenu) hamburgerMenu.addEventListener('click', () => { hamburgerMenu.classList.toggle('active'); navMenu.classList.toggle('active'); });
    
    async function signInWithGoogle() { try { await auth.signInWithPopup(googleProvider); if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; } catch (error) { if(loginError) showError(loginError, error.message); if(signupError) showError(signupError, error.message); } }
    
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);
    const handleLogout = async () => { try { await auth.signOut(); } catch (error) { console.error('Logout error:', error); } };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);

    // Tab switching logic (Only Profile, Courses, Internships)
    if (tabButtons.length > 0) { 
        tabButtons.forEach(button => { 
            button.addEventListener('click', () => { 
                const tab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                Object.keys(tabsContent).forEach(key => {
                    const content = tabsContent[key];
                    if(content) content.classList.add('hidden'); 
                });

                button.classList.add('active');
                if (tabsContent[tab]) tabsContent[tab].classList.remove('hidden');

                if (tab === 'courses') {
                    renderCourseProgress(); 
                } else if (tab === 'internships') {
                    renderInternshipHistory(); 
                }
            }); 
        }); 
        const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]'); 
        if (profileTabBtn) profileTabBtn.classList.add('active'); 
    }
    
    if (editProfileBtn && profileDisplaySection && profileEditSection) { editProfileBtn.addEventListener('click', () => { 
        profileDisplaySection.classList.add('hidden'); profileEditSection.classList.remove('hidden'); 
        if(profileName) profileName.value = userNameDashboard.textContent; 
        if(profileGender) profileGender.value = document.getElementById('profileGenderDisplay').textContent.trim() === 'Not specified' ? '' : document.getElementById('profileGenderDisplay').textContent.trim();
        if(interestedDomain) interestedDomain.value = document.getElementById('profileDomainDisplay').textContent.trim() === 'Not specified' ? '' : document.getElementById('profileDomainDisplay').textContent.trim();
    }); }
    
    if(profileImageInput && userAvatarPreview) { profileImageInput.addEventListener('change', handleImagePreview); }
    
    if (saveProfileBtn && profileName && profileGender && interestedDomain && profileImageInput) { saveProfileBtn.addEventListener('click', async () => { /* ... save logic ... */ }); }
    
    // --- UNIFIED Search Functionality (omitted for brevity) ---
    // --- RENDER COURSES (If on course listing page) (omitted for brevity) ---

}); 


// --- Auth State Observer (Handles profile updates and showing/hiding auth elements) ---
auth.onAuthStateChanged(async (user) => {
    const coursesListContainer = document.getElementById('coursesListContainer');
    const internshipsListContainer = document.getElementById('internshipsListContainer');

    if (user) {
        // --- User is signed in ---
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';

        if (authModal && authModal.classList.contains('active')) {
            if(dashboardSection) showSection(dashboardSection);
             const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]');
             if (profileTabBtn) profileTabBtn.click();
             
             const activeTab = document.querySelector('.profile-tabs .tab-btn.active');
             if (activeTab && activeTab.dataset.tab === 'courses') {
                 renderCourseProgress();
             } else if (activeTab && activeTab.dataset.tab === 'internships') {
                 renderInternshipHistory();
             }
        }

        // Load profile data from Firestore (omitted for brevity)
        // ... updateProfileUI(profileData) call ...

    } else {
        // --- User is signed out ---
        if(authButtons) authButtons.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');
        if (authModal && authModal.classList.contains('active')) {
            if(loginSection) showSection(loginSection);
        }
        
        // FIX: Update content for logged-out state.
        if(coursesListContainer) coursesListContainer.innerHTML = '<p class="text-center" style="color: var(--gray); padding: 20px 0;">Please log in to view your courses.</p>';
        if(internshipsListContainer) internshipsListContainer.innerHTML = '<p class="text-center" style="color: var(--gray); padding: 20px 0;">Please log in to view your internship history.</p>';
    }
});


console.log('🚀 Internadda Script Loaded! (Dashboard Cleaned)');
