// ---------------------------------------------
// Firebase Auth & Firestore Logic (InternAdda)
// ---------------------------------------------

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCEas4FDRozXwhnzKeCz09LQnyCjY1twh4",
  authDomain: "internadda-c7217.firebaseapp.com",
  projectId: "internadda-c7217",
  storageBucket: "internadda-c7217.firebasestorage.app",
  messagingSenderId: "88070207511",
  appId: "1:88070207511:web:b15e5672970d6f699dc452",
  measurementId: "G-3ZZ3HGFM3Q"
};

// ✅ Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ✅ DOM Elements
const authModal = document.getElementById('authModal');
const closeModalBtn = document.getElementById('closeModal');
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const dashboardSection = document.getElementById('dashboardSection');
const authButtons = document.getElementById('authButtons');
const userProfile = document.getElementById('userProfile');
const userAvatarHeader = document.getElementById('userAvatarHeader');
const userNameHeader = document.getElementById('userNameHeader');
const userDropdown = document.getElementById('userDropdown');
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
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const loginLoading = document.getElementById('loginLoading');
const signupLoading = document.getElementById('signupLoading');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// ✅ Utility Functions
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

// ---------------------------------------------
// ✅ GOOGLE LOGIN
// ---------------------------------------------
async function signInWithGoogle() {
  try {
    await auth.signInWithPopup(googleProvider);
    if (authModal) authModal.classList.remove('active');
    document.body.style.overflow = '';
  } catch (error) {
    showError(loginError, error.message);
    showError(signupError, error.message);
  }
}
if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
if (googleSignupBtn) googleSignupBtn.addEventListener('click', signInWithGoogle);

// ---------------------------------------------
// ✅ EMAIL + PASSWORD AUTH
// ---------------------------------------------

// SIGNUP
if (emailSignupBtn) {
  emailSignupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    if (!email || !password) {
      showError(signupError, "Please enter both email and password.");
      return;
    }
    signupLoading.style.display = 'block';
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        name: user.displayName || 'User',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      signupLoading.style.display = 'none';
      authModal.classList.remove('active');
      document.body.style.overflow = '';
      console.log('✅ Signup successful:', user.email);
    } catch (error) {
      signupLoading.style.display = 'none';
      showError(signupError, error.message);
    }
  });
}

// LOGIN
if (emailLoginBtn) {
  emailLoginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    if (!email || !password) {
      showError(loginError, "Please enter both email and password.");
      return;
    }
    loginLoading.style.display = 'block';
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      loginLoading.style.display = 'none';
      authModal.classList.remove('active');
      document.body.style.overflow = '';
      console.log('✅ Login successful:', user.email);
    } catch (error) {
      loginLoading.style.display = 'none';
      showError(loginError, error.message);
    }
  });
}

// ---------------------------------------------
// ✅ LOGOUT HANDLER
// ---------------------------------------------
const handleLogout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', handleLogout);
if (logoutBtnModal) logoutBtnModal.addEventListener('click', handleLogout);

// ---------------------------------------------
// ✅ MODAL & HEADER EVENTS
// ---------------------------------------------
if (loginBtnHeader) loginBtnHeader.addEventListener('click', (e) => {
  e.preventDefault();
  authModal.classList.add('active');
  showSection(loginSection);
  document.body.style.overflow = 'hidden';
});
if (signupBtnHeader) signupBtnHeader.addEventListener('click', (e) => {
  e.preventDefault();
  authModal.classList.add('active');
  showSection(signupSection);
  document.body.style.overflow = 'hidden';
});
if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
  authModal.classList.remove('active');
  document.body.style.overflow = '';
});
if (showSignupLink) showSignupLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(signupSection);
});
if (showLoginLink) showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(loginSection);
});

// ---------------------------------------------
// ✅ AUTH STATE CHANGE
// ---------------------------------------------
auth.onAuthStateChanged(async (user) => {
  const coursesListContainer = document.getElementById('coursesListContainer');
  const internshipsListContainer = document.getElementById('internshipsListContainer');

  if (user) {
    if (authButtons) authButtons.classList.add('hidden');
    if (userProfile) userProfile.classList.remove('hidden');
    if (userNameHeader) userNameHeader.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';
    console.log('👤 Logged in as:', user.email);
  } else {
    if (authButtons) authButtons.classList.remove('hidden');
    if (userProfile) userProfile.classList.add('hidden');
    if (coursesListContainer) coursesListContainer.innerHTML = '<p class="text-center" style="color: gray;">Please log in to view your courses.</p>';
    if (internshipsListContainer) internshipsListContainer.innerHTML = '<p class="text-center" style="color: gray;">Please log in to view your internships.</p>';
  }
});

console.log('🚀 InternAdda Auth Script Loaded Successfully!');
