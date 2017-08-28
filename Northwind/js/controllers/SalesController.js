"use strict";

(function(Northwind, $, serenity) {
  Northwind.Controllers.Sales = Northwind.Controllers.Base.extend({
    /// <summary>Controller for sales.</summary>

    __layout: null,
    __view: null,

    constructor: function() {
      /// <summary>Constructor for the sales controller.</summary>

      Northwind.Controllers.Base.apply(this, arguments);
    },

    _layout: function() {
      /// <summary>
      /// Load the HTML for the sales layout and create an instance of the Layout view.
      /// </summary>

      var that = this;

      return $.Deferred(function(deferred) {
        // Show the sales link as being active.
        that._activate();
        
        // Load the HTML for the sales layout.
        that._load("Layout").then(function() {
          // Create an instance of the Layout view and render the view.
          that.__layout = new Northwind.Views.Sales.Layout({
            select: function (params) {
              that.__view.destroy();
              Northwind.App.navigate(serenity.format("/Sales/{0}/{1}", params.type, params.id));
            }
          });
          that.__layout.render();
          // Get the employees.
          Northwind.Stores.Employee.list().then(function(employees) {
            // Load the Layout view.
            that.__layout.load({
              employees: employees
            });
            deferred.resolve();
          });
        });
      });
    },

    annual: function(params) {
      /// <summary>
      /// Load annual sales view.
      /// </summary>

      var that = this;

      // Load the sales layout.
      this._layout().then(function() {
        // Get the element that will contain the HTML for the view.
        var $el = $("#main");
        // Load the HTML for the Annual view.
        that._load("Annual", $el).then(function() {
          // Create an instance of the Annual view and render the view.
          that.__view = new Northwind.Views.Sales.Annual(null, $el);
          that.__view.render();

          // Get the product sales.
          Northwind.Stores.Product.sales().then(function(sales) {
            var year = null;

            // If a year was not passed in, then default to the
            // most recent year.                        
            if (typeof params === "undefined") {
              year = Enumerable.From(sales)
                .Distinct("sale => sale.year")
                .Select("sale => sale.year")
                .OrderByDescending()
                .First();
            } else {
              year = parseInt(params.year);
            }

            // Select the year in the layout.
            that.__layout.select(year);

            // Get the annual sales for the selected sales year.
            var annualSales = Enumerable.From(sales)
              .Where(serenity.format("sale => sale.year === {0}", year))
              .ToArray();

            // Load the data in the annual sales view.
            that.__view.load({
              year: year,
              sales: annualSales
            });
          });
        });
      });
    },

    rep: function(params) {
      /// <summary>
      /// Load the sales representative view.
      /// </summary>

      var that = this;

      // Load the sales layout.
      this._layout().then(function() {
        // Get the element that will contain the HTML for the view.
        var $el = $("#main");
        // Load the HTML for the Representative view.
        that._load("Representative", $el).then(function() {
          // Create an instance of the Representative view and render the view.
          that.__view = new Northwind.Views.Sales.Representative(null, $el);
          that.__view.render();

          // Select the representative in the layout.
          that.__layout.select(params.id);

          // Get the employee.
          Northwind.Stores.Employee.get(params.id).then(function(employee) {
            that.__view.load({
              employee: employee
            });
          });
        });
      });
    }
  });
}(window.Northwind, window.jQuery, window.serenity));