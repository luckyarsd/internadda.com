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
const header = document.querySelector('header'); // For scroll animation
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
const profileDisplaySection = document.getElementById('profileDisplaySection');
const profileEditSection = document.getElementById('profileEditSection');
const userAvatarPreview = document.getElementById('userAvatarPreview');
const profileImageInput = document.getElementById('profileImageInput');

// Dashboard Tabs (Request 1, 4 - Removed Settings)
const tabButtons = document.querySelectorAll('.tab-btn');
const tabsContent = {
    profile: document.getElementById('profileTabContent'),
    courses: document.getElementById('coursesTabContent'),
    internships: document.getElementById('internshipsTabContent'),
    notes: document.getElementById('notesTabContent'),
};

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

// --- Course Data (Full list, NO MOCK PROGRESS STATUS HERE) ---
const allCourses = [
    { title: 'Data Science Intern Course', instructor: 'Lucky Kumar', image: '/images/Essential Data Science Intern Course.png', url: "/courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Lucky Kumar', image: '/images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "/courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Ethical Hacking Mastery', instructor: 'Lucky Kumar', image: '/images/Ethical-Hacking-Mastery.png', url: "/courses/courses/Ethical-Hacking-Mastery.html" },
    { title: 'Python Essentials for All', instructor: 'Lucky Kumar', image: '/images/Python-Essentials-for-All.png', url: "/courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cloud & DevOps Essentials', instructor: 'Lucky Kumar', image: '/images/Cloud-DevOps-Essentials.png', url: "/courses/courses/Cloud-DevOps-Essentials.html" }
];
const popularCourses = [...allCourses]; // Simplified for demo purposes

// --- Internship Data (Full list, NO MOCK STATUS HERE) ---
const allInternships = [
    { title: 'Data Science & Analytics', roles: 'Data Analyst, Data Scientist Intern', skills: 'Python, SQL, Tableau', image: '/images/test_data Science.png', practiceTestUrl: '/intern/data_science_practice_test.html', finalExamUrl: '/intern/data_science_final_exam.html' },
    { title: 'Artificial Intelligence & Machine Learning', roles: 'AI Intern, ML Intern', skills: 'Python, TensorFlow, ML Algorithms', image: '/images/test_Artificial Intelligence.png', practiceTestUrl: '/intern/ai_ml_practice_test.html', finalExamUrl: '/intern/ai_ml_final_exam.html' },
    { title: 'Python Development & Software Engineering', roles: 'Python Developer Intern, Backend Developer Intern', skills: 'Python, Flask/Django, SQL', image: '/images/test_Python Development.png', practiceTestUrl: '/intern/python_dev_practice_test.html', finalExamUrl: '/intern/python_dev_final_exam.html' },
    { title: 'Web & Mobile Development', roles: 'Frontend/Full-Stack Developer Intern', skills: 'HTML/CSS/JS, React, Flutter', image: '/images/test_Web & Mobile Development.png', practiceTestUrl: '/intern/web_mobile_practice_test.html', finalExamUrl: '/intern/web_mobile_final_exam.html' },
    { title: 'Game Development Internship', roles: 'Game Developer Intern, Unity Developer Intern', skills: 'Unity, C#, Unreal Engine, Game Design', image: '/images/test_Game Development.png', practiceTestUrl: '/intern/game_dev_practice_test.html', finalExamUrl: '/intern/game_dev_final_exam.html' },
];

const coursesGrid = document.getElementById('coursesGrid'); // Reference for course listing page


// Helper function to create a URL-friendly slug
function createCourseSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
}

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
                <p class="course-author">${course.instructor}</p>
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

                // --- REMOVED HTML COMMENTS below ---
                resultItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 10px 15px;">
                        <img src="${result.image || '/images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; font-size: 1em; font-weight: 600; color: var(--dark);">${escapeHTML(result.title)}</h4>
                            <p style="margin: 2px 0 0; font-size: 0.9em; color: var(--gray);">${escapeHTML(detailsText)}</p>
                        </div>
                    </div>
                    <div class="search-result-actions" style="display: flex; justify-content: space-around; padding: 5px 15px 10px;">
                        <a href="${result.practiceTestUrl || '#'}" class="search-action-link btn btn-outline" style="padding: 6px 12px; font-size: 0.85em; flex-grow: 1; margin: 0 5px; text-align: center;">Practice Test</a>
                        <a href="${result.finalExamUrl || '#'}" class="search-action-link btn btn-primary" style="padding: 6px 12px; font-size: 0.85em; flex-grow: 1; margin: 0 5px; text-align: center;">Final Exam</a>
                    </div>
                `;
            } else {
                // ... (rest of the else block remains the same) ...
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


// Function to render Course tracking in Dashboard (Fixed Misleading Demo Data)
function renderCourseProgress(courses) {
    const coursesListContainer = document.getElementById('coursesListContainer');
    if (!coursesListContainer) return;

    coursesListContainer.innerHTML = '';
    
    // --- FIX: Simulating empty state for new user ---
    // In a real app, you would fetch Firestore: db.collection('userCourses').doc(user.uid).get()
    // For demo/new user, we display an empty state.
    const userCourses = []; // Simulate fetching empty array

    if (userCourses.length === 0) {
        coursesListContainer.innerHTML = '<p class="text-center" style="color: var(--gray); padding: 20px 0;">You are not currently enrolled in any courses. <a href="/courses/course.html" style="color: var(--primary); font-weight: 600;">Start learning now!</a></p>';
        return;
    }

    // This section remains for when real data exists, but won't run in the current demo setup.
    userCourses.forEach(course => {
        const statusColor = course.progress === 100 ? 'var(--success)' : 'var(--primary)';
        const certificateBtn = course.certificateUrl
            ? `<a href="${course.certificateUrl}" target="_blank" class="btn btn-outline" style="padding: 8px 15px; font-size: 0.9rem; border-color: var(--success); color: var(--success);">Certificate <i class="fas fa-download"></i></a>`
            : `<button class="btn btn-outline" disabled style="padding: 8px 15px; font-size: 0.9rem; color: var(--gray); border-color: #e2e8f0;">${100 - course.progress}% Remaining</button>`;

        const courseItem = document.createElement('div');
        courseItem.className = 'data-item';
        courseItem.style.padding = '15px 20px';
        courseItem.style.display = 'grid';
        courseItem.style.gridTemplateColumns = '2fr 1fr 1fr';
        courseItem.style.alignItems = 'center';
        courseItem.style.gap = '15px';

        courseItem.innerHTML = `
            <div style="text-align: left;">
                <h4 style="margin: 0; font-weight: 700; font-size: 1.1rem;"><a href="${course.url}" style="color: ${statusColor}; text-decoration: none;">${course.title}</a></h4>
                <p style="margin: 5px 0 0; font-size: 0.9rem; color: var(--gray);">${course.instructor}</p>
            </div>
            <div style="text-align: center;">
                <div style="font-weight: 600; font-size: 1rem; color: ${statusColor};">${course.progress}%</div>
                <div style="height: 5px; background: #e2e8f0; border-radius: 3px; margin-top: 5px;">
                    <div style="width: ${course.progress}%; height: 100%; background: ${statusColor}; border-radius: 3px;"></div>
                </div>
            </div>
            <div style="text-align: right;">
                ${certificateBtn}
            </div>
        `;
        coursesListContainer.appendChild(courseItem);
    });
}

// Function to render Internship tracking in Dashboard (Fixed Misleading Demo Data)
function renderInternshipHistory(internships) {
    const internshipsListContainer = document.getElementById('internshipsListContainer');
    if (!internshipsListContainer) return;

    internshipsListContainer.innerHTML = '';

    // --- FIX: Simulating empty state for new user ---
    const userInternships = []; // Simulate fetching empty array

    if (userInternships.length === 0) {
        internshipsListContainer.innerHTML = '<p class="text-center" style="color: var(--gray); padding: 20px 0;">No internship application or test history found. <a href="/intern/internship.html" style="color: var(--primary); font-weight: 600;">Start your application!</a></p>';
        return;
    }

    // This section remains for when real data exists, but won't run in the current demo setup.
    userInternships.forEach(internship => {
        let statusColor = 'var(--gray)';
        let resultTag = '';

        if (internship.result === 'Qualified') {
            statusColor = 'var(--success)';
            resultTag = `<span style="background: var(--success); color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem; font-weight: 600;">Qualified</span>`;
        } else if (internship.result === 'Not Qualified') {
            statusColor = '#e53e3e'; // Custom red for fail
            resultTag = `<span style="background: #fbb6b6; color: #c53030; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem; font-weight: 600;">Not Qualified</span>`;
        } else {
            resultTag = `<span style="background: #e2e8f0; color: var(--gray); padding: 4px 8px; border-radius: 5px; font-size: 0.85rem; font-weight: 600;">${internship.status}</span>`;
        }

        const internshipItem = document.createElement('div');
        internshipItem.className = 'data-item';
        internshipItem.style.padding = '15px 20px';
        internshipItem.style.display = 'grid';
        internshipItem.style.gridTemplateColumns = '2fr 1fr 1fr';
        internshipItem.style.alignItems = 'center';
        internshipItem.style.gap = '15px';

        internshipItem.innerHTML = `
            <div style="text-align: left;">
                <h4 style="margin: 0; font-weight: 700; font-size: 1.1rem; color: var(--dark);">${internship.title}</h4>
                <p style="margin: 5px 0 0; font-size: 0.9rem; color: var(--gray);">Result: ${internship.result || 'N/A'}</p>
            </div>
            <div style="text-align: center;">
                <p style="margin: 0; font-weight: 600; color: var(--dark);">${internship.score || 'N/A'}</p>
                <p style="margin: 2px 0 0; font-size: 0.85rem; color: var(--gray);">Final Exam Score</p>
            </div>
            <div style="text-align: right;">
                ${resultTag}
            </div>
        `;
        internshipsListContainer.appendChild(internshipItem);
    });
}


// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    const isOnInternshipPage = window.location.pathname.includes('/intern/internship.html');
    const isOnCoursePage = window.location.pathname.includes('/courses/course.html');
    const isOnBlogIndexPage = window.location.pathname.includes('/blog/index.html');
    const isOnBlogPostPage = window.location.pathname.includes('/blog/post.html');
    const isOnBlogCreatePage = window.location.pathname.includes('/blog/create.html');


    // --- Header Scroll Animation ---
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

    // --- Modal, Auth, Profile, Hamburger, Notes, Seats Popup, Slider (Simplified) ---
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
    
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', () => showError(loginError, "Demo mode: Email login/signup disabled. Use Google or check console for Firebase config."));
    if (emailSignupBtn) emailSignupBtn.addEventListener('click', () => showError(signupError, "Demo mode: Email login/signup disabled. Use Google or check console for Firebase config."));
    
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);
    const handleLogout = async () => { try { await auth.signOut(); } catch (error) { console.error('Logout error:', error); } };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);


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
    
    if (tabButtons.length > 0) { 
        tabButtons.forEach(button => { 
            button.addEventListener('click', () => { 
                const tab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                Object.values(tabsContent).forEach(content => { 
                    if(content) content.classList.add('hidden'); 
                });

                button.classList.add('active');
                if (tabsContent[tab]) tabsContent[tab].classList.remove('hidden');

                if (tab === 'courses') {
                    // FIX: Call render function without mock data to show accurate empty state
                    renderCourseProgress([]); 
                } else if (tab === 'internships') {
                    // FIX: Call render function without mock data to show accurate empty state
                    renderInternshipHistory([]); 
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
    
    if (saveDataBtn && dataInput) { /* ... save note logic ... */ }
    window.deleteData = async function(docId) { /* ... delete note logic ... */ };
    let notesUnsubscribe = null;
    function setupDataListener() { /* ... note listener logic ... */ }

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

    // ====== BLOG FUNCTIONS (omitted for brevity) ======


}); // End DOMContentLoaded


// --- Auth State Observer (Handles profile updates and showing/hiding auth elements) ---
auth.onAuthStateChanged(async (user) => {
    // FIX: Get user status and dynamically update profile tabs
    const coursesTabContent = document.getElementById('coursesTabContent');
    const internshipsTabContent = document.getElementById('internshipsTabContent');
    const notesTabContent = document.getElementById('notesTabContent');

    if (user) {
        // --- User is signed in ---
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';

        if (authModal && authModal.classList.contains('active')) {
            if(dashboardSection) showSection(dashboardSection);
             const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]');
             if (profileTabBtn) profileTabBtn.click();
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
         if(notesTabContent) notesTabContent.innerHTML = '<p class="text-center" style="padding: 20px;">Please log in to see your notes.</p>';
         if(coursesTabContent) coursesTabContent.innerHTML = '<p class="text-center" style="padding: 20px;">Please log in to view your courses.</p>';
         if(internshipsTabContent) internshipsTabContent.innerHTML = '<p class="text-center" style="padding: 20px;">Please log in to view your internship history.</p>';

         // Re-render dashboard content for logged-out state on active modal
         if (authModal && authModal.classList.contains('active')) {
             if(loginSection) showSection(loginSection);
         }
    }
});


console.log('🚀 Internadda Script Loaded! (Blog + Unified Search + Internship Links)');
