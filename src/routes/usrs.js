/**
 * usrs.js (Usuarios)
 */
/**
 * cmds.js (Comidas)
 */
const express = require('express');
const router = express.Router();

const pool = require('../database');
// Para proteger las rutas
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
var Cart = require('../mdls/carts');
const http = require('http');
const https = require('https');

// Routes
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/add', isLoggedIn, (req, res) => {
    //res.send('Form');
    res.render('cmds/add');
});

router.get('/json', function(req, res, next) {
    var _json;
   pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`Estd` = 1;', function(err, rows, fields) {
        pool.end();
        if(err) throw err;
        res.json(rows); 
    }); 
     
  });

router.get('/add/:Rfrnc', async (req, res) => {
    var { Rfrnc } = req.params;
    var productId = req.params.Rfrnc;
    var cart = new Cart(req.session.cart ? req.session.cart : {});    
    let query = await pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`Rfrnc` = ? AND `0_cmds`.`Estd` = 1;', [Rfrnc], (err, result, fields) => {
        if(err) { throw err; }
        var resultado = result;        
        if(resultado.length > 0) {
            cart.add(resultado[0], [Rfrnc]);
            req.session.cart = cart;            
            res.redirect('/cmds');   
        }           
    });
  });
  router.get('/prcd', function(req, res, next) {
    if (!req.session.cart) {
      return res.render('cmds/prcd', {
        products: null
      });
    }
    var cart = new Cart(req.session.cart);
    res.render('cmds/prcd', {
      title: 'NodeJS Shopping Cart',
      products: cart.getItems(),
      totalPrice: cart.totalPrice,
      totalPriceEuros: cart.totalPriceEuros
    });
  });

/**
 * isLoggedIn (Protege la ruta)
 */

/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/', async (req, res) => {
    const cmds = await pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`Estd` = 1;');
    console.log(cmds);
    //res.send('Listas iran aquí');
    res.render('cmds/order', { cmds });
});
router.get('/list-all', isLoggedIn, async (req, res) => {
    const links_all = await pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` INNER JOIN `sicvm_pizza`.`users` ON `0_cmds`.`user_id` =  `users`.`id`;');
    console.log(links_all);
    //res.send('Listas iran aquí');
    res.render('cmds/list-all', { links_all });
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/delete/:Rfrnc', async (req, res) => {
    //console.log(req.params.id);
    //res.send('DELETED');
    const { Rfrnc } = req.params;
    await pool.query('DELETE FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`Rfrnc` = ?;', [Rfrnc]);
    req.flash('success', 'Food Removed successfully');
    res.redirect('/cmds/prcd');
});

/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/remove-order/:Rfrnc', async (req, res) => {
    var productId = req.params.Rfrnc;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cmds/prcd');
});
router.get('/remove-all', async (req, res) => {
    var productId = req.params.Rfrnc;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeAll();
    req.session.cart = cart;
    res.redirect('/cmds/prcd');
});
/**
 * Cuando se seleccionó la información a editar, mostrar la información seleccionada
 * isLoggedIn (Protege la ruta)
 */
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    //console.log(req.params.id);
    //res.send('EDITED');
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`Rfrnc` = ?;', [id]);
    ///res.send('EDITED');    
    /**
     * links[0], es para que me muestre la información seleccionada, no todos la información
     */
    console.log(links[0]);
    res.render('cmds/edit', { link: links[0] });
    //res.redirect('/cmds');
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
    req.flash('success', 'Comida actualizado');
    await pool.query('UPDATE `sicvm_pizza`.`0_cmds` SET ? WHERE `0_cmds`.`Rfrnc` = ?;', [newLink, id]);
    //res.send('UPDATED');
    res.redirect('/cmds');
});

module.exports = router;