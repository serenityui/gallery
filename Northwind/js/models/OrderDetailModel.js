"use strict";

(function(Northwind, $, serenity) {
  Northwind.Models.OrderDetail = serenity.Model.extend({
    orderID: null,
    productID: null,
    unitPrice: null,
    quantity: null,
    discount: null,

    product: null,

    total: {
      get: function() {
        return (this.unitPrice * this.quantity * (1 - this.discount) / 100) * 100;
      }
    },
    
    discountPercent: {
      get: function () {
        return serenity.format("{0:N1}%", this.discount * 100);
      }
    },
    
    productName: {
      get: function () {
        return this.product.productName;
      }
    }
  });
}(window.Northwind, window.jQuery, window.serenity));