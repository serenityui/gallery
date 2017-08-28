"use strict";

(function(Northwind, $, serenity) {
  Northwind.Stores.Product = function(base) {
    /// <summary>Store for managing the Product information.</summary>

    var _url = {
      products: "data/Products.json",
      sales: "data/ProductSales.json",
      suppliers: "data/Suppliers.json",
      categories: "data/Categories.json"
    };

    function list() {

      return $.Deferred(function(deferred) {

        base.getJson("Products", _url.products).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                values.productID = parseInt(values.productID);
                values.categoryID = parseInt(values.categoryID);
                values.supplierID = parseInt(values.supplierID);
                values.quantityPerUnit = parseInt(values.quantityPerUnit);
                values.unitPrice = parseFloat(values.unitPrice);
                values.unitsInStock = parseInt(values.unitsInStock);
                values.unitsOnOrder = parseInt(values.unitsOnOrder);
                values.reorderLevel = parseInt(values.reorderLevel);
                values.discontinued = values.discontinued === "True" ? true : false;

                return new Northwind.Models.Product(values);
              })
              .ToArray();
          }

          deferred.resolve(data.model);
        });
      });
    }

    function sales() {

      return $.Deferred(function(deferred) {

        base.getJson("ProductSales", _url.sales).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                values.year = parseInt(values.year);
                values.total = parseFloat(values.total);

                return new Northwind.Models.ProductSale(values);
              })
              .ToArray();
          }

          deferred.resolve(data.model);
        });
      });
    }

    function suppliers() {

      return $.Deferred(function(deferred) {

        base.getJson("Suppliers", _url.suppliers).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                values.supplierID = parseInt(values.supplierID);

                return new Northwind.Models.Supplier(values);
              })
              .ToArray();
          }

          deferred.resolve(data.model);
        });
      });
    }

    function categories() {

      return $.Deferred(function(deferred) {

        base.getJson("Categories", _url.categories).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                return new Northwind.Models.Category(values);
              })
              .ToArray();
          }

          deferred.resolve(data.model);
        });
      });
    }
    
    function category(id) {

      return $.Deferred(function(deferred) {

        categories().then(function(list) {
          var category = Enumerable.From(list)
            .Where(serenity.format("category => category.categoryID === '{0}'", id))
            .FirstOrDefault();
          
          deferred.resolve(category);
        });
      });
    }
    
    return {
      list: list,
      sales: sales,
      suppliers: suppliers,
      categories: categories,
      category: category
    };
  }(Northwind.Stores.Base);
}(window.Northwind, window.jQuery, window.serenity));