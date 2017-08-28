"use strict";

(function(Northwind, $, serenity) {
  Northwind.Models.Category = serenity.Model.extend({
    categoryID: null,
    categoryName: null,
    description: null,
    picture: null,

    constructor: function(values, options) {

      options = {
        id: "categoryID"
      };

      serenity.Model.call(this, values, options);
    },
    
    products: function () {
      /// <summary>Get the products for the category.</summary>
      
      var that = this;
      
      return $.Deferred(function(deferred) {
        Northwind.Stores.Product.list().then(function (list) {
          var products = Enumerable.From(list)
            .Where(serenity.format("product => product.categoryID == {0}", that.categoryID))
            .ToArray();
          
          deferred.resolve(products);
        });
      });
    }
  });
}(window.Northwind, window.jQuery, window.serenity));