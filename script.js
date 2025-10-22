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
// const profilePhotoUrl = document.getElementById('profilePhotoUrl'); // Seems unused, maybe remove?
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
const allCourses = [
    // Populate this array if search is needed on course.html
];

// Course data for index.html search
const popularCourses = [
    { title: 'Data Science Intern Course', instructor: 'Created by AI', image: 'images/Essential Data Science Intern Course.png', url: "courses/courses/Essential Data Science Intern Course.html" },
    { title: 'Generative AI & Prompt Engineering', instructor: 'Created by AI', image: 'images/Generative-AI-Prompt-Engineering-Masterclass.png', url: "courses/courses/Generative-AI-Prompt-Engineering-Masterclass.html" },
    { title: 'Python Essentials for All', instructor: 'Created by AI', image: 'images/Python-Essentials-for-All.png', url: "courses/courses/Python-Essentials-for-All.html" },
    { title: 'Cybersecurity Fundamentals', instructor: 'Created by AI', image: 'images/Ethical-Hacking-Mastery.png', url: "courses/courses/Ethical-Hacking-Mastery.html" },
];

const coursesGrid = document.getElementById('coursesGrid'); // Assuming this exists on course.html
// const courseTitles = document.querySelectorAll('.course-title'); // Less flexible than filtering data

// Function to render courses (Used on course.html potentially)
function renderCourses(courses) {
    // ... (keep existing renderCourses function) ...
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    // ... (keep existing generateStarRating function) ...
}

// Function to get the correct avatar based on progress or user upload
function getAvatarUrl(progress, userUploadedImage) {
    // ... (keep existing getAvatarUrl function) ...
}

// Function to handle image preview from file input
function handleImagePreview(event) {
    // ... (keep existing handleImagePreview function) ...
}

// Function to check against the simulated Google Sheet for verification (Keep or remove if unused)
function checkVerificationStatus(userEmail, userName) {
    // ... (keep existing checkVerificationStatus function) ...
}

// Utility Functions
function showSection(sectionElement) {
    // ... (keep existing showSection function) ...
}

function showError(element, message) {
    // ... (keep existing showError function) ...
}

function showLoading(element, show) {
    // ... (keep existing showLoading function) ...
}

// Function to display search results
function showSearchResults(results) {
    // ... (keep existing showSearchResults function) ...
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
            // ... (keep existing email login logic) ...
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
            // ... (keep existing email signup logic) ...
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
        // ... (keep existing Google sign-in logic) ...
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
        // ... (keep existing logout logic) ...
        try { await auth.signOut(); } catch (error) { console.error('Logout error:', error); }
    };
    if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
    if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);

    // --- Profile Management ---
    // Update Profile UI
    function updateProfileUI(profileData) {
        // ... (keep existing updateProfileUI function) ...
         const avatarUrl = profileData.photoUrl || 'https://placehold.co/40x40/5624d0/ffffff?text=U';
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
            // ... (keep existing tab button logic) ...
             button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                const contentEl = document.getElementById(`${tab}TabContent`);
                if(contentEl) contentEl.classList.remove('hidden'); // .active class might be unnecessary
            });
        });
         // Activate the first tab by default if dashboard is shown
        if(dashboardSection && dashboardSection.classList.contains('active') && tabButtons.length > 0) {
             tabButtons[0].click();
        }
    }

    // Edit Profile Button
    if (editProfileBtn && profileDisplaySection && profileEditSection) {
        editProfileBtn.addEventListener('click', () => {
            // ... (keep existing edit profile button logic) ...
            profileDisplaySection.classList.add('hidden');
            profileEditSection.classList.remove('hidden');
             // Pre-fill edit form (redundant if Auth state does it, but safe)
            const user = auth.currentUser;
            if(user && profileName) profileName.value = user.displayName || '';
            // Pre-filling gender/domain requires fetching from Firestore again or storing it
        });
    }

    // Image Preview
    if(profileImageInput && userAvatarPreview) {
        profileImageInput.addEventListener('change', handleImagePreview);
    }
     function handleImagePreview(event) {
        // ... (keep existing handleImagePreview function) ...
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { userAvatarPreview.src = e.target.result; };
            reader.readAsDataURL(file);
        }
    }

    // Save Profile Button
    if (saveProfileBtn && profileName && profileGender && interestedDomain && profileImageInput) {
        saveProfileBtn.addEventListener('click', async () => {
            // ... (keep existing save profile logic) ...
             const user = auth.currentUser; if (!user) return;
             saveProfileBtn.disabled = true; saveProfileBtn.textContent = "Saving...";

             const displayName = profileName.value.trim();
             const gender = profileGender.value;
             const interestedDomainValue = interestedDomain.value;
             let photoURL = user.photoURL; // Start with current or default
             const file = profileImageInput.files[0];

             // --- Simulate Image Upload ---
             // In a real app, upload 'file' to Firebase Storage here and get the downloadURL
             // For now, if a file exists, we'll use a local preview URL (won't persist)
             if (file) {
                 photoURL = userAvatarPreview.src; // Use the preview src (won't work long term without real upload)
                 console.warn("Using preview URL. Implement Firebase Storage upload for persistence.");
             } else {
                 // Try to keep existing Firestore URL if no new file
                 try { const doc = await db.collection('userProfiles').doc(user.uid).get(); if (doc.exists) photoURL = doc.data().photoUrl || photoURL; } catch(e) {}
             }

             try {
                 // Update Auth Profile
                 await user.updateProfile({ displayName: displayName || user.displayName, photoURL: photoURL });

                 // Update Firestore
                 const userDocRef = db.collection('userProfiles').doc(user.uid);
                 await userDocRef.set({
                     name: displayName, gender: gender, photoUrl: photoURL, interestedDomain: interestedDomainValue,
                     lastUpdated: firebase.firestore.FieldValue.serverTimestamp(), email: user.email
                 }, { merge: true });

                 alert('Profile saved successfully!');

                 // Show seats popup
                 if (interestedDomainValue) { /* ... showSeatsPopup logic ... */ }

                 // Switch back to display view
                 if (profileEditSection && profileDisplaySection) {
                     profileEditSection.classList.add('hidden');
                     profileDisplaySection.classList.remove('hidden');
                 }

                 // Refresh UI
                 const updatedUserDoc = await userDocRef.get();
                 if (updatedUserDoc.exists) { updateProfileUI(updatedUserDoc.data()); }
                 else { updateProfileUI({ name: user.displayName, photoUrl: user.photoURL, email: user.email }); }

             } catch (error) { console.error('Error saving profile:', error); alert('Failed to save profile.'); }
             finally { saveProfileBtn.disabled = false; saveProfileBtn.textContent = "Save Profile"; }

        });
    }

    // --- Notes (User Data) Section ---
    if (saveDataBtn && dataInput) {
        saveDataBtn.addEventListener('click', async () => {
             // ... (keep existing save data logic) ...
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
        // ... (keep existing delete data logic) ...
         try { await db.collection('userData').doc(docId).delete(); } catch (error) { console.error('Error deleting data:', error); }
    };

    // Load User Data/Notes Listener Setup
    function setupDataListener() {
        // ... (keep existing setupDataListener function) ...
         const user = auth.currentUser; if (!user || !userDataList) { if(userDataList) userDataList.innerHTML = ''; return; }
         const userNotesRef = db.collection('userData').where('userId', '==', user.uid).orderBy('timestamp', 'desc').limit(10);
         userNotesRef.onSnapshot(snapshot => {
             userDataList.innerHTML = ''; if (snapshot.empty) { userDataList.innerHTML = '<p>No notes yet.</p>'; return; }
             snapshot.forEach(doc => {
                 const data = doc.data(); const item = document.createElement('div'); item.className = 'data-item';
                 item.innerHTML = `<span>${data.data}</span><button onclick="window.deleteData('${doc.id}')">Delete</button>`;
                 userDataList.appendChild(item);
             });
         }, err => { console.error('Error getting notes:', err); });
    }

    // --- Seats Popup ---
    function showSeatsPopup(domain, seats) {
        // ... (keep existing showSeatsPopup function) ...
        // Ensure only one popup exists
        const existingPopup = document.querySelector('.seats-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div'); popup.className = 'seats-popup';
        popup.innerHTML = `<i class="fas fa-times close-btn"></i><div class="seats-popup-content"><i class="fa-solid fa-fire"></i><p>Only <span>${seats} seats</span> left for <span>${domain}</span> internship!</p></div>`;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        popup.querySelector('.close-btn').addEventListener('click', () => { popup.classList.remove('show'); setTimeout(() => popup.remove(), 500); });
        // Optional: Auto-close after some time
        // setTimeout(() => { popup.classList.remove('show'); setTimeout(() => popup.remove(), 500); }, 8000);
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
             // Removed translateX as we are using opacity fade now
             // sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
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
        // ... (keep existing filterCourses function) ...
         const lowerCaseQuery = query.toLowerCase();
         const allAvailableCourses = [...allCourses, ...popularCourses]; // Combine lists for searching
         return allAvailableCourses.filter(course =>
             (course.title && course.title.toLowerCase().includes(lowerCaseQuery)) ||
             (course.instructor && course.instructor.toLowerCase().includes(lowerCaseQuery))
         );
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => { // Changed to 'input' for live search
             const query = searchInput.value.trim();
             const resultsContainer = document.getElementById('searchResults');
             if (query.length > 1) { // Only search if query is > 1 char
                 const filteredResults = filterCourses(query);
                 showSearchResults(filteredResults); // Assumes showSearchResults handles display
             } else {
                 if (resultsContainer) resultsContainer.classList.add('hidden'); // Hide if query is short
             }
        });
         // Keep Enter key functionality if needed
         searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { /* Optional: maybe navigate to a search page */ } });
    }
     // Modified showSearchResults to better fit live search style
     function showSearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        resultsContainer.innerHTML = ''; // Clear previous results

        if (results.length > 0) {
            resultsContainer.classList.remove('hidden');
            // Optional: Add heading
            // const heading = document.createElement('h3'); heading.textContent = 'Search Results'; resultsContainer.appendChild(heading);

            results.forEach(result => {
                const resultItem = document.createElement('a'); // Make item clickable
                resultItem.href = result.url || '#'; // Link to course URL
                resultItem.className = 'search-result-item'; // Use existing styles
                resultItem.style.display = 'flex'; // Ensure flex layout
                resultItem.style.alignItems = 'center';
                resultItem.style.gap = '15px';
                resultItem.style.textDecoration = 'none'; // Remove underline
                resultItem.style.color = 'inherit'; // Inherit text color


                resultItem.innerHTML = `
                    <img src="${result.image || 'images/no_image.png'}" alt="${result.title}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
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


    // --- Click Outside Search to Close ---
    document.addEventListener('click', (e) => {
        // ... (keep existing click outside search logic) ...
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
        // ... (keep existing header scroll shadow logic) ...
         window.addEventListener('scroll', function() { /* ... */ });
    }

    const courseCards = document.querySelectorAll('.course-card');
    if (courseCards.length > 0) {
        // ... (keep existing course card hover effect logic) ...
        courseCards.forEach(card => { /* ... */ });
    }

    // --- RENDER COURSES (If on course page) ---
    if (coursesGrid) { // Assuming coursesGrid is ONLY on course.html
        renderCourses(allCourses); // Render the list for the courses page
    }


// --- CASHFREE PAYMENT INTEGRATION (UPDATED SECTION) ---
    const payButton = document.getElementById('pay-btn'); // Button on exam pages
    const paymentMessage = document.getElementById('payment-message'); // Div for messages on exam page

    if (payButton) {
        if (typeof Cashfree === 'undefined') {
            // Handle case where Cashfree SDK didn't load
            console.error("Cashfree SDK not loaded! Payment button disabled.");
            if (paymentMessage) {
                paymentMessage.textContent = "Error loading payment library. Please refresh.";
                paymentMessage.style.color = '#c53030'; // Error color
            }
            payButton.disabled = true;
            payButton.textContent = 'Payment Unavailable';
        } else {
            // Cashfree SDK is loaded, proceed with setup
            const cashfree = new Cashfree();

            payButton.addEventListener('click', async () => {
                payButton.textContent = 'Processing...';
                payButton.disabled = true;
                if (paymentMessage) {
                    paymentMessage.textContent = 'Initiating secure payment...';
                    paymentMessage.style.color = 'var(--gray)'; // Neutral color
                }

                try {
                    // 1. Call your Vercel function to create the order
                    console.log("Calling /api/create-payment-order");
                    const orderResponse = await fetch('/api/create-payment-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        // Optionally send user details if logged in and needed by backend
                        // body: JSON.stringify({ email: auth.currentUser?.email }),
                    });

                    console.log("Order response status code:", orderResponse.status);

                    // --- Improved Response Handling ---
                    if (!orderResponse.ok) {
                        // Attempt to get error message from JSON response first
                        let errorMsg = `Server error ${orderResponse.status}. Please try again later.`;
                        try {
                            const errorData = await orderResponse.json();
                            // Use the error message from the backend's JSON response
                            errorMsg = errorData.error || errorData.details || `Payment initiation failed (${orderResponse.status}).`;
                            console.error("Order creation failed (JSON parsed):", errorData);
                        } catch (jsonError) {
                            // If response is not JSON (e.g., HTML error page or plain text)
                            const textResponse = await orderResponse.text(); // Read as text
                            errorMsg = `Payment initiation failed. Server responded unexpectedly.`; // Generic message for non-JSON
                            console.error("Order creation failed (Non-JSON response):", textResponse); // Log the raw text
                        }
                        throw new Error(errorMsg); // Throw the error to be caught below
                    }
                    // --- End Improved Response Handling ---

                    // If response is OK (2xx status), parse JSON
                    const orderData = await orderResponse.json();

                    // Check if the backend indicated success and returned session ID
                    if (!orderData.success || !orderData.payment_session_id) {
                        console.error("Session ID missing or backend reported failure:", orderData);
                        throw new Error(orderData.error || 'Payment session ID not received from server.');
                    }

                    const sessionId = orderData.payment_session_id;
                    console.log("Received Session ID:", sessionId);
                    // Optionally store order_id if needed: currentOrderId = orderData.order_id;

                    // 2. Use Cashfree SDK to start checkout
                    cashfree.checkout({
                        paymentSessionId: sessionId,
                    }).then((result) => {
                        console.log("Cashfree checkout result:", result);
                        if (result.error) {
                            console.error("Cashfree Checkout Error:", result.error);
                            if (paymentMessage) {
                                paymentMessage.textContent = "Payment Failed/Cancelled: " + (result.error.message || "Please try again.");
                                paymentMessage.style.color = '#c53030'; // Error color
                            }
                            // Re-enable button immediately on checkout error/cancel
                            payButton.textContent = 'Pay ₹99 Now';
                            payButton.disabled = false;
                        }
                        // IMPORTANT: Successful payment redirects handled by Cashfree via `return_url`.
                        // No automatic progression here. The user lands on payment-status.html.
                        else if (!result.redirect) {
                            // This case is less common but handle if SDK returns without error or redirect
                            console.warn("Cashfree Result (No Redirect):", result);
                            if (paymentMessage) {
                                paymentMessage.textContent = "Please complete payment via the opened window/app or try again.";
                                paymentMessage.style.color = 'var(--warning)';
                            }
                            // Re-enable button after a delay if stuck
                            setTimeout(() => {
                                if (payButton.disabled) { // Check if still disabled
                                    payButton.textContent = 'Pay ₹99 Now';
                                    payButton.disabled = false;
                                }
                            }, 5000); // 5 seconds delay
                        }
                    }).catch(sdkError => {
                        // Error during cashfree.checkout() call itself
                        console.error("Cashfree SDK checkout initiation error:", sdkError);
                        if (paymentMessage) {
                            paymentMessage.textContent = 'SDK Error: Could not start payment checkout.';
                            paymentMessage.style.color = '#c53030';
                        }
                        payButton.textContent = 'Pay ₹99 Now';
                        payButton.disabled = false;
                    });

                } catch (error) {
                    // Catch errors from fetch call or manual throws
                    console.error('Payment initiation fetch/process error:', error);
                    if (paymentMessage) {
                        // Display the error message thrown (more specific now)
                        paymentMessage.textContent = 'Error: ' + error.message;
                        paymentMessage.style.color = '#c53030';
                    }
                    payButton.textContent = 'Pay ₹99 Now';
                    payButton.disabled = false;
                }
            });
        }
    }
    // --- END CASHFREE PAYMENT INTEGRATION ---

}); // End DOMContentLoaded


// --- Auth State Observer ---
auth.onAuthStateChanged(async (user) => {
    // ... (keep existing auth state change logic) ...
    // This function handles showing/hiding login buttons vs user profile,
    // loading user data into the dashboard/profile, and setting up the notes listener.
    if (user) {
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';

        if (authModal && authModal.classList.contains('active')) {
            if(dashboardSection) showSection(dashboardSection);
             // Ensure the first tab is active when opening dashboard
             if(tabButtons.length > 0) tabButtons[0].click();
        }

        // Load profile data from Firestore
        const userDocRef = db.collection('userProfiles').doc(user.uid);
        try {
            const userDoc = await userDocRef.get();
            let profileData = {};
            if (userDoc.exists) {
                profileData = userDoc.data();
                if(profileName) profileName.value = profileData.name || '';
                if(profileGender) profileGender.value = profileData.gender || '';
                if(interestedDomain) interestedDomain.value = profileData.interestedDomain || '';
            } else {
                 profileData = { name: user.displayName, photoUrl: user.photoURL, email: user.email };
                 if(profileName) profileName.value = user.displayName || '';
            }
            updateProfileUI(profileData); // Update header, dashboard display etc.

            // Show seats popup if applicable
            if (profileData.interestedDomain) {
                // ... (add showSeatsPopup logic here if needed on login) ...
            }

        } catch (error) {
             console.error("Error loading profile data:", error);
             // Fallback UI update
             updateProfileUI({ name: user.displayName, photoUrl: user.photoURL, email: user.email });
        }


        setupDataListener(); // Refresh notes listener

        // Clear login/signup forms
        if(loginEmail) loginEmail.value = ''; if(loginPassword) loginPassword.value = '';
        if(signupEmail) signupEmail.value = ''; if(signupPassword) signupPassword.value = '';

    } else { // User signed out
        if(authButtons) authButtons.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');
        if (authModal && authModal.classList.contains('active')) {
            if(loginSection) showSection(loginSection);
        }
         if(userDataList) userDataList.innerHTML = ''; // Clear notes
    }
});


console.log('🚀 Internadda Script Loaded!');
