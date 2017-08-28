"use strict";

(function(Northwind, $, serenity) {
  Northwind.Controllers.Catalog = Northwind.Controllers.Base.extend({
    /// <summary>Controller for catalog.</summary>

    __layout: null,
    __view: null,

    constructor: function() {
      /// <summary>Constructor for the catalog controller.</summary>

      Northwind.Controllers.Base.apply(this, arguments);
    },

    _layout: function() {
      /// <summary>
      /// Load the HTML for the catalog layout and create an instance of the Layout view.
      /// </summary>

      var that = this;

      return $.Deferred(function(deferred) {
        // Show the catalog link as being active.
        that._activate();
        
        // Load the HTML for the catalog layout.
        that._load("Layout").then(function() {
          // Create an instance of the Layout view and render the view.
          that.__layout = new Northwind.Views.Catalog.Layout({
            select: function (params) {
              Northwind.App.navigate(serenity.format("/Catalog/Category/{0}", params.id));
            }
          });
          that.__layout.render();
          // Get the categories.
          Northwind.Stores.Product.categories().then(function(categories) {
            that.__layout.element.find(".app-loading").hide();
            // Load the Layout view.
            that.__layout.load({
              categories: categories
            });
            deferred.resolve();
          });
        });
      });
    },

    categories: function(params) {
      /// <summary>
      /// Load the categories view.
      /// </summary>

      var that = this;

      // Load the catalog layout.
      this._layout();
    },
    
    category: function(params) {
      /// <summary>
      /// Load the category view.
      /// </summary>

      var that = this;

      // Load the catalog layout.
      this._layout().then(function() {
        // Get the element that will contain the HTML for the view.
        var $el = $("#main");
        // Load the HTML for the Category view.
        that._load("Category", $el).then(function() {
          // Create an instance of the Category view and render the view.
          that.__view = new Northwind.Views.Catalog.Category(null, $el);
          that.__view.render();

          // Select the category in the layout.
          that.__layout.select(params.id);

          // Get the category.
          Northwind.Stores.Product.category(params.id).then(function(category) {
            that.__view.load({
              category: category
            });
          });
        });
      });
    }
  });
}(window.Northwind, window.jQuery, window.serenity));