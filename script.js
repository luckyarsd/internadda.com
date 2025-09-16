// ---------------------------------------------
// Firebase Auth & Firestore Logic
// ---------------------------------------------

// Replace with your Firebase config

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
const profilePhotoUrl = document.getElementById('profilePhotoUrl');
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
const verificationBadge = document.getElementById('verificationBadge');

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

// Course data for client-side search (for course.html)
const allCourses = [
];

// Course data for index.html search
const popularCourses = [
    { title: 'Generative AI & Prompt Engineering Masterclass', instructor: 'Created by AI', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=500&q=80', url: `courses/${createCourseSlug('Generative AI & Prompt Engineering Masterclass')}.html` },
    { title: 'Cloud Computing & DevOps Essentials', instructor: 'Created by AI', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80', url: `courses/${createCourseSlug('Cloud Computing & DevOps Essentials')}.html` },
    { title: 'The Complete Digital Marketing Course', instructor: 'Created by AI', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=80', url: `courses/${createCourseSlug('The Complete Digital Marketing Course')}.html` },
    { title: 'E-Commerce & Dropshipping Business Mastery', instructor: 'Created by AI', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80', url: `courses/${createCourseSlug('E-Commerce & Dropshipping Business Mastery')}.html` },
];

const coursesGrid = document.getElementById('coursesGrid');
const courseTitles = document.querySelectorAll('.course-title');

function renderCourses(courses) {
    if (!coursesGrid) return; // Ensure we are on the courses page

    coursesGrid.innerHTML = '';
    if (courses.length === 0) {
        coursesGrid.innerHTML = '<p class="no-data-message">No courses found matching your search.</p>';
        return;
    }
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-author">${course.instructor}</p>
                <div class="course-rating">
                    <div class="rating-stars">
                        ${generateStarRating(course.rating)}
                    </div>
                    <span class="rating-value">${course.rating}</span>
                    <span class="rating-count">(${course.reviews})</span>
                </div>
                <div class="course-price">
                    <span class="current-price">${course.price}</span>
                    <span class="original-price">${course.originalPrice}</span>
                    ${course.bestseller ? '<span class="badge bestseller">Bestseller</span>' : ''}
                </div>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
}

function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(parseFloat(rating));
    const hasHalfStar = parseFloat(rating) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = stars.length / 2; i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Function to get the correct avatar based on progress or user upload
function getAvatarUrl(progress, userUploadedImage) {
    if (userUploadedImage) {
        return userUploadedImage;
    }
    
    const totalProgress = (progress.coursesCompleted || 0) + (progress.testsCompleted || 0);
    
    if (totalProgress >= 10) {
        return 'Internadda/images/avtar5.jpg';
    } else if (totalProgress >= 7) {
        return 'Internadda/images/avtar4.jpg';
    } else if (totalProgress >= 4) {
        return 'Internadda/images/avtar3.jpg';
    } else if (totalProgress >= 1) {
        return 'Internadda/images/avtar2.jpg';
    } else {
        return 'Internadda/images/avtar1.jpg';
    }
}

// Function to handle image preview from file input
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userAvatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Function to check against the simulated Google Sheet for verification
function checkVerificationStatus(userEmail, userName) {
    return verifiedInterns.some(intern => 
        intern.email.toLowerCase() === userEmail.toLowerCase() &&
        intern.name.toLowerCase() === userName.toLowerCase() &&
        intern.testPassed
    );
}

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

function showSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    
    if (results.length > 0) {
        resultsContainer.classList.remove('hidden');
        const heading = document.createElement('h3');
        heading.textContent = 'Search Results';
        resultsContainer.appendChild(heading);

        results.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.url;
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="search-result-image">
                    <img src="${result.image}" alt="${result.title}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">
                </div>
                <div class="search-result-details">
                    <h4>${result.title}</h4>
                    <p>Instructor: ${result.instructor}</p>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found. Please try a different query.</p>';
        resultsContainer.classList.remove('hidden');
    }
}

// Event Listeners for Modal
if (loginBtnHeader) {
    loginBtnHeader.addEventListener('click', () => {
        authModal.classList.add('active');
        showSection(loginSection);
    });
}
if (signupBtnHeader) {
    signupBtnHeader.addEventListener('click', () => {
        authModal.classList.add('active');
        showSection(signupSection);
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
    });
}

if (authModal) {
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });
}

if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(signupSection);
    });
}
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });
}
if (userProfile) {
    userProfile.addEventListener('click', () => {
        userDropdown.classList.toggle('active');
    });
}

// New event listener for profile button
if (profileBtnHeader) {
    profileBtnHeader.addEventListener('click', () => {
        authModal.classList.add('active');
        showSection(dashboardSection);
        userDropdown.classList.remove('active'); // Close the dropdown after click
    });
}

document.addEventListener('click', (e) => {
    if (userProfile && userDropdown && !userProfile.contains(e.target) && userDropdown.classList.contains('active')) {
        userDropdown.classList.remove('active');
    }
});

// Hamburger menu
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Email Login
if (emailLoginBtn) {
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
}


// Email Signup
if (emailSignupBtn) {
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
}

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
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', signInWithGoogle);
}
if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', signInWithGoogle);
}

// Logout
const handleLogout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
};
if (logoutBtnHeader) {
    logoutBtnHeader.addEventListener('click', handleLogout);
}
if (logoutBtnModal) {
    logoutBtnModal.addEventListener('click', handleLogout);
}

// Function to update the profile display section based on a given data object
function updateProfileUI(profileData) {
    const avatarUrl = profileData.photoUrl || 'https://placehold.co/40x40/5624d0/ffffff?text=U';
    
    if (userAvatarHeader) userAvatarHeader.src = avatarUrl;
    if (userAvatarDashboard) userAvatarDashboard.src = avatarUrl;
    if (userAvatarPreview) userAvatarPreview.src = avatarUrl;

    if (userNameDashboard) userNameDashboard.textContent = profileData.name || 'User';
    if (userEmailDashboard) userEmailDashboard.textContent = profileData.email;
    if (document.getElementById('profileGenderDisplay')) document.getElementById('profileGenderDisplay').textContent = profileData.gender || 'Not specified';
    if (document.getElementById('profileDomainDisplay')) document.getElementById('profileDomainDisplay').textContent = profileData.interestedDomain || 'Not specified';

    // Check verification status and update badge
    const isVerified = checkVerificationStatus(profileData.email, profileData.name);
    if (verificationBadge) {
        if (isVerified) {
            verificationBadge.textContent = 'Verified';
            verificationBadge.classList.remove('faded');
            verificationBadge.title = 'This user is a verified intern.';
        } else {
            verificationBadge.textContent = 'Unverified';
            verificationBadge.classList.add('faded');
            verificationBadge.title = 'Pass the test to get verified intern.';
        }
    }
}

// Profile Tab Logic
if (tabButtons) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
    
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById(`${tab}TabContent`).classList.remove('hidden');
            document.getElementById(`${tab}TabContent`).classList.add('active');
        });
    });
}


// New Edit Profile Button
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        profileDisplaySection.classList.add('hidden');
        profileEditSection.classList.remove('hidden');
    });
}


// Save Profile Data
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return;
    
        const displayName = profileName.value.trim();
        const gender = profileGender.value;
        const interestedDomainValue = interestedDomain.value;
        
        let photoURL = user.photoURL; // Fallback to current photoURL
        const file = profileImageInput.files[0];

        if (file) {
             // For production, you must use the Firebase Storage SDK.
             // For now, keeping the data URL for a client-side preview.
            const reader = new FileReader();
            reader.onload = (e) => {
                photoURL = e.target.result;
            };
            reader.readAsDataURL(file);
            console.log("Image upload simulated. In a real app, upload this file to Firebase Storage.");
        } else {
            // No new image selected, check if we have a photoUrl from Firestore
            const userDoc = await db.collection('userProfiles').doc(user.uid).get();
            if (userDoc.exists) {
                photoURL = userDoc.data().photoUrl;
            } else {
                 photoURL = user.photoURL;
            }
        }
    
        // Update Firebase Auth profile
        try {
            await user.updateProfile({
                displayName: displayName || user.displayName,
                photoURL: photoURL,
            });
            console.log('User profile updated successfully.');
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    
        // Save additional data to Firestore
        try {
            const userDocRef = db.collection('userProfiles').doc(user.uid);
            await userDocRef.set({
                name: displayName,
                gender: gender,
                photoUrl: photoURL,
                interestedDomain: interestedDomainValue,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                email: user.email // Store email for easier lookup
            }, { merge: true });
    
            console.log('User data saved to Firestore.');
            alert('Your profile has been saved successfully!');
            
            // Show professional alert for seats left
            if (interestedDomainValue) {
                const lastShown = localStorage.getItem('seatsPopupShown');
                const now = new Date().getTime();
                const oneHour = 60 * 60 * 1000;
                if (!lastShown || (now - lastShown > oneHour)) {
                    const seatsLeft = Math.floor(Math.random() * 9) + 2;
                    showSeatsPopup(interestedDomainValue, seatsLeft);
                    localStorage.setItem('seatsPopupShown', now);
                }
            }
            
            // Switch back to display mode
            if (profileEditSection && profileDisplaySection) {
                profileEditSection.classList.add('hidden');
                profileDisplaySection.classList.remove('hidden');
            }
    
            // Refetch data and update UI
            const updatedUserDoc = await db.collection('userProfiles').doc(user.uid).get();
            if (updatedUserDoc.exists) {
                 updateProfileUI(updatedUserDoc.data());
            } else {
                 updateProfileUI({ name: user.displayName, photoUrl: user.photoURL, email: user.email});
            }
    
        } catch (error) {
            console.error('Error saving user data:', error);
            alert('Failed to save profile. Please try again.');
        }
    });
}


// Save Data (Notes)
if (saveDataBtn) {
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
}

// Load User Data
function setupDataListener() {
    const user = auth.currentUser;
    if (!user) {
        if (userDataList) userDataList.innerHTML = '';
        return;
    }

    const userNotesRef = db.collection('userData').where('userId', '==', user.uid).orderBy('timestamp', 'desc').limit(10);
    if (userDataList) {
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

}

// Delete Data
window.deleteData = async function(docId) {
    try {
        await db.collection('userData').doc(docId).delete();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};

// Show seats popup
function showSeatsPopup(domain, seats) {
    const popup = document.createElement('div');
    popup.className = 'seats-popup';
    popup.innerHTML = `
        <i class="fas fa-times close-btn"></i>
        <div class="seats-popup-content">
            <i class="fa-solid fa-fire"></i>
            <p class="seats-popup-text">Only <span>${seats} seats</span> left for the <span>${domain}</span> internship! Pass the test to secure your spot.</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    popup.querySelector('.close-btn').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 500);
    });
}


// Auth State Observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        if(authButtons) authButtons.classList.add('hidden');
        if(userProfile) userProfile.classList.remove('hidden');
        if(userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';

        if (authModal && authModal.classList.contains('active')) {
            showSection(dashboardSection);
        }

        // Load profile data from Firestore
        const userDocRef = db.collection('userProfiles').doc(user.uid);
        const userDoc = await userDocRef.get();
        
        let profileData = {};
        if (userDoc.exists) {
            profileData = userDoc.data();
            if(profileName) profileName.value = profileData.name || '';
            if(profileGender) profileGender.value = profileData.gender || '';
            if(interestedDomain) interestedDomain.value = profileData.interestedDomain || '';
        } else {
             profileData = { name: user.displayName, photoUrl: user.photoURL, email: user.email};
             if(profileName) profileName.value = user.displayName || '';
        }
        
        updateProfileUI(profileData);


        setupDataListener();

        // Show seats popup if applicable
        if (profileData.interestedDomain) {
            const lastShown = localStorage.getItem('seatsPopupShown');
            const now = new Date().getTime();
            const oneHour = 60 * 60 * 1000;
            if (!lastShown || (now - lastShown > oneHour)) {
                const seatsLeft = Math.floor(Math.random() * 9) + 2;
                showSeatsPopup(profileData.interestedDomain, seatsLeft);
                localStorage.setItem('seatsPopupShown', now);
            }
        }

        // Clear forms
        if(loginEmail) loginEmail.value = '';
        if(loginPassword) loginPassword.value = '';
        if(signupEmail) signupEmail.value = '';
        if(signupPassword) signupPassword.value = '';
    } else {
        // User is signed out
        if(authButtons) authButtons.classList.remove('hidden');
        if(userProfile) userProfile.classList.add('hidden');

        if (authModal && authModal.classList.contains('active')) {
            showSection(loginSection);
        }
    }
});

// Enter key listeners for forms
if(loginPassword) {
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') emailLoginBtn.click();
    });
}
if(signupPassword) {
    signupPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') emailSignupBtn.click();
    });
}
if(dataInput) {
    dataInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveDataBtn.click();
    });
}

// File input change listener for preview
if(profileImageInput) {
    profileImageInput.addEventListener('change', handleImagePreview);
}


// Hero image slider logic
const sliderWrapper = document.querySelector('.hero-image-slider .slider-wrapper');
const slides = document.querySelectorAll('.hero-image-slider .slide');
const dots = document.querySelectorAll('.hero-image-slider .dot');
let currentSlide = 0;
let slideInterval;

if (sliderWrapper) {
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // Change image every 5 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlider();
            currentSlide = index;
            showSlide(currentSlide);
            startSlider();
        });
    });

    // Initial slide setup for home page
    document.addEventListener('DOMContentLoaded', () => {
        showSlide(0);
        startSlider();
    });
}


// Search functionality
function filterCourses(query) {
    const lowerCaseQuery = query.toLowerCase();
    
    const allAvailableCourses = [...allCourses, ...popularCourses];

    return allAvailableCourses.filter(course => {
        return course.title.toLowerCase().includes(lowerCaseQuery) ||
               course.instructor.toLowerCase().includes(lowerCaseQuery);
    });
}
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const filteredResults = filterCourses(query);
                showSearchResults(filteredResults);
            }
        }
    });
}

// Clear search input on click outside
document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    const searchResultsContainer = document.getElementById('searchResults');
    if (searchResultsContainer && searchContainer && !searchContainer.contains(e.target) && !searchResultsContainer.contains(e.target)) {
        searchInput.value = '';
        searchResultsContainer.classList.add('hidden');
    }
});


// Initial load
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)';
            }
        });
    }

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

    // On the course.html page, render the courses.
    if (coursesGrid) {
        renderCourses(allCourses);
    }
});

console.log('🚀 SkillPoint with Firebase Auth loaded!');
