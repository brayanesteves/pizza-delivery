const express = require('express');
const router = express.Router();

const pool = require('../database');
// Para proteger las rutas
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', async (req, res) => {
    //res.send('Hello WOrld');
    /**
     * views/index.hbs
     */
    //const links = await pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`user_id` = ?;', [req.user.Rfrnc]);
    res.render('index');
});

module.exports = router;