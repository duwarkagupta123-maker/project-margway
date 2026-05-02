document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const signinForm = document.getElementById("signin-form");

    function safeGetItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error("localStorage access denied:", e);
            return null;
        }
    }

    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error("localStorage access denied:", e);
            return false;
        }
    }

    function safeRemoveItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error("localStorage access denied:", e);
        }
    }

    function showMessage(form, message, isSuccess) {
        let msgDiv = form.querySelector('.auth-message');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'auth-message';
            msgDiv.style.padding = '10px';
            msgDiv.style.marginBottom = '15px';
            msgDiv.style.borderRadius = '8px';
            msgDiv.style.textAlign = 'center';
            msgDiv.style.fontWeight = '500';
            msgDiv.style.fontSize = '0.9rem';
            // Insert before the submit button
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                form.insertBefore(msgDiv, btn);
            } else {
                form.appendChild(msgDiv);
            }
        }
        msgDiv.style.backgroundColor = isSuccess ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)';
        msgDiv.style.color = isSuccess ? '#28a745' : '#dc3545';
        msgDiv.style.border = `1px solid ${isSuccess ? '#28a745' : '#dc3545'}`;
        msgDiv.textContent = message;

        if (msgDiv.timeoutId) {
            clearTimeout(msgDiv.timeoutId);
        }
        msgDiv.timeoutId = setTimeout(() => {
            if (msgDiv && msgDiv.parentNode) {
                msgDiv.remove();
            }
        }, 4000);
    }

    function hideMessage(form) {
        const msgDiv = form.querySelector('.auth-message');
        if (msgDiv) {
            if (msgDiv.timeoutId) clearTimeout(msgDiv.timeoutId);
            msgDiv.remove();
        }
    }

    if (signupForm) {
        signupForm.addEventListener("input", () => hideMessage(signupForm));
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim().toLowerCase();
            const password = document.getElementById("signup-password").value;

            if (!name || !email || !password) {
                showMessage(signupForm, "Please fill in all fields.", false);
                return;
            }

            // Fetch existing users or initialize empty array
            let users = [];
            const storedUsers = safeGetItem("marg_users");
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }
            
            // Check if user already exists
            const userExists = users.some(u => u.email === email);
            if (userExists) {
                showMessage(signupForm, "An account with this email already exists!", false);
                return;
            }

            // Add new user
            const newUser = { name, email, password };
            users.push(newUser);
            const success = safeSetItem("marg_users", JSON.stringify(users));
            if (!success) {
                showMessage(signupForm, "Error! Safari blocks storage for local files. Please run a local web server to signup.", false);
                return;
            }
            
            showMessage(signupForm, "Signup successful! You can now sign in.", true);
            
            // Reset form
            signupForm.reset();
            
            // Automatically switch to the Sign In view after a short delay
            setTimeout(() => {
                const authToggle = document.getElementById("auth-toggle");
                if (authToggle) {
                    authToggle.checked = !authToggle.checked; 
                }
                const msgDiv = signupForm.querySelector('.auth-message');
                if (msgDiv) msgDiv.remove();
            }, 1500);
        });
    }

    if (signinForm) {
        signinForm.addEventListener("input", () => hideMessage(signinForm));
        signinForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signin-email").value.trim().toLowerCase();
            const password = document.getElementById("signin-password").value;

            if (!email || !password) {
                showMessage(signinForm, "Please enter both email and password.", false);
                return;
            }

            let users = [];
            const storedUsers = safeGetItem("marg_users");
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                showMessage(signinForm, "Login successful!", true);
                // Store current user session
                const success = safeSetItem("marg_currentUser", JSON.stringify(user));
                if (!success) {
                    showMessage(signinForm, "Error! Safari blocks storage for local files. Please run a local web server to login.", false);
                    return;
                }
                // Redirect to homepage
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 500);
            } else {
                showMessage(signinForm, "Invalid email or password!", false);
            }
        });
    }

    // Global Navbar update if logged in
    const storedUser = safeGetItem("marg_currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    if (currentUser) {
        const navLinks = document.getElementById("navLinks");
        if (navLinks) {
            // Find the login link
            const authLink = navLinks.querySelector('a[href="login.html"]') || navLinks.querySelector('a[href="signup.html"]');
            
            if (authLink) {
                const li = authLink.parentElement;
                
                // Keep the active class if it was there
                const wasActive = authLink.classList.contains("active");
                
                li.innerHTML = `
                    <div class="profile-dropdown" style="position: relative; display: inline-block; cursor: pointer; padding-bottom: 15px; margin-bottom: -15px;">
                        <a class="nav-cta ${wasActive ? 'active' : ''}" style="display: flex; align-items: center; gap: 8px; text-decoration: none;">
                            <i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}
                        </a>
                        <div class="dropdown-content" style="display: none; position: absolute; top: 100%; right: 0; background-color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border-radius: 12px; z-index: 9999; min-width: 160px; overflow: hidden; margin-top: 5px; border: 1px solid #eee;">
                            <a href="#" style="color: #333; padding: 12px 20px; text-decoration: none; display: block; font-weight: 500; font-size: 0.95rem; border-bottom: 1px solid #f0f0f0;">Profile Settings</a>
                            <a href="#" id="logout-btn" style="color: #ff4d4f; padding: 12px 20px; text-decoration: none; display: block; font-weight: 500; font-size: 0.95rem;">Logout</a>
                        </div>
                    </div>
                `;
                
                const dropdown = li.querySelector('.profile-dropdown');
                const dropdownContent = li.querySelector('.dropdown-content');
                
                // Handle hover for dropdown with delay to prevent accidental closing
                let timeoutId;
                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(timeoutId);
                    dropdownContent.style.display = 'block';
                });
                dropdown.addEventListener('mouseleave', () => {
                    timeoutId = setTimeout(() => {
                        dropdownContent.style.display = 'none';
                    }, 250);
                });
                
                // Hover effect on items
                dropdownContent.querySelectorAll('a').forEach(a => {
                    a.addEventListener('mouseenter', e => e.target.style.backgroundColor = '#f5f5f5');
                    a.addEventListener('mouseleave', e => e.target.style.backgroundColor = 'transparent');
                });
                
                // Handle logout
                li.querySelector('#logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    safeRemoveItem('marg_currentUser');
                    // Redirect to home page on logout
                    window.location.href = 'index.html';
                });
            }
        }
    }
});
