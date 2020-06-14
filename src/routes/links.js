const express = require('express');
const router = express.Router();

const pool = require('../database');
// Para proteger las rutas
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// Routes
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/add', isLoggedIn, (req, res) => {
    //res.send('Form');
    res.render('links/add');
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.post('/add', isLoggedIn, async (req, res) => {
    //console.log(req.body);
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    //console.log(newLink);
    await pool.query('INSERT INTO `database_links`.`links` SET ?;', [newLink]);
    //res.send('Received');
    req.flash('success', 'Link saved successfully');
    // Nos redirecciona a la ruta 'links'
    res.redirect('/links');
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM `database_links`.`links` WHERE `links`.`user_id` = ?;', [req.user.id]);
    console.log(links);
    //res.send('Listas iran aquí');
    res.render('links/list', { links });
});
router.get('/list-all', isLoggedIn, async (req, res) => {
    const links_all = await pool.query('SELECT * FROM `database_links`.`links` INNER JOIN `database_links`.`users` ON `links`.`user_id` =  `users`.`id`;');
    console.log(links_all);
    //res.send('Listas iran aquí');
    res.render('links/list-all', { links_all });
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    //console.log(req.params.id);
    //res.send('DELETED');
    const { id } = req.params;
    await pool.query('DELETE FROM `database_links`.`links` WHERE `links`.`id` = ?;', [id]);
    req.flash('success', 'Links Removed successfully');
    res.redirect('/links');
});
/**
 * Cuando se seleccionó la información a editar, mostrar la información seleccionada
 * isLoggedIn (Protege la ruta)
 */
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    //console.log(req.params.id);
    //res.send('EDITED');
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM `database_links`.`links` WHERE `links`.`id` = ?;', [id]);
    ///res.send('EDITED');    
    /**
     * links[0], es para que me muestre la información seleccionada, no todos la información
     */
    console.log(links[0]);
    res.render('links/edit', { link: links[0] });
    //res.redirect('/links');
});
/**
 * Como el formulario de 'edit.hbs' esta en method = "POST"
 * isLoggedIn (Protege la ruta)
 */
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url, 
        description
    };
    //console.log(newLink);
    req.flash('success', 'Link Updated Successfully');
    await pool.query('UPDATE `database_links`.`links` SET ? WHERE `links`.`id` = ?;', [newLink, id]);
    //res.send('UPDATED');
    res.redirect('/links');
});

module.exports = router;