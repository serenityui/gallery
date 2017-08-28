"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.ProductSale = serenity.Model.extend({
        year: null, 
        categoryName: null,
        productName: null, 
        total: null
    });
}(window.Northwind, window.jQuery, window.serenity));
