import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';
import { loginValidation } from '../../middleware/validation/forms.js';
const router = Router();

/**
 * Display the login form.
 */
const showLoginForm = (req, res) => {
    // TODO: Render the login form view (forms/login/form)
    // TODO: Pass title: 'User Login'
    res.render('forms/login/form', { title: 'User Login' });
};

/**
 * Process login form submission.
 */
const processLogin = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // TODO: Log validation errors to console
        errors.array().forEach(error => {
        req.flash('error', error.msg);
        });        

        // TODO: Redirect back to /login
        return res.redirect('/login');
    }

    // TODO: Extract email and password from req.body
    const { email, password } = req.body;

    try {
        // TODO: Find user by email using findUserByEmail()
        const user = await findUserByEmail(email);

        // TODO: If not found, log "User not found" and redirect to /login
        if (!user) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }

        // TODO: Verify password using verifyPassword(password, user.password)
        const isValid = await verifyPassword(password, user.password);

        // TODO: If password incorrect, log "Invalid password" and redirect to /login
        if (!isValid) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }

        // SECURITY: Remove password from user object before storing in session
        delete user.password;

        // TODO: Store user in session: req.session.user = user
        req.session.user = user;

        req.flash('success', `Welcome back, ${user.name}!`);
        // TODO: Redirect to /dashboard
        return res.redirect('/dashboard');

    } catch (error) {
        // Model functions do not catch errors, so handle them here

        // TODO: Log error to console
        console.error(error);
        req.flash('error', "Error with Login Process")

        // TODO: Redirect to /login
        return res.redirect('/login');
    }
};

/**
 * Handle user logout.
 * 
 * NOTE: connect.sid is the default session cookie name since we did not
 * specify a custom name when creating the session in server.js.
 */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login).
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    // TODO: Render the dashboard view (dashboard)
    // TODO: Pass title: 'Dashboard', user, and sessionData to template
    res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

// Routes
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };