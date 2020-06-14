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

router.get('/checkout',  isLoggedIn, async (req, res) => {
    if (!req.session.cart) {
        return res.render('cmds/prcd', {
          products: null
        });
      }
      var cart = new Cart(req.session.cart);
    res.render('cmds/checkout', {
        products: cart.getItems(),
        totalPrice: cart.totalPrice,
        totalPriceEuros: cart.totalPriceEuros
    });
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.post('/add', isLoggedIn, async (req, res) => {
    //console.log(req.body);
    const { NmbrCmd, Dtlls, Prc_Dlrs, Prc_Ers } = req.body;
    const cmds = {
        user_id: req.user.id,
        NmbrCmd,
        Dtlls,
        Prc_Dlrs,
        Prc_Ers        
    };
    //console.log(cmds);
    await pool.query('INSERT INTO `sicvm_pizza`.`0_cmds` SET ?;', [cmds]);
    //res.send('Received');
    req.flash('success', 'Comida agregada correctamente');
    // Nos redirecciona a la ruta 'links'
    res.redirect('/cmds');
});
/**
 * isLoggedIn (Protege la ruta)
 */
router.get('/', async (req, res) => {
    const cmds = await pool.query('SELECT * FROM `sicvm_pizza`.`0_cmds` WHERE `0_cmds`.`Estd` = 1;');
    console.log(cmds);
    //res.send('Listas iran aquí');
    res.render('cmds/order', { cmds });
});
router.get('/myorder', isLoggedIn, async (req, res) => {
    const myorder = await pool.query('SELECT * FROM `sicvm_pizza`.`0_Pdds` INNER JOIN `sicvm_pizza`.`0_Usrs` ON `0_Pdds`.`Rfrnc_Usr` =  `0_Usrs`.`Rfrnc` INNER JOIN `sicvm_pizza`.`0_Cmds` ON `0_Pdds`.`Rfrnc_Cmd` =  `0_Cmds`.`Rfrnc`;'); 
    res.render('cmds/myorder', { myorder });
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

router.post('/pay', isLoggedIn, async (req, res) => {
    //console.log(req.body);
    var cart = new Cart(req.session.cart);
    var products;    
    
    products = cart.getItems();
    //console.log(products);
    //console.log(cmds);
    for(let i= 0; i < products.length; i++) {
        await pool.query('INSERT INTO `sicvm_pizza`.`0_pdds` SET ?;', {Rfrnc_Usr: req.user.Rfrnc, Rfrnc_Cmd: products[i].item.Rfrnc, Cntdd:products[i].quantity, Dtlls:"  ", Total_Dolares:products[i].price_dolar, Total_Euro:products[i].price_euro});
        //console.log(products[i].item.Rfrnc)
    }   
    
    req.flash('success', 'Comida agregada correctamente');
    // Nos redirecciona a la ruta 'links'*/
    res.redirect('/cmds');
});

module.exports = router;