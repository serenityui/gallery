(function($, serenity) {
  $.widget("northwind.orderDetailsDialog", $.ui.dialog, {
    options: {
      autoOpen: false,
      height: 400,
      modal: true,
      width: 650
    },
    
    table: null,
    
    _create: function () {
      
      this._super();
      
      this.table = this.element.find("#orderDetails").serenityTable({
        dataSource: new serenity.DataSource({
          data: [],
          aggregates: [
            {field: "total", calc: "sum"}
          ]
        }),
        columns: [{
          title: "Product",
          field: "productName",
          footerTemplate: "Order Total:",
          footerStyles: "float:left;"
        },{
          title: "Quantity",
          field: "quantity",
          styles: "text-align:right;",
          width: "100px"
        },{
          title: "Unit Price",
          field: "unitPrice",
          template: function (item) {
            return serenity.format("${0:N2}", item.unitPrice);
          },
          styles: "text-align:right;",
          width: "100px"
        },{
          title: "Discount",
          field: "discountPercent",
          styles: "text-align:right;",
          width: "100px"
        },{
          title: "Total",
          field: "total",
          template: function (item) {
            return serenity.format("${0:N2}", item.total);
          },
          styles: "text-align:right;padding-right:5px;",
          width: "100px",
          footerTemplate: function (aggregates) {
            return serenity.format("${0:N2}", aggregates.sum)
          },
          footerStyles: "float:right;padding-right:5px;"
        }],
        height: "250px",
        showCalculations: true
      }).data("serenityTable");
      
      this.element.find(".app-close-button").on("click", $.proxy(this._onCloseClick, this));
    },
    
    _onCloseClick: function () {
      
      this.close();
    },
    
    open: function (order) {
      
      var that = this;
      
      this._setOption("title", serenity.format("{0} Order Details", order.shipName));
      
      this._super();
      
      serenity.overlay.show({ element: this.element, text: "Loading Order Details..." });
      
      order.details().then(function (list) {
        serenity.overlay.hide();
        that.table.dataSource().data(list);
      });
    }
  });
})(window.jQuery, window.serenity);