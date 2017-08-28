"use strict";

(function(Northwind, $, serenity) {
  Northwind.Models.Order = serenity.Model.extend({
    orderID: null,
    customerID: null,
    employeeID: null,
    orderDate: null,
    requiredDate: null,
    shippedDate: null,
    shipVia: null,
    freight: null,
    shipName: null,
    shipAddress: null,
    shipCity: null,
    shipRegion: null,
    shipPostalCode: null,
    shipCountry: null,

    constructor: function(values, options) {

      options = {
        id: "orderID"
      };

      serenity.Model.call(this, values, options);
    },

    orderMonthYear: {
      get: function() {
        /// <summary>Get the order date as a string formated as MM/yy.</summary>

        return serenity.format("{0:MM/yy}", this.orderDate);
      }
    },

    shortOrderDate: {
      get: function() {
        /// <summary>Get the date as a string formated as MM/dd/yyyy.</summary>

        return serenity.format("{0:MM/dd/yyyy}", this.orderDate);
      }
    },

    details: function() {

      var that = this;

      return $.Deferred(function(deferred) {

        Northwind.Stores.Order.details().then(function(details) {
          var list = Enumerable.From(details)
            .Where(function(detail) {
              return detail.orderID === that.orderID;
            })
            .ToArray();

          if (list[0].product === null) {
            Northwind.Stores.Product.list().then(function(products) {
              Enumerable.From(list).ForEach(function (detail) {
                  var product = Enumerable.From(products).Where(function (product) { return product.productID === detail.productID }).First();
                  detail.product = product;
                });
              deferred.resolve(list);
            });
          } else {
            deferred.resolve(list);
          }
        });
      });
    }
  });
}(window.Northwind, window.jQuery, window.serenity));