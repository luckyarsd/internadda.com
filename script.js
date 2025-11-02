// ---------------------------------------------
// Firebase Auth & Firestore Logic
// FIX: Implements functional login/signup, profile management, and progress tracking.
// ---------------------------------------------

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // NOTE: Using the provided hardcoded values for compatibility here.
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
    // Enable debug logging for Firestore for development/troubleshooting
    firebase.firestore.setLogLevel('debug');
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
const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
const editProfileBtn = document.getElementById('editProfileBtn');
const profileDisplaySection = document.getElementById('profileDisplaySection');
const profileEditSection = document.getElementById('profileEditSection');
const userAvatarPreview = document.getElementById('userAvatarPreview');
const profileImageInput = document.getElementById('profileImageInput');
const profileGenderDisplay = document.getElementById('profileGenderDisplay');
const profileDomainDisplay = document.getElementById('profileDomainDisplay');

// Loading and Error Elements
const loginLoading = document.getElementById('loginLoading');
const signupLoading = document.getElementById('signupLoading');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// --- Global State & Progress Tracking (FIRESTORE) ---
let currentUserId = null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Use provided global variable

// Firebase Path Helper (Private Data)
function getPrivateDataPath(userId, collectionName) {
    // Uses the required Firestore path format for private user data
    return `artifacts/${appId}/users/${userId}/${collectionName}`; 
}

/**
 * Saves or updates a user's progress for a specific course/internship.
 * @param {string} type 'course' or 'internship'
 * @param {string} identifier The course or internship title/ID
 * @param {object} progressData { progress: number (0-100), lastPage: number, completed: boolean, passedExam?: boolean }
 */
window.saveProgress = async function(type, identifier, progressData) {
    const user = auth.currentUser;
    if (!user) {
        console.warn('User not logged in. Cannot save progress.');
        return;
    }
    
    // Normalize identifier to be safe for Firestore document ID
    const docId = identifier.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(); 
    const path = getPrivateDataPath(user.uid, `${type}Progress`);

    try {
        await db.collection(path).doc(docId).set({
            ...progressData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            identifier: identifier // Keep the original title for display
        }, { merge: true });
        console.log(`Progress saved for ${identifier}`);
    } catch (error) {
        console.error("Error saving progress:", error);
    }
};

/**
 * Retrieves a user's progress for a specific course/internship.
 * @param {string} type 'course' or 'internship'
 * @param {string} identifier The course or internship title/ID
 * @returns {Promise<object | null>} Progress data or null
 */
window.loadProgress = async function(type, identifier) {
    const user = auth.currentUser;
    if (!user) {
        return null;
    }

    const docId = identifier.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const path = getPrivateDataPath(user.uid, `${type}Progress`);

    try {
        const doc = await db.collection(path).doc(docId).get();
        if (doc.exists) {
            return doc.data();
        }
    } catch (error) {
        console.error("Error loading progress:", error);
    }
    return null;
};


// --- Core Data Definitions (Needed for Search functionality) ---
const allCourses = [
    { title: 'Essential Data Science Intern Course', instructor: 'Instructed by Lucky Kumar', image: '../images/Essential Data Science Intern Course.png', url: "courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering Masterclass', instructor: 'Instructed by Lucky Kumar', image: '../images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Ethical Hacking Mastery', instructor: 'Instructed by Lucky Kumar', image: '../images/Ethical-Hacking-Mastery.png', url: "courses/Ethical-Hacking-Mastery.html" },
    { title: 'Python Essentials for All', instructor: 'Instructed by Lucky Kumar', image: '../images/Python-Essentials-for-All.png', url: "courses/Python-Essentials-for-All.html" },
    { title: 'Cloud Computing & DevOps Essentials', instructor: 'Instructed by Lucky Kumar', image: '../images/Cloud-DevOps-Essentials.png', url: "courses/Cloud-DevOps-Essentials.html" }
];

const allInternships = [
    { title: 'Data Science & Analytics', roles: 'Data Analyst, Data Scientist Intern', skills: 'Python, SQL, Tableau', image: '../images/test_data Science.png', practiceTestUrl: 'data_science_practice_test.html', finalExamUrl: 'payment_page_data_science.html' },
    { title: 'Artificial Intelligence & Machine Learning', roles: 'AI Intern, ML Intern', skills: 'Python, TensorFlow, ML Algorithms', image: '../images/test_Artificial Intelligence.png', practiceTestUrl: 'ai_ml_practice_test.html', finalExamUrl: 'payment_page_ai_ml.html' },
    { title: 'Python Development & Software Engineering', roles: 'Python Developer Intern, Backend Developer Intern', skills: 'Python, Flask/Django, SQL', image: '../images/test_Python Development.png', practiceTestUrl: 'python_dev_practice_test.html', finalExamUrl: 'payment_page_python.html' },
    { title: 'Cloud Computing & DevOps', roles: 'Cloud Engineer Intern, DevOps Intern', skills: 'AWS, Docker, CI/CD', image: '../images/test_Cloud Computing.png', practiceTestUrl: 'cloud_devops_practice_test.html', finalExamUrl: 'cloud_devops_final_exam.html' },
    { title: 'Cybersecurity & Ethical Hacking', roles: 'Security Analyst Intern, Ethical Hacking Intern', skills: 'Networking, Linux, Penetration Testing', image: '../images/test_Cybersecurity & Ethical Hacking.png', practiceTestUrl: 'cybersecurity_practice_test.html', finalExamUrl: 'cybersecurity_final_exam.html' },
    { title: 'Web & Mobile Development', roles: 'Frontend/Full-Stack Developer Intern', skills: 'HTML/CSS/JS, React, Flutter', image: '../images/test_Web & Mobile Development.png', practiceTestUrl: 'web_mobile_practice_test.html', finalExamUrl: 'web_mobile_final_exam.html' },
    { title: 'Blockchain & Web3', roles: 'Blockchain Developer Intern, Smart Contract Developer', skills: 'Solidity, Ethereum', image: '../images/test_Blockchain & Web3.png', practiceTestUrl: 'blockchain_practice_test.html', finalExamUrl: 'blockchain_final_exam.html' },
    { title: 'UI/UX & Product Design', roles: 'UI/UX Intern, Product Design Intern', skills: 'Figma, Wireframing', image: '../images/test_UIUX Design & Product Design.png', practiceTestUrl: 'uiux_practice_test.html', finalExamUrl: 'uiux_final_exam.html' },
    { title: 'Content Creation & Video Editing', roles: 'Content Creator Intern, Video Editing Intern', skills: 'Canva, CapCut, Adobe Premiere Pro, Scriptwriting', image: '../images/test_Content Creation & Video Editing.png', practiceTestUrl: 'content_creation_practice_test.html', finalExamUrl: 'content_creation_final_exam.html' },
    { title: 'Prompt Engineering Internship', roles: 'AI Prompt Engineer Intern, ChatGPT Specialist Intern', skills: 'ChatGPT, Midjourney, Generative AI, Prompt Design', image: '../images/test_Prompt Engineering.png', practiceTestUrl: 'prompt_engineering_practice_test.html', finalExamUrl: 'prompt_engineering_final_exam.html' },
    { title: 'Game Development Internship', roles: 'Game Developer Intern, Unity Developer Intern', skills: 'Unity, C#, Unreal Engine, Game Design', image: '../images/test_Game Development.png', practiceTestUrl: 'game_dev_practice_test.html', finalExamUrl: 'game_dev_final_exam.html' },
    { title: 'Digital Marketing & Growth Hacking', roles: 'Digital Marketing Intern, SEO/SEM Intern', skills: 'SEO, Content Marketing', image: '../images/test_Digital Marketing & Growth Hacking.png', practiceTestUrl: 'digital_marketing_practice_test.html', finalExamUrl: 'digital_marketing_final_exam.html' }
];
const popularCourses = [
    // This array uses relative paths based on index.html for image paths
    { title: 'Essential Data Science Intern Course', instructor: 'Created by AI', image: 'images/Essential Data Science Intern Course.png', url: "courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering Masterclass', instructor: 'Created by AI', image: 'images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Python Essentials for All', instructor: 'Created by AI', image: 'images/Python-Essentials-for-All.png', url: "courses/courses/Python-Essentials-for-All.html" },
    { title: 'Ethical Hacking Mastery', instructor: 'Created by AI', image: 'images/Ethical-Hacking-Mastery.png', url: "courses/courses/Ethical-Hacking-Mastery.html" },
];


// Function to get the correct avatar
function getAvatarUrl(userPhotoUrl) {
     return userPhotoUrl || '/images/no_image.png';
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

// UNIFIED Search Results Display Function - MODIFIED TO ENSURE BUTTON SIZING IN DROP DOWN
function showSearchResultsDropdown(results, resultType = 'course') {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = ''; 

    if (results.length > 0) {
        resultsContainer.classList.remove('hidden');
        results.forEach(result => {
            let resultItem; 

            if (resultType === 'internship') {
                resultItem = document.createElement('div');
                resultItem.className = 'search-result-item internship-result'; 

                const skillList = result.skills ? result.skills.split(',').map(s => `<span class="skill-tag" style="background:#e6fffa; color:var(--success); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">${s.trim()}</span>`).join('') : '';

                // NOTE: Hardcoding relative path /intern/ for search links to work on all pages
                const base = window.location.pathname.includes('/intern/') ? '' : 'intern/';

                resultItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 10px 15px;">
                        <img src="${result.image.replace('../', base ? '../' : '') || '/images/no_image.png'}" alt="${result.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; font-size: 0.95em; font-weight: 600; color: var(--dark);">${escapeHTML(result.title)}</h4>
                            <div style="margin: 2px 0 0; font-size: 0.8em; color: var(--gray);">${escapeHTML(result.roles)}</div>
                             <div class="skills-list">${skillList}</div>
                        </div>
                    </div>
                    <div class="search-result-actions" style="display: flex; justify-content: space-around; padding: 5px 15px 10px; border-top: 1px solid #eee;">
                        <a href="/intern/${result.practiceTestUrl || '#'}" class="search-action-link btn btn-outline" style="padding: 6px 12px; font-size: 0.75em; flex-grow: 1; margin: 0 5px; text-align: center;">Practice Test</a>
                        <a href="/intern/${result.finalExamUrl || '#'}" class="search-action-link btn btn-primary" style="padding: 6px 12px; font-size: 0.75em; flex-grow: 1; margin: 0 5px; text-align: center;">Final Exam</a>
                    </div>
                `;
            } else {
                resultItem = document.createElement('a');
                resultItem.href = result.url || '#';
                resultItem.className = 'search-result-item course-result'; 
                resultItem.style.display = 'flex';
                resultItem.style.alignItems = 'center';
                resultItem.style.gap = '15px';
                resultItem.style.textDecoration = 'none';
                resultItem.style.color = 'inherit';

                let detailsText = result.instructor || '';

                resultItem.innerHTML = `
                    <img src="${result.image.replace('../', '') || '/images/no_image.png'}" alt="${result.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                    <div style="flex-grow: 1;">
                        <h4 style="margin: 0; font-size: 0.95em; font-weight: 600; color: var(--dark);">${escapeHTML(result.title)}</h4>
                        <p style="margin: 2px 0 0; font-size: 0.8em; color: var(--gray);">${escapeHTML(detailsText)}</p>
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

// --- Authentication Logic Fixes ---

async function signInWithEmail(email, password, loadingEl, errorEl) {
    showLoading(loadingEl, true);
    showError(errorEl, '');
    try {
        await auth.signInWithEmailAndPassword(email, password);
        if(authModal) authModal.classList.remove('active');
        document.body.style.overflow = '';
    } catch (error) {
        console.error("Login error:", error);
        showError(errorEl, error.message.replace('Firebase: The email address is badly formatted.', 'Please enter a valid email address.'));
    } finally {
        showLoading(loadingEl, false);
    }
}

async function signUpWithEmail(email, password, loadingEl, errorEl) {
    showLoading(loadingEl, true);
    showError(errorEl, '');
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        const userDocRef = db.collection('userProfiles').doc(userCredential.user.uid);
        await userDocRef.set({
            name: userCredential.user.email.split('@')[0], 
            email: userCredential.user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            progress: {} 
        }, { merge: true });

        if(authModal) authModal.classList.remove('active');
        document.body.style.overflow = '';
    } catch (error) {
        console.error("Signup error:", error);
        showError(errorEl, error.message.replace('Firebase: The email address is badly formatted.', 'Please enter a valid email address.'));
    } finally {
        showLoading(loadingEl, false);
    }
}

async function signInWithGoogle() { 
    try { 
        await auth.signInWithPopup(googleProvider); 
        if(authModal) authModal.classList.remove('active'); 
        document.body.style.overflow = ''; 

        // If it's a new user, create profile entry
        const user = auth.currentUser;
        if (user) {
            const userDocRef = db.collection('userProfiles').doc(user.uid);
            const userDoc = await userDocRef.get();
            if (!userDoc.exists) {
                await userDocRef.set({
                    name: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    progress: {}
                }, { merge: true });
            }
        }
    } catch (error) { 
        if(loginError) showError(loginError, error.message); 
        if(signupError) showError(signupError, error.message); 
    } 
}

const handleLogout = async () => { 
    try { 
        await auth.signOut(); 
        // Force reload to clear all state and apply non-logged-in UI
        window.location.reload(); 
    } catch (error) { 
        console.error('Logout error:', error); 
    } 
};

// --- Profile Data Management ---

function updateProfileUI(profileData) {
    if(userAvatarHeader) userAvatarHeader.src = getAvatarUrl(profileData.photoUrl);
    if(userNameHeader) userNameHeader.textContent = profileData.name ? profileData.name.split(' ')[0] : (profileData.email ? profileData.email.split('@')[0] : 'User');

    // Dashboard UI updates
    if(userAvatarDashboard) userAvatarDashboard.src = getAvatarUrl(profileData.photoUrl);
    if(userNameDashboard) userNameDashboard.textContent = profileData.name || 'User Profile';
    if(userEmailDashboard) userEmailDashboard.textContent = profileData.email || 'N/A';
    
    // Display Section
    if(profileGenderDisplay) profileGenderDisplay.textContent = profileData.gender || 'Not specified';
    if(profileDomainDisplay) profileDomainDisplay.textContent = profileData.interestedDomain || 'Not specified';
}

function prefillEditProfile(profileData) {
    if(profileName) profileName.value = profileData.name || '';
    if(profileGender) profileGender.value = profileData.gender || '';
    if(interestedDomain) interestedDomain.value = profileData.interestedDomain || '';
    if(userAvatarPreview) userAvatarPreview.src = profileData.photoUrl || getAvatarUrl(null);
}

// Function to handle saving profile
async function handleSaveProfile() {
    const user = auth.currentUser;
    if (!user || !saveProfileBtn) return;

    saveProfileBtn.disabled = true;
    saveProfileBtn.textContent = 'Saving...';

    const newName = profileName.value.trim();
    const newGender = profileGender.value;
    const newDomain = interestedDomain.value;
    const imageFile = profileImageInput.files[0];

    try {
        let updateData = {
            name: newName,
            gender: newGender,
            interestedDomain: newDomain,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let newPhotoUrl = user.photoURL;
        if (imageFile) {
            // NOTE: Full image upload requires Firebase Storage and is skipped here. 
            console.warn("Image upload functionality requires Firebase Storage and is skipped. Using existing photo URL.");
        }
        
        await user.updateProfile({
            displayName: newName,
            photoURL: newPhotoUrl || user.photoURL 
        });

        const userDocRef = db.collection('userProfiles').doc(user.uid);
        await userDocRef.set(updateData, { merge: true });

        if(profileDisplaySection && profileEditSection) {
            profileEditSection.classList.add('hidden');
            profileDisplaySection.classList.remove('hidden');
            // Re-run auth observer to update UI globally
            setTimeout(() => auth.onAuthStateChanged(() => {}), 500); 
        }

    } catch (error) {
        console.error("Error saving profile:", error);
    } finally {
        saveProfileBtn.disabled = false;
        saveProfileBtn.textContent = 'Save Profile';
    }
}


// --- Notes/Data Listener (Keeps original structure for compatibility) ---
let notesUnsubscribe = null;
function setupDataListener() {
    if (notesUnsubscribe) notesUnsubscribe();

    const user = auth.currentUser;
    if (!user) {
        if(userDataList) userDataList.innerHTML = '<p>Please log in to see your notes.</p>';
        return;
    }

    const path = getPrivateDataPath(user.uid, 'notes');

    notesUnsubscribe = db.collection(path)
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            if (!userDataList) return;
            userDataList.innerHTML = ''; 

            if (snapshot.empty) {
                userDataList.innerHTML = '<p>No notes saved yet.</p>';
                return;
            }

            snapshot.forEach(doc => {
                const item = doc.data();
                const dataItem = document.createElement('div');
                dataItem.className = 'data-item';
                const date = item.timestamp ? item.timestamp.toDate().toLocaleDateString() : 'N/A';
                dataItem.innerHTML = `
                    <span>${escapeHTML(item.text)} <small style="color:var(--primary); margin-left: 10px;">(${date})</small></span>
                    <button onclick="deleteData('${doc.id}')">Delete</button>
                `;
                userDataList.appendChild(dataItem);
            });
        }, error => {
            console.error("Error setting up data listener:", error);
            if(userDataList) userDataList.innerHTML = '<p style="color:#c53030;">Error loading notes.</p>';
        });
}

// Function to handle saving note
if (saveDataBtn && dataInput) {
    saveDataBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user || !dataInput.value.trim()) return;

        saveDataBtn.disabled = true;
        saveDataBtn.textContent = 'Saving...';

        const text = dataInput.value.trim();
        const path = getPrivateDataPath(user.uid, 'notes');

        try {
            await db.collection(path).add({
                text: text,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            dataInput.value = ''; // Clear input on success
        } catch (error) {
            console.error("Error saving data:", error);
        } finally {
            saveDataBtn.disabled = false;
            saveDataBtn.textContent = '💾 Save';
        }
    });
}

// Global delete function for notes
window.deleteData = async function(docId) {
    const user = auth.currentUser;
    if (!user || !docId) return;

    const path = getPrivateDataPath(user.uid, 'notes');

    try {
        await db.collection(path).doc(docId).delete();
    } catch (error) {
        console.error("Error deleting document:", error);
    }
};

// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    const isOnInternshipPage = window.location.pathname.includes('/intern/internship.html');
    const isOnCoursePage = window.location.pathname.includes('/courses/course.html');
    const isOnBlogCreatePage = window.location.pathname.includes('/blog/create.html');


    // --- Modal, Auth, Profile, Hamburger ---
    if (loginBtnHeader) loginBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(loginSection) showSection(loginSection); document.body.style.overflow = 'hidden'; });
    if (signupBtnHeader) signupBtnHeader.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.add('active'); if(signupSection) showSection(signupSection); document.body.style.overflow = 'hidden'; });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if(authModal) authModal.classList.remove('active'); document.body.style.overflow = ''; });
    if (authModal) window.addEventListener('click', (e) => { if (e.target === authModal) { authModal.classList.remove('active'); document.body.style.overflow = ''; } });
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); if(signupSection) showSection(signupSection); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); if(loginSection) showSection(loginSection); });
    
    // Email Login
    if (emailLoginBtn && loginEmail && loginPassword && loginError && loginLoading) { 
        emailLoginBtn.addEventListener('click', () => signInWithEmail(loginEmail.value, loginPassword.value, loginLoading, loginError)); 
        loginPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailLoginBtn.click(); }); 
    }
    // Email Signup
    if (emailSignupBtn && signupEmail && signupPassword && signupError && signupLoading) { 
        emailSignupBtn.addEventListener('click', () => signUpWithEmail(signupEmail.value, signupPassword.value, signupLoading, signupError)); 
        signupPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailSignupBtn.click(); }); 
    }
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);

    // Profile Edit/Save
    if (editProfileBtn && profileDisplaySection && profileEditSection) { 
        editProfileBtn.addEventListener('click', () => { 
            // Read current displayed values for pre-filling
            prefillEditProfile({
                name: userNameDashboard.textContent,
                gender: profileGenderDisplay.textContent === 'Not specified' ? '' : profileGenderDisplay.textContent,
                interestedDomain: profileDomainDisplay.textContent === 'Not specified' ? '' : profileDomainDisplay.textContent,
                photoUrl: userAvatarPreview ? userAvatarPreview.src : null
            });
            profileDisplaySection.classList.add('hidden');
            profileEditSection.classList.remove('hidden');
        }); 
    }
    if(saveProfileBtn) saveProfileBtn.addEventListener('click', handleSaveProfile);
    if(profileImageInput && userAvatarPreview) profileImageInput.addEventListener('change', handleImagePreview);


    // ... (Header Dropdown listeners) ...
    if (userProfile) userProfile.addEventListener('click', (e) => { 
        e.stopPropagation(); // Prevents document click from closing it immediately
        if(userDropdown) userDropdown.classList.toggle('active'); 
    });
    document.addEventListener('click', (e) => { 
        if (userProfile && userDropdown && !userProfile.contains(e.target) && userDropdown.classList.contains('active')) {
             userDropdown.classList.remove('active'); 
        }
    });
    // ... (Profile Button listener) ...
    if (profileBtnHeader) profileBtnHeader.addEventListener('click', () => { 
        if(authModal) authModal.classList.add('active'); 
        if(dashboardSection) showSection(dashboardSection); 
        if(userDropdown) userDropdown.classList.remove('active'); 
        document.body.style.overflow = 'hidden'; 
        // Logic to show profile tab if tabs exist (assuming basic tab system in modal)
        const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]'); 
        if (profileTabBtn) profileTabBtn.click(); 
        else if (document.querySelectorAll('.tab-btn').length > 0) document.querySelectorAll('.tab-btn')[0].click(); 
    });
    // ... (Hamburger Menu listener) ...
    if (hamburgerMenu && navMenu) hamburgerMenu.addEventListener('click', () => { hamburgerMenu.classList.toggle('active'); navMenu.classList.toggle('active'); });
    
    // --- Mobile Auth Button Handlers (Needed if separate buttons exist outside the main header actions) ---
    const loginBtnMobile = document.getElementById('loginBtnHeaderMobile');
    const signupBtnMobile = document.getElementById('signupBtnHeaderMobile');
    const closeHamburgerMenu = () => { if (navMenu && hamburgerMenu) { navMenu.classList.remove('active'); hamburgerMenu.classList.remove('active'); } };
    if (loginBtnMobile) { loginBtnMobile.addEventListener('click', (e) => { e.preventDefault(); if (authModal && loginSection && signupSection) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; signupSection.classList.remove('active'); loginSection.classList.add('active'); closeHamburgerMenu(); } }); }
    if (signupBtnMobile) { signupBtnMobile.addEventListener('click', (e) => { e.preventDefault(); if (authModal && loginSection && signupSection) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; loginSection.classList.remove('active'); signupSection.classList.add('active'); closeHamburgerMenu(); } }); }

    // --- UNIFIED Search Functionality ---
    if (searchInput) {
        let searchDataSource = [];
        let resultType = 'course';
        let placeholderText = "Search for courses...";

        // Logic to determine which data source to use based on the current page path
        if (window.location.pathname.includes('/intern/')) {
            searchDataSource = allInternships;
            resultType = 'internship';
            placeholderText = "Search for internships...";
        } else {
            // Combine all course lists, prioritizing unique entries based on URL/title
            const combinedCourses = [...allCourses, ...popularCourses.map(c => ({...c, url: c.url}))];
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

    // --- BLOG CREATE PAGE LOGIC ---
    const createPostForm = document.getElementById('createPostForm');
    const loginPrompt = document.getElementById('loginPrompt');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const submissionStatus = document.getElementById('submissionStatus');
    const loginLink = document.getElementById('loginLinkInPrompt');
    const signupLink = document.getElementById('signupLinkInPrompt');

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
            submissionStatus.textContent = ''; 
            submissionStatus.style.color = 'var(--primary)'; 

            try {
                await db.collection('pendingBlogPosts').add({
                    title: title, excerpt: excerpt, content: content,
                    imageUrl: imageUrl || null, authorId: user.uid,
                    authorName: user.displayName || user.email || 'Anonymous User', 
                    authorEmail: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), approved: false
                });
                submissionStatus.textContent = 'Success! Your post has been submitted for review.'; 
                submissionStatus.style.color = 'var(--success)';
                createPostForm.reset();
            } catch (error) {
                console.error("Error submitting post:", error);
                showError(submissionStatus, 'Error submitting post. Please try again.'); 
            } finally {
                submitPostBtn.disabled = false;
                submitPostBtn.textContent = 'Submit Post for Review';
            }
        });

        if (loginLink) loginLink.addEventListener('click', (e) => { e.preventDefault(); if (loginBtnHeader) loginBtnHeader.click(); });
        if (signupLink) signupLink.addEventListener('click', (e) => { e.preventDefault(); if (signupBtnHeader) signupBtnHeader.click(); });
    }

}); // End DOMContentLoaded

// --- Auth State Observer (Handles profile updates and showing/hiding auth elements) ---
auth.onAuthStateChanged(async (user) => {
    currentUserId = user ? user.uid : null;
    
    if (user) {
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : (user.email ? user.email.split('@')[0] : 'User');
        
        const userDocRef = db.collection('userProfiles').doc(user.uid);
        
        try {
            const userDoc = await userDocRef.get();
            let profileData = { 
                name: user.displayName, 
                photoUrl: user.photoURL || '/images/no_image.png', 
                email: user.email 
            };

            if (userDoc.exists) {
                profileData = { ...profileData, ...userDoc.data() };
                profileData.photoUrl = profileData.photoUrl || user.photoURL || '/images/no_image.png';
            } else {
                 await userDocRef.set({
                    name: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL || '/images/no_image.png',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    progress: {}
                }, { merge: true });
            }

            updateProfileUI(profileData);
            
        } catch (error) {
             console.error("Error loading profile data:", error);
             updateProfileUI({ name: user.displayName, photoUrl: user.photoURL || '/images/no_image.png', email: user.email });
        }

        setupDataListener(); 

        if(loginEmail) loginEmail.value = ''; if(loginPassword) loginPassword.value = '';
        if(signupEmail) signupEmail.value = ''; if(signupPassword) signupPassword.value = '';

    } else {
        if(authButtons) authButtons.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');
        if (authModal && dashboardSection && loginSection && dashboardSection.classList.contains('active')) {
            showSection(loginSection); 
        }
         if(notesUnsubscribe) notesUnsubscribe();
         if(userDataList) userDataList.innerHTML = '<p>Please log in to see your notes.</p>';
    }
});


console.log('🚀 Internadda Script Loaded! (Auth/Progress/Search Initialized)');
