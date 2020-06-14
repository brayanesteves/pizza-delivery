const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
/**
 *  isNotLoggedIn (Es para proteger la ruta cuando el usuario ha iniciado sesión)
 */
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

/**
 * isNotLoggedIn (Es para proteger la ruta cuando el usuario ha iniciado sesión)
 */
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));
/**
 * isNotLoggedIn (Es para proteger la ruta cuando el usuario ha iniciado sesión)
 */
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});
/**
 * isNotLoggedIn (Es para proteger la ruta cuando el usuario ha iniciado sesión)
 */
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/profile', isLoggedIn, (req, res) => {
    //res.send('This is your Profile');
    res.render('profile');
});
// Logout session user
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('signin');
});

module.exports = router;