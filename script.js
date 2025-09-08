/* Global variables and resets */
:root {
    --primary: #5624d0;
    --secondary: #a435f0;
    --dark: #1c1d1f;
    --light: #f7f9fa;
    --gray: #6a6f73;
    --success: #0ca678;
    --warning: #f69c08;
    --white: #ffffff;
    --border: 1px solid #d1d7dc;
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    color: var(--dark);
    background-color: var(--white);
    line-height: 1.5;
}

.container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 24px;
}

/* Helper classes */
.hidden {
    display: none !important;
}

/* Header Styles */
header {
    background-color: var(--white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.nav-menu {
    display: flex;
    gap: 24px;
}

.nav-link {
    text-decoration: none;
    color: var(--dark);
    font-weight: 500;
    font-size: 14px;
    transition: var(--transition);
}

.nav-link:hover {
    color: var(--primary);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    position: relative;
}

.user-profile img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid var(--primary);
}

.user-profile span {
    font-weight: 600;
    font-size: 14px;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background-color: var(--white);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px;
    min-width: 150px;
    z-index: 1000;
    display: none;
}

.dropdown-menu.active {
    display: block;
}

.dropdown-menu button {
    width: 100%;
    padding: 10px;
    background: none;
    border: none;
    text-align: left;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.dropdown-menu button:hover {
    background-color: var(--light);
}

.search-container {
    position: relative;
}

.search-input {
    padding: 10px 16px 10px 40px;
    border: var(--border);
    border-radius: 999px;
    font-size: 14px;
    width: 280px;
    transition: var(--transition);
}

.search-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(86, 36, 208, 0.2);
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray);
}

.btn {
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition);
    border: none;
}

.btn-primary {
    background-color: var(--primary);
    color: var(--white);
}

.btn-primary:hover {
    background-color: var(--secondary);
}

.btn-outline {
    background-color: transparent;
    border: 1px solid var(--dark);
    color: var(--dark);
}

.btn-outline:hover {
    background-color: var(--dark);
    color: var(--white);
}

/* Hero Section */
.hero {
    background: linear-gradient(90deg, rgba(86, 36, 208, 0.05) 0%, rgba(164, 53, 240, 0.05) 100%);
    padding: 60px 0;
}

.hero-container {
    display: flex;
    align-items: center;
    gap: 40px;
}

.hero-content {
    flex: 1;
}

.hero-heading {
    font-size: 40px;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.2;
}

.hero-heading span {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.hero-description {
    font-size: 18px;
    color: var(--gray);
    margin-bottom: 32px;
}

.hero-stats {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
}

.stat-item {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--primary);
}

.stat-label {
    font-size: 14px;
    color: var(--gray);
}

.hero-cta {
    display: flex;
    gap: 16px;
}

.btn-lg {
    padding: 14px 28px;
    font-size: 16px;
}

.hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-img {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: var(--shadow);
}

/* Value Proposition */
.value-prop {
    padding: 80px 0;
}

.section-header {
    text-align: center;
    margin-bottom: 48px;
}

.section-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
}

.section-subtitle {
    font-size: 18px;
    color: var(--gray);
    max-width: 600px;
    margin: 0 auto;
}

.value-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.value-card {
    background: var(--white);
    border-radius: 8px;
    padding: 32px;
    box-shadow: var(--shadow);
    transition: var(--transition);
    text-align: center;
}

.value-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.value-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, rgba(86, 36, 208, 0.1) 0%, rgba(164, 53, 240, 0.1) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: var(--primary);
    font-size: 28px;
}

.value-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
}

.value-description {
    color: var(--gray);
}

/* Courses Section */
.courses {
    padding: 80px 0;
    background-color: var(--light);
}

.courses-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.course-card {
    background: var(--white);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-image {
    height: 180px;
    overflow: hidden;
}

.course-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.course-card:hover .course-image img {
    transform: scale(1.05);
}

.course-content {
    padding: 16px;
}

.course-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-instructor {
    font-size: 14px;
    color: var(--gray);
    margin-bottom: 8px;
}

.course-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.rating-stars {
    color: var(--warning);
}

.rating-value {
    font-weight: 600;
    font-size: 14px;
}

.rating-count {
    font-size: 14px;
    color: var(--gray);
}

.course-price {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
}

.current-price {
    font-weight: 700;
    font-size: 18px;
}

.original-price {
    font-size: 14px;
    color: var(--gray);
    text-decoration: line-through;
}

.badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.bestseller {
    background-color: #ffe799;
    color: #593d00;
}

/* Internship Section */
.internships {
    padding: 80px 0;
}

.internship-container {
    display: flex;
    gap: 40px;
    align-items: center;
}

.internship-content {
    flex: 1;
}

.internship-image {
    flex: 1;
}

.internship-img {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: var(--shadow);
}

.features-list {
    margin: 24px 0;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.feature-icon {
    width: 24px;
    height: 24px;
    background-color: rgba(86, 36, 208, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 12px;
}

/* Testimonials */
.testimonials {
    padding: 80px 0;
    background-color: var(--light);
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
}

.testimonial-card {
    background: var(--white);
    border-radius: 8px;
    padding: 24px;
    box-shadow: var(--shadow);
}

.testimonial-text {
    font-style: italic;
    margin-bottom: 16px;
    position: relative;
}

.testimonial-text::before {
    content: "\201C";
    font-size: 60px;
    color: rgba(86, 36, 208, 0.1);
    position: absolute;
    top: -20px;
    left: -10px;
    font-family: Georgia, serif;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
}

.author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.author-details {
    display: flex;
    flex-direction: column;
}

.author-name {
    font-weight: 600;
}

.author-role {
    font-size: 14px;
    color: var(--gray);
}

/* CTA Section */
.cta-section {
    padding: 80px 0;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    color: var(--white);
    text-align: center;
}

.cta-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
}

.cta-description {
    font-size: 18px;
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.btn-light {
    background-color: var(--white);
    color: var(--primary);
}

.btn-light:hover {
    background-color: rgba(255, 255, 255, 0.9);
}

.btn-transparent {
    background-color: transparent;
    border: 1px solid var(--white);
    color: var(--white);
}

.btn-transparent:hover {
    background-color: var(--white);
    color: var(--primary);
}

/* Footer */
footer {
    background-color: var(--dark);
    color: var(--white);
    padding: 60px 0 30px;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand {
    grid-column: span 1;
}

.footer-logo {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--white);
}

.footer-description {
    color: #ccc;
    margin-bottom: 24px;
}

.social-links {
    display: flex;
    gap: 16px;
}

.social-link {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    transition: var(--transition);
}

.social-link:hover {
    background-color: var(--primary);
}

.footer-links-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 12px;
}

.footer-links a {
    color: #ccc;
    text-decoration: none;
    transition: var(--transition);
}

.footer-links a:hover {
    color: var(--white);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 30px;
    text-align: center;
    color: #ccc;
    font-size: 14px;
}

/* New Auth Modal Styles */
.modal {
    display: none;
    position: fixed;
    z-index: 1001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    justify-content: center;
    align-items: center;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: var(--white);
    padding: 40px;
    border-radius: 16px;
    position: relative;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 25px;
    color: var(--gray);
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.2s;
}
.close-btn:hover {
    color: var(--dark);
}

.auth-section {
    display: none;
}

.auth-section.active {
    display: block;
}

h2.auth-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: var(--dark);
    font-weight: 600;
    font-size: 14px;
}

input {
    width: 100%;
    padding: 14px;
    border: 1px solid #e1e5e9;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.2s ease;
}

input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(86, 36, 208, 0.1);
}

.btn-google {
    background-color: #4285f4;
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 10px;
}
.btn-google:hover {
    background-color: #357ae8;
}

.separator {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--gray);
    margin: 20px 0;
}
.separator::before,
.separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e1e5e9;
}
.separator:not(:empty)::before {
    margin-right: .5em;
}
.separator:not(:empty)::after {
    margin-left: .5em;
}

.toggle-auth {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
}
.toggle-auth a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
}
.toggle-auth a:hover {
    text-decoration: underline;
}

.error {
    color: #e74c3c;
    text-align: center;
    margin: 10px 0;
    padding: 12px;
    background: rgba(231, 76, 60, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(231, 76, 60, 0.2);
    display: none;
    font-size: 14px;
}

.loading {
    text-align: center;
    color: var(--primary);
    margin: 20px 0;
    display: none;
    font-weight: 500;
}

.spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Dashboard styles */
.dashboard-content {
    padding: 20px 0;
    text-align: center;
}

.user-info {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid var(--primary);
    margin-bottom: 10px;
}

h2.section-title-small {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 15px;
}

.data-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.form-group-note {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.btn-note {
    padding: 12px 18px;
    flex-shrink: 0;
}

.user-data-list {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 10px;
}

.data-item {
    background-color: var(--light);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.data-item span {
    font-size: 16px;
    word-break: break-word;
}

.data-item button {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
    flex-shrink: 0;
}

.data-item button:hover {
    background: #c0392b;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .header-actions {
        flex-grow: 1;
        justify-content: flex-end;
    }
    .nav-menu, .search-container {
        display: none;
    }
    .hero-container, .internship-container {
        flex-direction: column;
    }
    .value-cards {
        grid-template-columns: repeat(2, 1fr);
    }
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
    .header-actions {
        width: 100%;
        justify-content: space-between;
    }
    .logo {
        width: 100%;
        justify-content: center;
    }
    .hero-heading {
        font-size: 32px;
    }
    .hero-stats {
        flex-direction: column;
        gap: 16px;
    }
    .hero-cta, .cta-buttons {
        flex-direction: column;
    }
    .value-cards, .courses-grid, .testimonials-grid, .footer-grid {
        grid-template-columns: 1fr;
    }
    .modal-content {
        padding: 20px;
        margin: 20px;
    }
}


/* Add these styles to your existing CSS */

/* Hamburger Menu */
.hamburger-menu {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
}

.hamburger-menu span {
    width: 100%;
    height: 3px;
    background-color: var(--dark);
    border-radius: 10px;
    transition: all 0.3s linear;
    transform-origin: 1px;
}

.hamburger-menu.active span:nth-child(1) {
    transform: rotate(45deg);
}

.hamburger-menu.active span:nth-child(2) {
    opacity: 0;
    transform: translateX(20px);
}

.hamburger-menu.active span:nth-child(3) {
    transform: rotate(-45deg);
}

/* Mobile Navigation */
.mobile-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 400px;
    height: 100vh;
    background: var(--white);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: right 0.3s ease;
    padding: 80px 30px 30px;
    overflow-y: auto;
}

.mobile-nav.active {
    right: 0;
}

.mobile-nav .nav-link {
    display: block;
    padding: 15px 0;
    font-size: 18px;
    border-bottom: 1px solid #eee;
}

.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.mobile-overlay.active {
    opacity: 1;
    visibility: visible;
}

/* Improved Search for Mobile */
.search-container {
    position: relative;
}

.search-input {
    transition: all 0.3s ease;
}

.search-container.active .search-input {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    width: 300px;
    box-shadow: var(--shadow);
    z-index: 100;
}

/* Enhanced Mobile Responsiveness */
@media (max-width: 1024px) {
    .nav-menu {
        display: none;
    }
    
    .hamburger-menu {
        display: flex;
    }
    
    .search-input {
        width: 200px;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 15px 20px;
    }
    
    .header-actions {
        gap: 10px;
    }
    
    .search-container {
        order: 3;
        margin-left: auto;
    }
    
    .search-input {
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        background: #f5f5f5;
        border-radius: 50%;
    }
    
    .search-input::placeholder {
        color: transparent;
    }
    
    .search-icon {
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .search-container.active .search-input {
        width: 100vw;
        height: auto;
        padding: 12px 40px;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #eee;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: 0;
        background: white;
    }
    
    .search-container.active .search-icon {
        left: 15px;
        transform: translateY(-50%);
    }
    
    .hero-heading {
        font-size: 32px;
    }
    
    .hero-description {
        font-size: 16px;
    }
    
    .hero-stats {
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .stat-item {
        flex: 0 0 calc(50% - 10px);
    }
    
    .value-cards, .courses-grid, .testimonials-grid, .footer-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .internship-container, .hero-container {
        flex-direction: column;
        gap: 30px;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .modal-content {
        margin: 20px;
        padding: 25px 20px;
    }
}

@media (max-width: 480px) {
    .logo-text {
        font-size: 20px;
    }
    
    .hero-heading {
        font-size: 28px;
    }
    
    .section-title {
        font-size: 26px;
    }
    
    .btn {
        padding: 10px 15px;
        font-size: 14px;
    }
    
    .btn-lg {
        padding: 12px 20px;
    }
    
    .course-card, .value-card, .testimonial-card {
        padding: 20px;
    }
    
    .hero-cta {
        flex-direction: column;
    }
}

/* Improved form elements for mobile */
input, select, textarea {
    font-size: 16px !important; /* Prevents zoom on iOS */
}

/* Better touch targets for mobile */
.btn, .nav-link, .social-link {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* Smooth scrolling for anchor links */
html {
    scroll-behavior: smooth;
}
