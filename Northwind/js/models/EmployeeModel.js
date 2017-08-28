"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.Employee = serenity.Model.extend({
        employeeID: null,
        firstName: null,
        lastName: null,
        title: null,
        titleOfCourtesy: null,
        reportsToID: null,
        birthDate: null,
        hireDate: null,
        address: null,
        city: null,
        region: null,
        country: null,
        postalCode: null,
        extension: null,
        homePhone: null,
        notes: null,
        photo: null,
        
        reportsTo: null,
        
        constructor: function (values, options) {
            
            options = { id: "employeeID" };
            
            serenity.Model.call(this, values, options);
        },
        
        fullName: {
            get: function () {
                return serenity.format("{0} {1}", this.firstName, this.lastName);
            }
        },
        
        cityRegionPostal: {
            get: function () {
                return serenity.format("{0}, {1} {2}", this.city, this.region, this.postalCode);
            }
        },

        shortHireDate: {
            get: function () {
                /// <summary>Get the date as a string formated as MM/dd/yyyy.</summary>

                return serenity.format("{0:MM/dd/yyyy}", this.hireDate);
            }
        },
        
        sales: function () {
            /// <summary>Get the sales for the employee.</summary>
            
            var that = this;
            
            return $.Deferred(function (deferred) {
                Northwind.Stores.Order.list().then(function (orders) {
                    var list = Enumerable.From(orders)
                        .Where(function (order) {
                            return order.employeeID === that.employeeID;
                        })
                        .ToArray();

                    deferred.resolve(list);
                });
            });
        }
    });
}(window.Northwind, window.jQuery, window.serenity));
