"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.Product = serenity.Model.extend({
        productID: null, 
        productName: null, 
        supplierID: null, 
        categoryID: null,
        quantityPerUnit: null,
        unitPrice: null,
        unitsInStock: null,
        unitsOnOrder: null,
        reorderLevel: null,
        discontinued: null,
        
        constructor: function (values, options) {
            
            options = { id: "productID" };
            
            serenity.Model.call(this, values, options);
        }
    });
}(window.Northwind, window.jQuery, window.serenity));
