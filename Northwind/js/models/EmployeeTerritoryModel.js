"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.EmployeeTerritory = serenity.Model.extend({
        employeeID: null,
        territoryDescription: null,
        regionDescription: null,
        
        constructor: function (values, options) {
            
            serenity.Model.call(this, values, options);
        },
        
        territory: {
            get: function () {
                return this.territoryDescription;
            },
            set: function (value) {
                this.territoryDescription = value;
            }
        },
        
        region: {
            get: function () {
                return this.regionDescription;
            },
            set: function (value) {
                this.regionDescription = value;
            }
        }
    });
}(window.Northwind, window.jQuery, window.serenity));
