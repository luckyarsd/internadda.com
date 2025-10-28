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
const profileTabContent = document.getElementById('profileTabContent');
const notesTabContent = document.getElementById('notesTabContent');
const settingsTabContent = document.getElementById('settingsTabContent');
const tabButtons = document.querySelectorAll('.tab-btn');
const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
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
    { title: 'Data Science & Analytics', roles: 'Data Analyst, Data Scientist Intern', skills: 'Python, SQL, Tableau', image: '/images/test_data Science.png', practiceTestUrl: '/intern/data_science_practice_test.html', finalExamUrl: '/intern/data_science_final_exam.html' },
    { title: 'Artificial Intelligence & Machine Learning', roles: 'AI Intern, ML Intern', skills: 'Python, TensorFlow, ML Algorithms', image: '/images/test_Artificial Intelligence.png', practiceTestUrl: '/intern/ai_ml_practice_test.html', finalExamUrl: '/intern/ai_ml_final_exam.html' },
    { title: 'Python Development & Software Engineering', roles: 'Python Developer Intern, Backend Developer Intern', skills: 'Python, Flask/Django, SQL', image: '/images/test_Python Development.png', practiceTestUrl: '/intern/python_dev_practice_test.html', finalExamUrl: '/intern/python_dev_final_exam.html' },
    { title: 'Cloud Computing & DevOps', roles: 'Cloud Engineer Intern, DevOps Intern', skills: 'AWS, Docker, CI/CD', image: '/images/test_Cloud Computing.png', practiceTestUrl: '/intern/cloud_devops_practice_test.html', finalExamUrl: '/intern/cloud_devops_final_exam.html' },
    { title: 'Cybersecurity & Ethical Hacking', roles: 'Security Analyst Intern, Ethical Hacking Intern', skills: 'Networking, Linux, Penetration Testing', image: '/images/test_Cybersecurity & Ethical Hacking.png', practiceTestUrl: '/intern/cybersecurity_practice_test.html', finalExamUrl: '/intern/cybersecurity_final_exam.html' },
    { title: 'Web & Mobile Development', roles: 'Frontend/Full-Stack Developer Intern', skills: 'HTML/CSS/JS, React, Flutter', image: '/images/test_Web & Mobile Development.png', practiceTestUrl: '/intern/web_mobile_practice_test.html', finalExamUrl: '/intern/web_mobile_final_exam.html' },
    { title: 'Blockchain & Web3', roles: 'Blockchain Developer Intern, Smart Contract Developer', skills: 'Solidity, Ethereum', image: '/images/test_Blockchain & Web3.png', practiceTestUrl: '/intern/blockchain_practice_test.html', finalExamUrl: '/intern/blockchain_final_exam.html' },
    { title: 'UI/UX & Product Design', roles: 'UI/UX Intern, Product Design Intern', skills: 'Figma, Wireframing', image: '/images/test_UIUX Design & Product Design.png', practiceTestUrl: '/intern/uiux_practice_test.html', finalExamUrl: '/intern/uiux_final_exam.html' },
    { title: 'Content Creation & Video Editing', roles: 'Content Creator Intern, Video Editing Intern', skills: 'Canva, CapCut, Adobe Premiere Pro, Scriptwriting', image: '/images/test_Content Creation & Video Editing.png', practiceTestUrl: '/intern/content_creation_practice_test.html', finalExamUrl: '/intern/content_creation_final_exam.html' },
    { title: 'Prompt Engineering Internship', roles: 'AI Prompt Engineer Intern, ChatGPT Specialist Intern', skills: 'ChatGPT, Midjourney, Generative AI, Prompt Design', image: '/images/test_Prompt Engineering.png', practiceTestUrl: '/intern/prompt_engineering_practice_test.html', finalExamUrl: '/intern/prompt_engineering_final_exam.html' },
    { title: 'Game Development Internship', roles: 'Game Developer Intern, Unity Developer Intern', skills: 'Unity, C#, Unreal Engine, Game Design', image: '/images/test_Game Development.png', practiceTestUrl: '/intern/game_dev_practice_test.html', finalExamUrl: '/intern/game_dev_final_exam.html' },
    { title: 'Digital Marketing & Growth Hacking', roles: 'Digital Marketing Intern, SEO/SEM Intern', skills: 'SEO, Content Marketing', image: '/images/test_Digital Marketing & Growth Hacking.png', practiceTestUrl: '/intern/digital_marketing_practice_test.html', finalExamUrl: '/intern/digital_marketing_final_exam.html' }
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
     const defaultAvatar = '/images/no_image.png';
     return userUploadedImage || defaultAvatar;
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

// UNIFIED Search Results Display Function
function showSearchResultsDropdown(results, resultType = 'course') {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        resultsContainer.classList.remove('hidden');
        results.forEach(result => {
            let resultItem; // Declare outside the if/else

            if (resultType === 'internship') {
                // For internships, create a DIV and add separate links inside
                resultItem = document.createElement('div'); // Use a DIV instead of A
                resultItem.className = 'search-result-item internship-result'; // Add specific class
                resultItem.style.display = 'flex';
                resultItem.style.flexDirection = 'column'; // Stack elements vertically
                resultItem.style.alignItems = 'stretch';  // Stretch items horizontally
                resultItem.style.gap = '10px'; // Gap between elements

                let detailsText = `${result.roles || ''}`; // Simplified details

                resultItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 10px 15px;"> {/* Top section */}
                        <img src="${result.image || '/images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; font-size: 1em; font-weight: 600; color: var(--dark);">${escapeHTML(result.title)}</h4>
                            <p style="margin: 2px 0 0; font-size: 0.9em; color: var(--gray);">${escapeHTML(detailsText)}</p>
                        </div>
                    </div>
                    <div class="search-result-actions" style="display: flex; justify-content: space-around; padding: 5px 15px 10px;"> {/* Bottom section for links */}
                        <a href="${result.practiceTestUrl || '#'}" class="search-action-link btn btn-outline" style="padding: 6px 12px; font-size: 0.85em; flex-grow: 1; margin: 0 5px; text-align: center;">Practice Test</a>
                        <a href="${result.finalExamUrl || '#'}" class="search-action-link btn btn-primary" style="padding: 6px 12px; font-size: 0.85em; flex-grow: 1; margin: 0 5px; text-align: center;">Final Exam</a>
                    </div>
                `;
            } else {
                // For courses, keep the original behavior (whole item is a link)
                resultItem = document.createElement('a');
                resultItem.href = result.url || '#';
                resultItem.className = 'search-result-item course-result'; // Add specific class
                resultItem.style.display = 'flex';
                resultItem.style.alignItems = 'center';
                resultItem.style.gap = '15px';
                resultItem.style.textDecoration = 'none';
                resultItem.style.color = 'inherit';

                let detailsText = result.instructor || '';

                resultItem.innerHTML = `
                    <img src="${result.image || '/images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                    <div style="flex-grow: 1;">
                        <h4 style="margin: 0; font-size: 1em; font-weight: 600; color: var(--dark);">${escapeHTML(result.title)}</h4>
                        <p style="margin: 2px 0 0; font-size: 0.9em; color: var(--gray);">${escapeHTML(detailsText)}</p>
                    </div>
                `;
            }

            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `<p style="padding: 15px; text-align: center; color: var(--gray);">No ${resultType === 'internship' ? 'internships' : 'courses'} found.</p>`;
    }
}

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}


// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    const isOnInternshipPage = window.location.pathname.includes('/intern/internship.html');
    const isOnCoursePage = window.location.pathname.includes('/courses/course.html');
    const isOnBlogIndexPage = window.location.pathname.includes('/blog/index.html');
    const isOnBlogPostPage = window.location.pathname.includes('/blog/post.html');
    const isOnBlogCreatePage = window.location.pathname.includes('/blog/create.html');

    // --- Modal, Auth, Profile, Hamburger, Notes, Seats Popup, Slider ---
    // (Keep all these the same as previous complete version)
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
    async function signInWithGoogle() { try { await auth.signInWithPopup(googleProvider); if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; } catch (error) { if(loginError) showError(loginError, error.message); if(signupError) showError(signupError, error.message); } }
    if (emailLoginBtn && loginEmail && loginPassword && loginError && loginLoading) { emailLoginBtn.addEventListener('click', async () => { /* ... */ }); loginPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailLoginBtn.click(); }); }
    if (emailSignupBtn && signupEmail && signupPassword && signupError && signupLoading) { emailSignupBtn.addEventListener('click', async () => { /* ... */ }); signupPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailSignupBtn.click(); }); }
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);
    const handleLogout = async () => { try { await auth.signOut(); } catch (error) { console.error('Logout error:', error); } };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);
    // ... (Profile Management listeners - Tabs, Edit, Save, Image Preview) ...
    function updateProfileUI(profileData) {
        const avatarUrl = profileData.photoUrl || '/images/no_image.png';
        if (userAvatarHeader) userAvatarHeader.src = avatarUrl;
        if (userAvatarDashboard) userAvatarDashboard.src = avatarUrl;
        if (userAvatarPreview) userAvatarPreview.src = avatarUrl;
        if (userNameDashboard) userNameDashboard.textContent = profileData.name || 'User';
        if (userEmailDashboard) userEmailDashboard.textContent = profileData.email;
        const genderDisplay = document.getElementById('profileGenderDisplay');
        const domainDisplay = document.getElementById('profileDomainDisplay');
        if (genderDisplay) genderDisplay.textContent = profileData.gender || 'Not specified';
        if (domainDisplay) domainDisplay.textContent = profileData.interestedDomain || 'Not specified';
     }
    if (tabButtons.length > 0) { tabButtons.forEach(button => { button.addEventListener('click', () => { /* ... */ }); }); const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]'); if (profileTabBtn) profileTabBtn.classList.add('active'); }
    if (editProfileBtn && profileDisplaySection && profileEditSection) { editProfileBtn.addEventListener('click', () => { /* ... prefill logic ... */ }); }
    if(profileImageInput && userAvatarPreview) { profileImageInput.addEventListener('change', handleImagePreview); }
    if (saveProfileBtn && profileName && profileGender && interestedDomain && profileImageInput) { saveProfileBtn.addEventListener('click', async () => { /* ... save logic ... */ }); }
    // ... (Notes listeners - Save, Delete, Listener Setup) ...
    if (saveDataBtn && dataInput) { /* ... save note logic ... */ }
    window.deleteData = async function(docId) { /* ... delete note logic ... */ };
    let notesUnsubscribe = null;
    function setupDataListener() { /* ... note listener logic ... */ }
    // ... (Seats Popup function) ...
    function showSeatsPopup(domain, seats) { /* ... */ }
    // ... (Slider listeners) ...
    const sliderWrapper = document.querySelector('.hero-image-slider .slider-wrapper');
    if (sliderWrapper) { /* ... */ }

    // --- UNIFIED Search Functionality ---
    if (searchInput) {
        let searchDataSource = [];
        let resultType = 'course';
        let placeholderText = "Search for courses...";

        if (isOnInternshipPage) {
            searchDataSource = allInternships;
            resultType = 'internship';
            placeholderText = "Search for internships...";
        } else {
            const combinedCourses = [...allCourses, ...popularCourses];
            searchDataSource = Array.from(new Map(combinedCourses.map(course => [course.url || course.title, course])).values());
            resultType = 'course';
            placeholderText = "Search for courses...";
        }

        searchInput.placeholder = placeholderText;

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

        searchInput.addEventListener('input', () => {
             const query = searchInput.value.trim();
             const resultsContainer = document.getElementById('searchResults');
             if (query.length > 1) {
                 const filteredResults = filterItems(query, searchDataSource, resultType);
                 showSearchResultsDropdown(filteredResults, resultType);
             } else {
                 if (resultsContainer) resultsContainer.classList.add('hidden');
             }
        });
    }

    // --- Click Outside Search to Close ---
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const searchResultsContainer = document.getElementById('searchResults');
        let clickedInsideSearch = searchContainer && searchContainer.contains(e.target);
        let clickedInsideResults = searchResultsContainer && searchResultsContainer.contains(e.target);

        if (!clickedInsideSearch && !clickedInsideResults) {
            if (searchInput) searchInput.value = '';
            if (searchResultsContainer) searchResultsContainer.classList.add('hidden');
        }
    });

    // --- General Styling / Initial Load Effects ---
    const header = document.querySelector('header');
    if(header) { window.addEventListener('scroll', function() { /* ... */ }); }

    // --- RENDER COURSES (If on course listing page) ---
    if (isOnCoursePage && coursesGrid && typeof allCourses !== 'undefined' && allCourses.length > 0) {
        renderCourses(allCourses);
    }

    // --- Mobile Button Fixes ---
    const loginBtnMobile = document.getElementById('loginBtnHeaderMobile');
    const signupBtnMobile = document.getElementById('signupBtnHeaderMobile');
    const closeHamburgerMenu = () => { if (navMenu && hamburgerMenu) { navMenu.classList.remove('active'); hamburgerMenu.classList.remove('active'); } };
    if (loginBtnMobile) { loginBtnMobile.addEventListener('click', (e) => { e.preventDefault(); if (authModal && loginSection && signupSection) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; signupSection.classList.remove('active'); loginSection.classList.add('active'); closeHamburgerMenu(); } }); }
    if (signupBtnMobile) { signupBtnMobile.addEventListener('click', (e) => { e.preventDefault(); if (authModal && loginSection && signupSection) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; loginSection.classList.remove('active'); signupSection.classList.add('active'); closeHamburgerMenu(); } }); }

    // ====== BLOG FUNCTIONS ======

    // --- BLOG LISTING PAGE LOGIC ---
    const blogPostList = document.getElementById('blogPostList');
    const loadingPosts = document.getElementById('loadingPosts');
    const createPostBtn = document.getElementById('createPostBtn');

    if (isOnBlogIndexPage && blogPostList && loadingPosts) {
        db.collection('blogPosts')
          .where('approved', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(20)
          .get()
          .then(snapshot => {
              loadingPosts.style.display = 'none';
              if (snapshot.empty) {
                  blogPostList.innerHTML = '<p style="text-align: center;">No blog posts published yet.</p>';
                  return;
              }
              snapshot.forEach(doc => {
                  const post = doc.data();
                  const postId = doc.id;
                  const postCard = document.createElement('div');
                  postCard.className = 'blog-post-card';
                  const date = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date unknown';

                  postCard.innerHTML = `
                      ${post.imageUrl ? `<div class="blog-card-image"><img src="${escapeHTML(post.imageUrl)}" alt="${escapeHTML(post.title)}"></div>` : ''}
                      <div class="blog-card-content">
                          <a href="/blog/post.html?id=${postId}" class="blog-card-title">${escapeHTML(post.title)}</a>
                          <p class="blog-card-excerpt">${escapeHTML(post.excerpt)}</p>
                          <div class="blog-card-meta">
                              <span><i class="fas fa-user"></i> ${escapeHTML(post.authorName || 'Internadda Team')}</span>
                              <span><i class="fas fa-calendar-alt"></i> ${date}</span>
                          </div>
                      </div>
                  `;
                  blogPostList.appendChild(postCard);
              });
          })
          .catch(error => {
              console.error("Error fetching blog posts:", error);
              loadingPosts.textContent = 'Error loading posts.';
          });

         auth.onAuthStateChanged(user => {
            if (user && createPostBtn) {
                createPostBtn.href = "/blog/create.html";
                createPostBtn.classList.remove('hidden');
            } else if (createPostBtn) {
                 createPostBtn.classList.add('hidden');
            }
         });
    }

    // --- SINGLE POST PAGE LOGIC ---
    const blogPostFull = document.getElementById('blogPostFull');
    const loadingPost = document.getElementById('loadingPost');

    if (isOnBlogPostPage && blogPostFull && loadingPost) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        if (!postId) {
            loadingPost.textContent = 'Error: Post ID not found.';
        } else {
            db.collection('blogPosts').doc(postId).get()
              .then(doc => {
                  if (doc.exists && doc.data().approved === true) {
                      loadingPost.style.display = 'none';
                      const post = doc.data();
                      const date = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date unknown';

                      document.title = `${post.title || 'Blog Post'} | Internadda Blog`;
                      const metaDesc = document.querySelector('meta[name="description"]');
                      if (metaDesc) metaDesc.setAttribute('content', post.excerpt || `Read the full article: ${post.title}`);

                      blogPostFull.innerHTML = `
                          <h1 class="blog-post-title">${escapeHTML(post.title)}</h1>
                          <div class="blog-post-meta">
                              <span><i class="fas fa-user"></i> ${escapeHTML(post.authorName || 'Internadda Team')}</span>
                              <span><i class="fas fa-calendar-alt"></i> ${date}</span>
                          </div>
                          ${post.imageUrl ? `<div class="blog-post-image"><img src="${escapeHTML(post.imageUrl)}" alt="${escapeHTML(post.title)}"></div>` : ''}
                          <div class="blog-post-content">
                              ${post.content} {/* WARNING: Assumes content is safe HTML. Sanitize if needed. */}
                          </div>
                      `;
                  } else {
                      loadingPost.textContent = 'Error: Post not found or not approved.';
                  }
              })
              .catch(error => {
                  console.error("Error fetching single post:", error);
                  loadingPost.textContent = 'Error loading post.';
              });
        }
    }

    // --- CREATE POST PAGE LOGIC ---
    const createPostForm = document.getElementById('createPostForm');
    const loginPrompt = document.getElementById('loginPrompt');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const submissionStatus = document.getElementById('submissionStatus');

    if (isOnBlogCreatePage && createPostForm && loginPrompt && submitPostBtn && submissionStatus) {
        auth.onAuthStateChanged(user => {
            if (user) {
                loginPrompt.classList.add('hidden');
                createPostForm.classList.remove('hidden');
            } else {
                loginPrompt.classList.remove('hidden');
                createPostForm.classList.add('hidden');
            }
        });

        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) { showError(submissionStatus, 'Error: You must be logged in.'); return; }

            const title = document.getElementById('postTitle').value.trim();
            const excerpt = document.getElementById('postExcerpt').value.trim();
            const imageUrl = document.getElementById('postImageUrl').value.trim();
            const content = document.getElementById('postContent').value.trim();

            if (!title || !excerpt || !content) { showError(submissionStatus, 'Error: Title, Excerpt, and Content are required.'); return; }

            submitPostBtn.disabled = true; submitPostBtn.textContent = 'Submitting...';
            submissionStatus.textContent = ''; // Clear previous message explicitly
            submissionStatus.style.color = 'var(--primary)'; // Reset color

            try {
                await db.collection('pendingBlogPosts').add({
                    title: title, excerpt: excerpt, content: content,
                    imageUrl: imageUrl || null, authorId: user.uid,
                    authorName: user.displayName || user.email || 'Anonymous User', // Use email as fallback
                    authorEmail: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), approved: false
                });
                submissionStatus.textContent = 'Success! Your post has been submitted for review.'; // Use textContent for safety
                submissionStatus.style.color = 'var(--success)';
                createPostForm.reset();
            } catch (error) {
                console.error("Error submitting post:", error);
                showError(submissionStatus, 'Error submitting post. Please try again.'); // Use showError
            } finally {
                submitPostBtn.disabled = false; submitPostBtn.textContent = 'Submit Post for Review';
            }
        });

        const loginLink = document.getElementById('loginLinkInPrompt');
        const signupLink = document.getElementById('signupLinkInPrompt');
        if (loginLink) loginLink.addEventListener('click', (e) => { e.preventDefault(); if (loginBtnHeader) loginBtnHeader.click(); });
        if (signupLink) signupLink.addEventListener('click', (e) => { e.preventDefault(); if (signupBtnHeader) signupBtnHeader.click(); });
    }
    // ====== END BLOG FUNCTIONS ======


}); // End DOMContentLoaded


// --- Auth State Observer (Handles profile updates and showing/hiding auth elements) ---
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


console.log('🚀 Internadda Script Loaded! (Blog + Unified Search + Internship Links)');
