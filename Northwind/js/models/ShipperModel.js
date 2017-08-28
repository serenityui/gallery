"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.Shipper = serenity.Model.extend({
        shipperID: null, 
        companyName: null,
        phone: null,
        
        constructor: function (values, options) {
            
            options = { id: "shipperID" };
            
            serenity.Model.call(this, values, options);
        }
    });
}(window.Northwind, window.jQuery, window.serenity));
