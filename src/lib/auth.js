module.exports = {
    // Es para saber si un objeto hizo login o no
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    isLoggedIn(req, res, next) {
        // Si el usuario inicio sesión
        if(req.isAuthenticated()) {
            // Continue en la ruta permitida para los usuarios que han iniciado sesión
            return next();
        }
        // Caso con trario redireccionar a la ventana de inicio de sesión
        return res.redirect('/signin');
    },
    // Si el usuario ha iniciado sesión (Proceso inverso)
    /**
     * 
     * @param {ç} req 
     * @param {*} res 
     * @param {*} next 
     */
    isNotLoggedIn(req, res, next) {
        // Si el usuario inicio sesión
        if(!req.isAuthenticated()) {
            // Continue en la ruta permitida para los usuarios que han iniciado sesión
            return next();
        }
        // Caso con trario redireccionar a la ventana de inicio de sesión
        return res.redirect('/profile');
    },
};