var LOAD_NUM = 4;
var watcher;

setTimeout(function() {

    new Vue({
        el: "#app",
        data: {
            total: 0,
            products:[],
            cart: [],
            search: "", 
            lastSearch: "", 
            loading: false, 
            results: []
        },
        methods: {
            addToCart: function(product) {
                this.total += product.price;
                var found = false;
                for (var i = 0; i < this.cart.length; i++) {
                    if(this.cart[i].id === product.id) {
                        this.cart[i].qty++;
                        found = true;
                    }
                }
                // console.log(product.id);
                if (!found ) {
                 this.cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    qty: 1
                });    
                }           
            },
            inc: function(item) {
                item.qty++;
                this.total += item.price;
            },
            dec: function(item) {
                item.qty--;
                this.total -= item.price;
                if (item.qty <= 0) {
                    var i = this.cart.indexOf(item);
                    this.cart.splice(i,1);
                }
            },
            onSubmit: function() {
                // console.log("start");
                this.products =[];
                this.results = [];
                this.loading = true;
                var path = "/search?q=".concat(this.search);
               this.$http.get(path)
                .then(function(responce){
                    setTimeout(function(){
                        this.results = responce.body;                   
                        this.lastSearch = this.search;
                        this.appendResults();  
                        this.loading = false;   
                    }.bind(this), 3000);                
                });
            },
            appendResults: function() {
            if(this.products.length < this.results.length) {
                var toAppend = this.results.slice(
                  this.products.length,
                    LOAD_NUM + this.products.length 
                );
                this.products = this.products.concat(toAppend);
            }
            },
        }, 
            filters: {
                currency: function(price) {
                    return "$".concat(price.toFixed(2));
                }
            }, 
            created: function() {
                this.onSubmit();
            },
            updated: function(){
            var sensor =document.querySelector("#product-list-bottom")
            watcher = scrollMonitor.create(sensor);
            watcher.enterViewport(this.appendResults);
            },
            beforeUpdate: function() {
                if (watcher) {
                    watcher.destroy();
                    watcher = null;
                }
                
            }
    });    
}, 3000)




