module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.vacio = 99;
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;
    this.totalPriceEuros = cart.totalPriceEuros || 0;

    this.add = function(item, id) {        
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {item: item, quantity: 0, price_dolar: 0, price_euro: 0};        }
        
        cartItem.quantity++;
        cartItem.price_dolar = cartItem.item.Prc_Dlrs * cartItem.quantity;
        cartItem.price_euro = cartItem.item.Prc_Ers * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.Prc_Dlrs;
        this.totalPriceEuros += cartItem.item.Prc_Ers;
    };

    this.remove = function(id) {
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price_dolar;
        this.totalPriceEuros -= this.items[id].price_euro;
        delete this.items[id];
    };
    this.removeAll = function(id) {
        for(let i = 0; i < this.items.lenght; i++) {
            this.totalItems -= this.items[id][i].quantity;
            this.totalPrice -= this.items[id][i].price_dolar;
            this.totalPriceEuros -= this.items[id][i].price_euro;
            delete this.items[id][i];
        }
    };    
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            console.log("Item "+this.items[id]);
            arr.push(this.items[id]);
        }
        return arr;
    };
};