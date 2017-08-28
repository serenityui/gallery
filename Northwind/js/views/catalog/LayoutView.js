"use strict";

(function(Northwind, $, serenity, Handlebars) {
  Northwind.Views.Catalog.Layout = Northwind.Views.Base.extend({
    /// <summary>The layout view displays elements that appear in all the catalog views.</summary>

    // Data passed into the load function.
    __data: null,
    
    events: ["select"],

    templates: {
      // HTML for a category.
      category: Handlebars.compile("<li class='app-category-link' data-id='{{categoryID}}'><a>{{categoryName}}</a></li>")
    },

    render: function() {
      /// <summary>Render the view.</summary>

      var that = this;
      
      // Get jQuery objects for elements in the view.
      this._widgets.categories = $("ul.app-categories");
      
      this._widgets.categories.on("click", ".app-category-link", function () {
        var id = $(this).attr("data-id");
        that.trigger("select", { id: id });
      });
    },

    load: function(data) {
      /// <summary>Load the view with data.</summary>

      var that = this;

      this.__data = data;

      // For each of the categories, display a link that can be selected to display
      // category products.
      Enumerable.From(data.categories)
        .ForEach(function(category) {
          that._widgets.categories.append(that.templates.category(category));
        });
    },

    select: function(id) {
      /// <summary>Display a link as the selected link.</summary>
      /// <param type="String" name="id">
      /// The category id if the category was selected.
      /// </param>

      this.element.find(serenity.format("li[data-id='{0}']", id)).addClass("active");
    }
  });
}(window.Northwind, window.jQuery, window.serenity, window.Handlebars));