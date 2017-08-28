"use strict";

(function(Northwind, $, serenity) {
  Northwind.Stores.Order = function(base) {
    /// <summary>Store for managing the Orders information.</summary>

    var _url = {
      orders: "data/Orders.json",
      details: "data/OrderDetails.json",
      shippers: "data/Shippers.json"
    };

    function list() {

      return $.Deferred(function(deferred) {

        base.getJson("Orders", _url.orders).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                values.orderID = parseInt(values.orderID);
                values.employeeID = parseInt(values.employeeID);
                values.freight = parseFloat(values.freight);
                values.shipVia = parseInt(values.shipVia);
                values.orderDate = new Date(values.orderDate);
                values.requiredDate = new Date(values.requiredDate);
                values.shippedDate = values.shippedDate === null ? null : new Date(values.shippedDate);

                return new Northwind.Models.Order(values);
              })
              .ToArray();
          }

          deferred.resolve(data.model);
        });
      });
    }

    function details() {

      return $.Deferred(function(deferred) {

        base.getJson("OrderDetails", _url.details).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                values.orderID = parseInt(values.orderID);
                values.productID = parseInt(values.productID);
                values.unitPrice = parseFloat(values.unitPrice);
                values.quantity = parseInt(values.quantity);
                values.discount = parseFloat(values.discount);

                return new Northwind.Models.OrderDetail(values);
              })
              .ToArray();
          }
          
          deferred.resolve(data.model);
        });
      });
    }

    function shippers() {

      return $.Deferred(function(deferred) {

        base.getJson("Shippers", _url.shippers).then(function(data) {
          if (data.model === null) {
            var list = [];

            data.model = Enumerable.From(data.json)
              .Select(function(item) {
                var values = base.mixedToCamelCase(item);

                values.shipperID = parseInt(values.shipperID);

                return new Northwind.Models.Shipper(values);
              })
              .ToArray();
          }

          deferred.resolve(data.model);
        });
      });
    }

    return {
      list: list,
      details: details,
      shippers: shippers
    };
  }(Northwind.Stores.Base);

}(window.Northwind, window.jQuery, window.serenity));