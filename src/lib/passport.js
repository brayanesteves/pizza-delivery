const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    /**
     * Son los nombres de los campos de 'signin.hbs'
     */
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, NmbrUsr, Cntrsn, done) => {
    console.log(req.body);
    console.log(NmbrUsr);
    console.log(Cntrsn);
    const rows = await pool.query('SELECT * FROM `sicvm_pizza`.`0_Usrs` WHERE `0_Usrs`.`NmbrUsr` = ?;', [NmbrUsr]);
    // Encontró el usuario
    if(rows.length > 0) {
        const user = rows[0];
        // Validar su contraseña
        const validPassword = await helpers.matchPassword(Cntrsn, user.Cntrsn);
        if(validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.Cntrsn));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }
    // Si no consiguió usuario
    else {
        //console.log(password);
        return done(null, false, req.flash('message', 'The Username does not exists'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    // Son los nombres del campo de 'auth/signup.hbs'
    usernameField: 'username',
    passwordField: 'password',
    // Es para recibir la solicitud dentro la función de LocalStrategy
    passReqToCallback: true
}, async (req, NmbrUsr, Cntrsn, done) => {
    //console.log(req.body);
    const { fullname } = req.body;
    const newUser = {
        NmbrUsr,
        Cntrsn
    };
    newUser.Cntrsn = await helpers.encryptPassword(Cntrsn);
    // Saving in the Database  
    const result = await pool.query('INSERT INTO `sicvm_pizza`.`0_Usrs` SET ?;', newUser);
    newUser.id = result.insertId;
    //console.log(result);
    return done(null, newUser);
}));
/**
 * Guardar usuario dentro de la sesión
 */
passport.serializeUser((user, done) => {
    done(null, user.Rfrnc);
});
passport.deserializeUser(async (Rfrnc, done) => {
    const rows = await pool.query('SELECT * FROM `sicvm_pizza`.`0_Usrs` WHERE `0_Usrs`.`Rfrnc` = ?;', [Rfrnc]);
    done(null, rows[0]);
});