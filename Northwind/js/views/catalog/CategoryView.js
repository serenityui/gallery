"use strict";

(function(Northwind, $, serenity) {
  Northwind.Views.Catalog.Category = Northwind.Views.Base.extend({
    /// <summary>The category view displays the products within a category.</summary>

    // Data passed into the load function.
    __data: null,

    render: function() {
      /// <summary>Render the view.</summary>

      serenity.overlay.show({
        text: "Loading...",
        cssClass: "app-loading-rep"
      });
      
      // Get jQuery objects for elements in the view.
      this._widgets.name = this.element.find("#categoryName");
      this._widgets.picture = this.element.find("#categoryImage");
      this._widgets.description = this.element.find("#categoryDescription");
      
      this._widgets.products = this.element.find("#products").serenityTable({
        columns: [{
          title: "Name",
          template: function (item) {
            return item.discontinued === true
              ? serenity.format("{0} (discontinued)", item.productName)
              : item.productName;
          }
        },{
          field: "unitPrice",
          title: "Unit Price",
          template: function (item) {
            return serenity.format("${0:F2}", item.unitPrice);
          },
          styles: "text-align:right;padding-right:25px;",
          width: "150px"
        },{
          field: "reorderLevel",
          title: "Reorder Level",
          styles: function (item) {
            var styles = "text-align:right;padding-right:25px;";
            if (item.unitsInStock < item.reorderLevel) {
              styles += "color:red;font-weight:bold;"
            }
            return styles;
          },
          width: "150px"
        },{
          field: "unitsInStock",
          title: "Units in Stock",
          styles: function (item) {
            var styles = "text-align:right;padding-right:25px;";
            if (item.unitsInStock < item.reorderLevel) {
              styles += "color:red;font-weight:bold;"
            }
            return styles;
          },
          width: "150px"
        },{
          field: "unitsOnOrder",
          title: "Units on Order",
          styles: "text-align:right;padding-right:25px;",
          width: "150px"
        }],
        rowTemplate: function (item) {
          if (item.discontinued === true) {
            return "<tr style='font-style:italic;opacity:0.6;'></tr>";
          } else {
            return "<tr></tr>";
          }
        }
      }).data("serenityTable");
    },

    load: function(data) {
      /// <summary>Load the view with data.</summary>

      var that = this;
      
      this.__data = data;
      
      // Display the category information.
      this._widgets.name.text(data.category.categoryName);
      this._widgets.picture.attr("src", serenity.format("data:image/bmp;base64,{0}", data.category.picture));
      this._widgets.description.text(data.category.description);
      
      data.category.products().then(function (list) {
        
        that._widgets.products.dataSource().data(list);
        
        serenity.overlay.hide();
      });
    }
  });
}(window.Northwind, window.jQuery, window.serenity));