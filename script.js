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

// Course data for client-side search (for course.html)
// --- UPDATED PATHS ---
const allCourses = [
    { title: 'Data Science Intern Course', instructor: 'Instructed by Lucky Kumar', image: '/images/Essential Data Science Intern Course.png', url: "/courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Instructed by Lucky Kumar', image: '/images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "/courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Ethical Hacking Mastery', instructor: 'Instructed by Lucky Kumar', image: '/images/Ethical-Hacking-Mastery.png', url: "/courses/courses/Ethical-Hacking-Mastery.html" },
    { title: 'Python Essentials for All', instructor: 'Instructed by Lucky Kumar', image: '/images/Python-Essentials-for-All.png', url: "/courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cloud & DevOps Essentials', instructor: 'Instructed by Lucky Kumar', image: '/images/Cloud-DevOps-Essentials.png', url: "/courses/courses/Cloud-DevOps-Essentials.html" }
];

// Course data for index.html search
// --- UPDATED PATHS ---
const popularCourses = [
    { title: 'Data Science Intern Course', instructor: 'Created by AI', image: '/images/Essential Data Science Intern Course.png', url: "/courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Created by AI', image: '/images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "/courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Python Essentials for All', instructor: 'Created by AI', image: '/images/Python-Essentials-for-All.png', url: "/courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cybersecurity Fundamentals', instructor: 'Created by AI', image: '/images/Ethical-Hacking-Mastery.png', url: "/courses/courses/Ethical-Hacking-Mastery.html" },
];

const coursesGrid = document.getElementById('coursesGrid'); // Assuming this exists on course.html

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
                <img src="${course.image}" alt="${course.title}"> {/* Use the absolute image path */}
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
    // ... (keep existing generateStarRating function) ...
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>'; // Use far for empty stars
    return `<div class="rating-stars">${stars}</div>`;
}

// Function to get the correct avatar based on progress or user upload
function getAvatarUrl(progress, userUploadedImage) {
     // ... (keep existing getAvatarUrl function - Note: The placeholder.co URL is already absolute) ...
     // --- UPDATED PATH ---
     const defaultAvatar = '/images/no_image.png'; // Absolute path for default
     return userUploadedImage || defaultAvatar; // Use uploaded if available, else default
}

// Function to handle image preview from file input
function handleImagePreview(event) {
     // ... (keep existing handleImagePreview function) ...
     const file = event.target.files[0];
     if (file && userAvatarPreview) {
         const reader = new FileReader();
         reader.onload = (e) => { userAvatarPreview.src = e.target.result; };
         reader.readAsDataURL(file);
     }
}

// Function to check against the simulated Google Sheet for verification (Keep or remove if unused)
function checkVerificationStatus(userEmail, userName) {
    // ... (keep existing checkVerificationStatus function) ...
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
    setTimeout(() => { element.style.display = 'none'; }, 5000); // Hide after 5 seconds
}

function showLoading(element, show) {
    if (!element) return;
    element.style.display = show ? 'block' : 'none';
}

// Function to display search results
function showSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        resultsContainer.classList.remove('hidden');
        results.forEach(result => {
            const resultItem = document.createElement('a'); // Make item clickable
            resultItem.href = result.url || '#'; // Link to course URL (already absolute)
            resultItem.className = 'search-result-item'; // Use existing styles
            resultItem.style.display = 'flex'; // Ensure flex layout
            resultItem.style.alignItems = 'center';
            resultItem.style.gap = '15px';
            resultItem.style.textDecoration = 'none'; // Remove underline
            resultItem.style.color = 'inherit'; // Inherit text color

            // --- UPDATED PATH ---
            resultItem.innerHTML = `
                <img src="${result.image || '/images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;"> {/* Use absolute path */}
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0; font-size: 1em;">${result.title}</h4>
                    <p style="margin: 0; font-size: 0.9em; color: var(--gray);">${result.instructor}</p>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.classList.remove('hidden'); // Show container even for "no results"
        resultsContainer.innerHTML = '<p style="padding: 15px; text-align: center; color: var(--gray);">No results found.</p>';
    }
}


// --- Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', function() {

    // --- Modal Event Listeners ---
    if (loginBtnHeader) {
        loginBtnHeader.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            if(authModal) authModal.classList.add('active');
            if(loginSection) showSection(loginSection);
            document.body.style.overflow = 'hidden';
        });
    }
    if (signupBtnHeader) {
        signupBtnHeader.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            if(authModal) authModal.classList.add('active');
            if(signupSection) showSection(signupSection);
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if(authModal) authModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    if (authModal) {
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            if(signupSection) showSection(signupSection);
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if(loginSection) showSection(loginSection);
        });
    }

    // --- Header User Profile Dropdown ---
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            if(userDropdown) userDropdown.classList.toggle('active');
        });
    }
    // Close dropdown if clicking outside
    document.addEventListener('click', (e) => {
        if (userProfile && userDropdown && !userProfile.contains(e.target) && userDropdown.classList.contains('active')) {
            userDropdown.classList.remove('active');
        }
    });

    // --- Profile Button in Dropdown ---
    if (profileBtnHeader) {
        profileBtnHeader.addEventListener('click', () => {
            if(authModal) authModal.classList.add('active');
            if(dashboardSection) showSection(dashboardSection);
            if(userDropdown) userDropdown.classList.remove('active'); // Close dropdown
            document.body.style.overflow = 'hidden';
            // Ensure the profile tab is active when opening from header
             const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]');
             if (profileTabBtn) profileTabBtn.click();
        });
    }

    // --- Hamburger Menu ---
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- Authentication Logic ---
    // Email Login
    if (emailLoginBtn && loginEmail && loginPassword && loginError && loginLoading) {
        emailLoginBtn.addEventListener('click', async () => {
            const email = loginEmail.value.trim();
            const password = loginPassword.value;
            if (!email || !password) { showError(loginError, 'Please fill in all fields'); return; }
            showLoading(loginLoading, true); emailLoginBtn.disabled = true;
            try {
                await auth.signInWithEmailAndPassword(email, password);
                if(authModal) authModal.classList.remove('active'); document.body.style.overflow = '';
            } catch (error) { showError(loginError, error.message); }
            finally { showLoading(loginLoading, false); emailLoginBtn.disabled = false; }
        });
        loginPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailLoginBtn.click(); });
    }

    // Email Signup
    if (emailSignupBtn && signupEmail && signupPassword && signupError && signupLoading) {
        emailSignupBtn.addEventListener('click', async () => {
            const email = signupEmail.value.trim();
            const password = signupPassword.value;
            if (!email || !password) { showError(signupError, 'Please fill in all fields'); return; }
            if (password.length < 6) { showError(signupError, 'Password must be at least 6 characters'); return; }
            showLoading(signupLoading, true); emailSignupBtn.disabled = true;
            try {
                await auth.createUserWithEmailAndPassword(email, password);
                 if(authModal) authModal.classList.remove('active'); document.body.style.overflow = '';
            } catch (error) { showError(signupError, error.message); }
            finally { showLoading(signupLoading, false); emailSignupBtn.disabled = false; }
        });
         signupPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') emailSignupBtn.click(); });
    }

    // Google Login/Signup
    async function signInWithGoogle() {
        try {
            await auth.signInWithPopup(googleProvider);
            if(authModal) authModal.classList.remove('active'); document.body.style.overflow = '';
        } catch (error) {
           if(loginError) showError(loginError, error.message);
           if(signupError) showError(signupError, error.message);
        }
    }
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);

    // Logout
    const handleLogout = async () => {
        try { await auth.signOut(); } catch (error) { console.error('Logout error:', error); }
    };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);

    // --- Profile Management ---
    // Update Profile UI
    function updateProfileUI(profileData) {
        // --- UPDATED PATH ---
        const avatarUrl = profileData.photoUrl || '/images/no_image.png'; // Use absolute default path
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

    // Profile Tabs
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
             button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                const contentEl = document.getElementById(`${tab}TabContent`);
                if(contentEl) contentEl.classList.remove('hidden');
                // Special handling for profile tab to show display/edit correctly
                 if(tab === 'profile') {
                     if (profileEditSection && !profileEditSection.classList.contains('hidden')) {
                         // If edit is shown, keep it shown
                     } else if (profileDisplaySection) {
                          profileDisplaySection.classList.remove('hidden');
                          if (profileEditSection) profileEditSection.classList.add('hidden');
                     }
                 }
            });
        });
        // Set 'profile' as default active tab visually if dashboard is open
        const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]');
        if (profileTabBtn) profileTabBtn.classList.add('active'); // Default visual state
        // Actual content display happens in Auth state change or profileBtn click
    }


    // Edit Profile Button
    if (editProfileBtn && profileDisplaySection && profileEditSection) {
        editProfileBtn.addEventListener('click', () => {
            profileDisplaySection.classList.add('hidden');
            profileEditSection.classList.remove('hidden');
             // Pre-fill edit form (redundant if Auth state does it, but safe)
            const user = auth.currentUser;
            if(user && profileName) profileName.value = user.displayName || '';
            // Pre-filling gender/domain requires fetching from Firestore again or storing it locally
            // Example: Fetch and set from Firestore if needed here
            if (user) {
                db.collection('userProfiles').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        if(profileGender) profileGender.value = data.gender || '';
                        if(interestedDomain) interestedDomain.value = data.interestedDomain || '';
                    }
                }).catch(error => console.error("Error fetching profile for edit:", error));
            }
        });
    }

    // Image Preview
    if(profileImageInput && userAvatarPreview) {
        profileImageInput.addEventListener('change', handleImagePreview);
    }

    // Save Profile Button
    if (saveProfileBtn && profileName && profileGender && interestedDomain && profileImageInput) {
        saveProfileBtn.addEventListener('click', async () => {
             const user = auth.currentUser; if (!user) return;
             saveProfileBtn.disabled = true; saveProfileBtn.textContent = "Saving...";

             const displayName = profileName.value.trim();
             const gender = profileGender.value;
             const interestedDomainValue = interestedDomain.value;
             let photoURL = user.photoURL; // Start with current or default
             const file = profileImageInput.files[0];

             // --- Simulate Image Upload ---
             // In a real app, upload 'file' to Firebase Storage here and get the downloadURL
             if (file) {
                 photoURL = userAvatarPreview.src; // Use the preview src (won't work long term without real upload)
                 console.warn("Using preview URL. Implement Firebase Storage upload for persistence.");
                 // TODO: Replace with actual Firebase Storage upload
                 // const storageRef = firebase.storage().ref(`profileImages/${user.uid}/${file.name}`);
                 // const uploadTask = await storageRef.put(file);
                 // photoURL = await uploadTask.ref.getDownloadURL();
             } else {
                 // Try to keep existing Firestore URL if no new file and user had one
                 try {
                     const doc = await db.collection('userProfiles').doc(user.uid).get();
                     if (doc.exists && doc.data().photoUrl) {
                        photoURL = doc.data().photoUrl; // Keep existing Firestore URL
                     } else if (!photoURL) {
                        // --- UPDATED PATH ---
                        photoURL = '/images/no_image.png'; // Fallback to absolute default if nothing exists
                     }
                 } catch(e) { console.error("Error checking existing photoURL:", e); }
             }

             try {
                 // Update Auth Profile
                 await user.updateProfile({ displayName: displayName || user.displayName, photoURL: photoURL });

                 // Update Firestore
                 const userDocRef = db.collection('userProfiles').doc(user.uid);
                 await userDocRef.set({
                     name: displayName, gender: gender, photoUrl: photoURL, interestedDomain: interestedDomainValue,
                     lastUpdated: firebase.firestore.FieldValue.serverTimestamp(), email: user.email // Store email for easier lookup if needed
                 }, { merge: true });

                 alert('Profile saved successfully!');

                 // Show seats popup
                 if (interestedDomainValue) { showSeatsPopup(interestedDomainValue, Math.floor(Math.random() * 10) + 1); } // Random seats

                 // Switch back to display view
                 if (profileEditSection && profileDisplaySection) {
                     profileEditSection.classList.add('hidden');
                     profileDisplaySection.classList.remove('hidden');
                 }

                 // Refresh UI immediately with new data
                 updateProfileUI({ name: displayName, photoUrl: photoURL, email: user.email, gender: gender, interestedDomain: interestedDomainValue });

             } catch (error) { console.error('Error saving profile:', error); alert('Failed to save profile.'); }
             finally { saveProfileBtn.disabled = false; saveProfileBtn.textContent = "Save Profile"; }

        });
    }

    // --- Notes (User Data) Section ---
    if (saveDataBtn && dataInput) {
        saveDataBtn.addEventListener('click', async () => {
             const data = dataInput.value.trim(); const user = auth.currentUser; if (!data || !user) return;
             saveDataBtn.disabled = true; saveDataBtn.textContent = 'Saving...';
             try {
                 await db.collection('userData').add({ userId: user.uid, data: data, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
                 dataInput.value = '';
             } catch (error) { console.error('Error saving data:', error); }
             finally { saveDataBtn.disabled = false; saveDataBtn.textContent = '💾 Save'; }
        });
         dataInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') saveDataBtn.click(); });
    }

    // Delete Data (Make it globally accessible for inline onclick)
    window.deleteData = async function(docId) {
         if (!confirm("Are you sure you want to delete this note?")) return;
         try { await db.collection('userData').doc(docId).delete(); } catch (error) { console.error('Error deleting data:', error); }
    };

    // Load User Data/Notes Listener Setup
    let notesUnsubscribe = null; // To detach listener on logout
    function setupDataListener() {
        // Detach previous listener if exists
        if (notesUnsubscribe) { notesUnsubscribe(); notesUnsubscribe = null;}

        const user = auth.currentUser;
        if (!user || !userDataList) {
             if(userDataList) userDataList.innerHTML = '<p>Please log in to see your notes.</p>';
             return;
        }

        const userNotesRef = db.collection('userData').where('userId', '==', user.uid).orderBy('timestamp', 'desc').limit(15); // Increased limit

        // Attach new listener and store the unsubscribe function
        notesUnsubscribe = userNotesRef.onSnapshot(snapshot => {
             userDataList.innerHTML = '';
             if (snapshot.empty) {
                 userDataList.innerHTML = '<p>No notes yet. Add one above!</p>';
                 return;
             }
             snapshot.forEach(doc => {
                 const data = doc.data();
                 const item = document.createElement('div');
                 item.className = 'data-item';
                 item.innerHTML = `<span>${escapeHTML(data.data)}</span><button onclick="window.deleteData('${doc.id}')"><i class="fas fa-trash-alt"></i></button>`; // Added icon
                 userDataList.appendChild(item);
             });
         }, err => {
             console.error('Error getting notes:', err);
             userDataList.innerHTML = '<p>Error loading notes.</p>';
         });
    }

     // Helper to escape HTML to prevent XSS from notes
     function escapeHTML(str) {
         const div = document.createElement('div');
         div.appendChild(document.createTextNode(str));
         return div.innerHTML;
     }

    // --- Seats Popup ---
    function showSeatsPopup(domain, seats) {
        const existingPopup = document.querySelector('.seats-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.className = 'seats-popup';
        popup.innerHTML = `
            <i class="fas fa-times close-btn"></i>
            <div class="seats-popup-content">
                <i class="fa-solid fa-fire"></i>
                <p class="seats-popup-text">Only <span>${seats} seats</span> left for <span>${domain}</span> internship!</p>
            </div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);

        popup.querySelector('.close-btn').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        });
        // Auto-close after 8 seconds
        setTimeout(() => {
            if (popup && popup.classList.contains('show')) { // Check if still visible and exists
                 popup.classList.remove('show');
                 setTimeout(() => popup.remove(), 500);
            }
        }, 8000);
    }

    // --- Hero Slider ---
    const sliderWrapper = document.querySelector('.hero-image-slider .slider-wrapper');
    if (sliderWrapper) {
        const slides = sliderWrapper.querySelectorAll('.slide');
        const dotsContainer = sliderWrapper.nextElementSibling; // Assuming dots are immediately after
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
             if (!slides.length || !dots.length) return;
             slides.forEach((slide, i) => slide.style.opacity = (i === index) ? '1' : '0'); // Use opacity for fade
             dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        }
        function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
        function startSlider() { stopSlider(); slideInterval = setInterval(nextSlide, 5000); }
        function stopSlider() { clearInterval(slideInterval); }

        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => { stopSlider(); currentSlide = index; showSlide(currentSlide); startSlider(); });
            });
        }
        // Initial setup
        if (slides.length > 0) {
             slides.forEach((slide, i) => { // Basic styling for fade effect
                 slide.style.position = (i === 0) ? 'relative' : 'absolute';
                 slide.style.top = '0';
                 slide.style.left = '0';
                 slide.style.opacity = (i === 0) ? '1' : '0';
                 slide.style.transition = 'opacity 0.6s ease-in-out';
             });
             showSlide(0);
             startSlider();
        }
    }


    // --- Search Functionality ---
    function filterCourses(query) {
         const lowerCaseQuery = query.toLowerCase();
         // Combine all known courses for searching
         // Use the updated absolute paths from the arrays at the top
         const allAvailableCourses = [...allCourses, ...popularCourses];
         // Make sure courses have unique URLs or titles if combining, otherwise duplicates might appear.
         // A simple way to deduplicate if needed:
         const uniqueCourses = Array.from(new Map(allAvailableCourses.map(course => [course.url, course])).values());

         return uniqueCourses.filter(course =>
             (course.title && course.title.toLowerCase().includes(lowerCaseQuery)) ||
             (course.instructor && course.instructor.toLowerCase().includes(lowerCaseQuery))
         );
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => { // Live search
             const query = searchInput.value.trim();
             const resultsContainer = document.getElementById('searchResults');
             if (query.length > 1) { // Only search if query is > 1 char
                 const filteredResults = filterCourses(query);
                 showSearchResults(filteredResults);
             } else {
                 if (resultsContainer) resultsContainer.classList.add('hidden'); // Hide if query is short
             }
        });
    }

    // --- Click Outside Search to Close ---
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const searchResultsContainer = document.getElementById('searchResults');
        if (searchResultsContainer && searchContainer && !searchContainer.contains(e.target) && !searchResultsContainer.contains(e.target)) {
            if(searchInput) searchInput.value = ''; // Clear input
            searchResultsContainer.classList.add('hidden'); // Hide results
        }
    });

    // --- General Styling / Initial Load Effects ---
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', function() {
             if (window.scrollY > 10) { header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'; }
             else { header.style.boxShadow = 'var(--shadow)'; } // Revert to original shadow
        });
    }

    // --- RENDER COURSES (If on course page) ---
    // Make sure 'allCourses' is populated correctly if this script runs on course.html
    if (coursesGrid && typeof allCourses !== 'undefined' && allCourses.length > 0) {
        // Only render if we are likely on the course listing page (check if coursesGrid exists)
        renderCourses(allCourses);
    }

}); // End DOMContentLoaded


// --- Auth State Observer ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // --- User is signed in ---
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User'; // Show first name

        if (authModal && authModal.classList.contains('active')) {
            if(dashboardSection) showSection(dashboardSection);
            // Ensure the profile tab is active when opening dashboard
             const profileTabBtn = document.querySelector('.tab-btn[data-tab="profile"]');
             if (profileTabBtn) profileTabBtn.click();
             else if (tabButtons.length > 0) tabButtons[0].click(); // Fallback to first tab
        }

        // Load profile data from Firestore
        const userDocRef = db.collection('userProfiles').doc(user.uid);
        try {
            const userDoc = await userDocRef.get();
            // --- UPDATED PATH ---
            let profileData = { name: user.displayName, photoUrl: user.photoURL || '/images/no_image.png', email: user.email }; // Default to auth data + absolute default avatar

            if (userDoc.exists) {
                profileData = { ...profileData, ...userDoc.data() }; // Merge Firestore data
                 // Ensure photoUrl from Firestore isn't empty, otherwise use default
                 // --- UPDATED PATH ---
                 profileData.photoUrl = profileData.photoUrl || '/images/no_image.png';

                // Pre-fill edit form fields only if they exist on the page
                if(profileName) profileName.value = profileData.name || '';
                if(profileGender) profileGender.value = profileData.gender || '';
                if(interestedDomain) interestedDomain.value = profileData.interestedDomain || '';
            } else {
                 // Pre-fill edit form fields from auth if they exist
                 if(profileName) profileName.value = user.displayName || '';
                 // Ensure photoUrl is set even if no Firestore doc
                 // --- UPDATED PATH ---
                 profileData.photoUrl = profileData.photoUrl || '/images/no_image.png';
            }
            updateProfileUI(profileData); // Update header, dashboard display etc.

        } catch (error) {
             console.error("Error loading profile data:", error);
             // Fallback UI update using only auth data
             // --- UPDATED PATH ---
             updateProfileUI({ name: user.displayName, photoUrl: user.photoURL || '/images/no_image.png', email: user.email });
        }

        setupDataListener(); // Refresh notes listener

        // Clear login/signup forms (optional, but good practice)
        if(loginEmail) loginEmail.value = ''; if(loginPassword) loginPassword.value = '';
        if(signupEmail) signupEmail.value = ''; if(signupPassword) signupPassword.value = '';

    } else {
        // --- User is signed out ---
        if(authButtons) authButtons.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');
        if (authModal && authModal.classList.contains('active')) {
            if(loginSection) showSection(loginSection); // Show login by default if modal was open
        }
         if(notesUnsubscribe) notesUnsubscribe(); // Detach notes listener
         if(userDataList) userDataList.innerHTML = '<p>Please log in to see your notes.</p>'; // Clear notes display
    }
});


console.log('🚀 Internadda Script Loaded! (Paths Updated)');
