"use strict";

(function(Northwind, $, serenity, Handlebars) {
  Northwind.Views.Sales.Layout = Northwind.Views.Base.extend({
    /// <summary>The layout view displays elements that appear in all the sales views.</summary>

    // Data passed into the load function.
    __data: null,
    
    events: ["select"],

    templates: {
      // HTML for a sales rep.
      salesRep: Handlebars.compile("<li class='app-sales-link' data-id='{{employeeID}}'><a>{{firstName}} {{lastName}}</a></li>")
    },

    render: function() {
      /// <summary>Render the view.</summary>

      var that = this;
      
      // Get jQuery objects for elements in the view.
      this._widgets.annualSales = $("ul.app-annual-sales");
      this._widgets.salesReps = $("ul.app-sales-reps");
      
      this._widgets.annualSales.on("click", ".app-sales-link", function () {
        var id = $(this).attr("data-id");
        that.trigger("select", { type: "Annual", id: id });
      });
      
      this._widgets.salesReps.on("click", ".app-sales-link", function () {
        var id = $(this).attr("data-id");
        that.trigger("select", { type: "Rep", id: id });
      });
    },

    load: function(data) {
      /// <summary>Load the view with data.</summary>

      var that = this;

      this.__data = data;

      // For each of the employees, display a link that can be selected to display
      // sales information for the employee.
      Enumerable.From(data.employees)
        .ForEach(function(employee) {
          that._widgets.salesReps.append(that.templates.salesRep(employee));
        });
    },

    select: function(id) {
      /// <summary>Display a link (year or employee) as the selected link.</summary>
      /// <param type="String" name="id">
      /// The year if a year was selected or an employee id if the employee was selected.
      /// </param>

      this.element.find(serenity.format("li[data-id='{0}']", id)).addClass("active");
    }
  });
}(window.Northwind, window.jQuery, window.serenity, window.Handlebars));