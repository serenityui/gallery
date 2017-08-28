"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.Supplier = serenity.Model.extend({
        supplierID: null,
        companyName: null,
        contactName: null,
        contactTitle: null,
        address: null,
        city: null,
        region: null,
        postalCode: null,
        country: null,
        phone: null,
        fax: null,
        
        constructor: function (values, options) {
            
            options = { id: "supplierID" };
            
            serenity.Model.call(this, values, options);
        }
    });
}(window.Northwind, window.jQuery, window.serenity));
