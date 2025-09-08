// ---------------------------------------------
// Firebase Auth & Firestore Logic
// ---------------------------------------------

// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDYYx46KEkHSA78xHMo8lYS8tKqYrLZK-w",
    authDomain: "skillpoint-c3e39.firebaseapp.com",
    projectId: "skillpoint-c3e39",
    storageBucket: "skillpoint-c3e39.firebasestorage.app",
    messagingSenderId: "984664107678",
    appId: "1:984664107678:web:af02e53e532d4e57f0298f",
    measurementId: "G-390K2B4HC7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
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

// Form inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const dataInput = document.getElementById('dataInput');

// Dashboard elements
const userAvatarDashboard = document.getElementById('userAvatarDashboard');
const userNameDashboard = document.getElementById('userNameDashboard');
const userEmailDashboard = document.getElementById('userEmailDashboard');
const userDataList = document.getElementById('userDataList');

// Loading and Error Elements
const loginLoading = document.getElementById('loginLoading');
const signupLoading = document.getElementById('signupLoading');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// Utility Functions
function showSection(sectionElement) {
    document.querySelectorAll('.auth-section').forEach(s => s.classList.remove('active'));
    sectionElement.classList.add('active');
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function showLoading(element, show) {
    element.style.display = show ? 'block' : 'none';
}

// Event Listeners for Modal
loginBtnHeader.addEventListener('click', () => {
    authModal.classList.add('active');
    showSection(loginSection);
});

signupBtnHeader.addEventListener('click', () => {
    authModal.classList.add('active');
    showSection(signupSection);
});

closeModalBtn.addEventListener('click', () => {
    authModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
    }
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(signupSection);
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(loginSection);
});

userProfile.addEventListener('click', () => {
    userDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!userProfile.contains(e.target) && userDropdown.classList.contains('active')) {
        userDropdown.classList.remove('active');
    }
});

// Email Login
emailLoginBtn.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
    }

    showLoading(loginLoading, true);
    emailLoginBtn.disabled = true;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        authModal.classList.remove('active');
    } catch (error) {
        showError(loginError, error.message);
    } finally {
        showLoading(loginLoading, false);
        emailLoginBtn.disabled = false;
    }
});

// Email Signup
emailSignupBtn.addEventListener('click', async () => {
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (!email || !password) {
        showError(signupError, 'Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError(signupError, 'Password must be at least 6 characters');
        return;
    }

    showLoading(signupLoading, true);
    emailSignupBtn.disabled = true;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        authModal.classList.remove('active');
    } catch (error) {
        showError(signupError, error.message);
    } finally {
        showLoading(signupLoading, false);
        emailSignupBtn.disabled = false;
    }
});

// Google Login/Signup
async function signInWithGoogle() {
    try {
        await auth.signInWithPopup(googleProvider);
        authModal.classList.remove('active');
    } catch (error) {
        showError(loginError, error.message);
        showError(signupError, error.message);
    }
}

googleLoginBtn.addEventListener('click', signInWithGoogle);
googleSignupBtn.addEventListener('click', signInWithGoogle);

// Logout
const handleLogout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
};

logoutBtnHeader.addEventListener('click', handleLogout);
logoutBtnModal.addEventListener('click', handleLogout);

// Save Data
saveDataBtn.addEventListener('click', async () => {
    const data = dataInput.value.trim();
    const user = auth.currentUser;

    if (!data || !user) return;

    saveDataBtn.disabled = true;
    saveDataBtn.textContent = 'Saving...';

    try {
        await db.collection('userData').add({
            userId: user.uid,
            data: data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        dataInput.value = '';
    } catch (error) {
        console.error('Error saving data:', error);
    } finally {
        saveDataBtn.disabled = false;
        saveDataBtn.textContent = '💾 Save';
    }
});

// Load User Data
function setupDataListener() {
    const user = auth.currentUser;
    if (!user) {
        userDataList.innerHTML = '';
        return;
    }

    const userNotesRef = db.collection('userData').where('userId', '==', user.uid).orderBy('timestamp', 'desc').limit(10);

    userNotesRef.onSnapshot(snapshot => {
        userDataList.innerHTML = '';
        if (snapshot.empty) {
            userDataList.innerHTML = '<p class="no-data-message">No notes saved yet. Add your first note above!</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <span>${data.data}</span>
                <button onclick="window.deleteData('${doc.id}')">Delete</button>
            `;
            userDataList.appendChild(item);
        });
    }, err => {
        console.error('Error getting real-time data:', err);
    });
}

// Delete Data
window.deleteData = async function(docId) {
    try {
        await db.collection('userData').doc(docId).delete();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');

        userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';
        userAvatarHeader.src = user.photoURL || `https://placehold.co/40x40/5624d0/ffffff?text=${user.email.charAt(0).toUpperCase()}`;

        userNameDashboard.textContent = `Welcome, ${user.displayName ? user.displayName.split(' ')[0] : 'User'}!`;
        userEmailDashboard.textContent = user.email;
        userAvatarDashboard.src = user.photoURL || `https://placehold.co/80x80/5624d0/ffffff?text=${user.email.charAt(0).toUpperCase()}`;

        if (authModal.classList.contains('active')) {
            showSection(dashboardSection);
        }

        setupDataListener();

        // Clear forms
        loginEmail.value = '';
        loginPassword.value = '';
        signupEmail.value = '';
        signupPassword.value = '';
    } else {
        // User is signed out
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');

        if (authModal.classList.contains('active')) {
            showSection(loginSection);
        }
    }
});

// Enter key listeners for forms
loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') emailLoginBtn.click();
});

signupPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') emailSignupBtn.click();
});

dataInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveDataBtn.click();
});

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
    });

    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
});

// Add these to your existing JavaScript

// DOM Elements for mobile
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const loginBtnMobile = document.getElementById('loginBtnMobile');
const signupBtnMobile = document.getElementById('signupBtnMobile');
const searchContainer = document.querySelector('.search-container');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');

// Mobile Menu Toggle
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

mobileOverlay.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Mobile Auth Buttons
loginBtnMobile.addEventListener('click', () => {
    authModal.classList.add('active');
    showSection(loginSection);
    closeMobileMenu();
});

signupBtnMobile.addEventListener('click', () => {
    authModal.classList.add('active');
    showSection(signupSection);
    closeMobileMenu();
});

function closeMobileMenu() {
    hamburgerMenu.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Enhanced Search Functionality
searchIcon.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        }
    }
});

// Close search when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        searchContainer.classList.contains('active') && 
        !searchContainer.contains(e.target)) {
        searchContainer.classList.remove('active');
    }
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Improved window resize handling
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
    
    // Reset mobile menu and search on resize to desktop
    if (window.innerWidth > 1024) {
        closeMobileMenu();
        searchContainer.classList.remove('active');
    }
});

// Add this CSS for resize animation stopper
.resize-animation-stopper * {
    animation: none !important;
    transition: none !important;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Additional initialization for mobile
    if (window.innerWidth <= 768) {
        // Move search container for better mobile layout
        const headerActions = document.querySelector('.header-actions');
        headerActions.appendChild(searchContainer);
    }
});

console.log('🚀 SkillPoint with Firebase Auth loaded!');
