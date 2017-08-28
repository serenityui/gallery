"use strict";

(function(Northwind, $, serenity) {
  Northwind.Router = serenity.Router.extend({
    /// <summary>Router for the application.</summary>

    constructor: function(options) {
      /// <summary>Constructor for the router.</summary>

      // Call the base class constructor.
      serenity.Router.call(this, $.extend(true, {}, options, { root: "/" }) );

      // Initialize the routes.
      this.__initRoutes();
    },

    __initRoutes: function() {
      /// <summary>Initialize the routes for the application.</summary>

      // Default route will display annual sales for the most recent year.
      this.add("/", function() {
        Northwind.App.controller("Sales").annual();
      });

      // Display annual sales for the specified year.
      this.add("/Sales/Annual/:year", function(params) {
        Northwind.App.controller("Sales").annual(params);
      });

      // Display sales for a sales representative.
      this.add("/Sales/Rep/:id", function(params) {
        Northwind.App.controller("Sales").rep(params);
      });

      // Display categories for the catelog.
      this.add("/Catalog", function() {
        Northwind.App.controller("Catalog").categories();
      });

      // Display a catalog category.
      this.add("/Catalog/Category/:id", function(params) {
        Northwind.App.controller("Catalog").category(params);
      });
    }
  });
}(window.Northwind, window.jQuery, window.serenity));