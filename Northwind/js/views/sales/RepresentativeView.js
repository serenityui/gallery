"use strict";

(function(Northwind, $, serenity) {
  Northwind.Views.Sales.Representative = Northwind.Views.Base.extend({
    /// <summary>The sales representative view displays sales information for the selected sales representative.</summary>

    // Order details dialog.
    _orderDetailsDialog: null,
    
    // Data passed into the load function.
    _data: null,

    render: function() {
      /// <summary>Render the view.</summary>

      serenity.overlay.show({
        text: "Loading...",
        cssClass: "app-loading-rep"
      });

      this._widgets.name = this.element.find("#employeeName");
      this._widgets.photo = this.element.find("#employeeImage");
      this._widgets.title = this.element.find("#employeeTitle");
      this._widgets.homePhone = this.element.find("#employeeExtension");
      this._widgets.extension = this.element.find("#employeeHomePhone");
      this._widgets.address = this.element.find("#employeeAddress");
      this._widgets.hireDate = this.element.find("#employeeHireDate");
      this._widgets.cityRegionPostal = this.element.find("#employeeCityRegionPostal");
      this._widgets.reportsTo = this.element.find("#employeeReportsTo");
      this._widgets.country = this.element.find("#employeeCountry");
      this._widgets.notes = this.element.find("#employeeNotes");

      // Create a chart to display sales information.
      this._widgets.chart = $("#chart").serenityChart({
        chart: {
          type: "column"
        },
        valueAxis: {
          gridLines: {
            width: 1
          }
        },
        seriesAxis: {
          seriesField: "orderMonthYear",
          valueField: "orderMonthYear",
          valueAggregate: "count",
          column: {
            colorByPoint: true,
            allowPointSelect: true,
            highlight: {
              enable: true
            }
          }
        },
        tooltip: {
          visible: true
        },
        seriesClick: $.proxy(this._onChartSeriesClick, this),
        dataSource: new serenity.DataSource()
      }).data("serenityChart");
      
      // Create a table to display orders.
      this._widgets.orders = $("#orders").serenityTable({
        columns: [{
          title: "&nbsp;",
          //field: "orderID",
          template: "<i class='fa fa-shopping-cart app-order-details' aria-hidden='true' data-order-id='{{orderID}}'></i>",
          styles: "text-align:center;",
          width: "3em"
        }, {
          title: "Order Date",
          field: "shortOrderDate",
          sortable: true
        }, {
          title: "Customer",
          field: "customerID",
          sortable: true,
          filterable: true
        }, {
          title: "Order",
          field: "shipName",
          sortable: true,
          filterable: true
        }]
      }).data("serenityTable");

      this._widgets.orders.element.hide();
      this._widgets.ordersMonthYear = $("#ordersMonthYear");
      
      $("#orders").on("click.sales-rep", ".app-order-details", $.proxy(this._onOrderDetailsClick, this));
      
      $(window).on("resize.sales-rep", $.proxy(this._onResize, this));
    },

    _onChartSeriesClick: function(event, args) {
      /// <summary>When a chart series is clicked, show the orders for the selected month and year.</summary>

      Northwind.App.notification.hide();

      this._widgets.orders.element.show();
      this._widgets.ordersMonthYear.show();
      
      this._widgets.ordersMonthYear.text(args.item.seriesName);

      var orders = this._widgets.chart.dataSource().view()
        .Where(function(order) {
          return order.orderMonthYear === args.item.seriesName;
        })
        .ToArray();

      this._widgets.orders.dataSource().filter([]).sort([]).data(orders);
    },
    
    _onOrderDetailsClick: function (event, args) {
      /// <summary>When the icon for the order details is clicked, show the orders dialog.</summary>
      
      var orderID = parseInt($(event.target).attr("data-order-id"));
      
      var order = this._widgets.orders.dataSource().view()
        .Where(serenity.format("order => order.orderID === {0}", orderID))
        .FirstOrDefault();
      
      var dialog = this._getOrderDetailsDialog();
      dialog.open(order);
    },
    
    _onResize: function (event, args) {
    
      this._widgets.chart.redraw();
    },
    
    _getOrderDetailsDialog: function () {
      
      if (this._orderDetailsDialog === null) {
        // If  the dialog wasn't removed, then remove the element now.
        $("div[aria-describedby='orderDetailsDialog']").remove();
        
        // Create an instance of the dialog.
        this._orderDetailsDialog = $("#orderDetailsDialog").orderDetailsDialog().data("northwind-orderDetailsDialog");
      }
      return this._orderDetailsDialog;
    },
    
    load: function(data) {
      /// <summary>Load the view with data.</summary>

      var that = this;

      this._data = data;

      // Display the employee information.
      this._widgets.name.text(data.employee.fullName);
      this._widgets.photo.attr("src", serenity.format("data:image/bmp;base64,{0}", data.employee.photo));
      this._widgets.title.text(data.employee.title);
      this._widgets.homePhone.text(data.employee.homePhone);
      this._widgets.extension.text(data.employee.extension);
      this._widgets.address.text(data.employee.address);
      this._widgets.hireDate.text(data.employee.shortHireDate);
      this._widgets.cityRegionPostal.text(data.employee.cityRegionPostal);
      this._widgets.reportsTo.text(data.employee.reportsTo.fullName);
      this._widgets.country.text(data.employee.country);
      this._widgets.notes.text(data.employee.notes);

      // Display the employee sales.
      data.employee.sales().then(function(list) {
        that._widgets.chart.dataSource().data(list);
        serenity.overlay.hide();
        Northwind.App.notification.show();
      });
    },
    
    destroy: function () {
      
      $("#orders").off(".sales-rep");
      $(window).off(".sales-rep");
      if (this._orderDetailsDialog !== null) {
        this._orderDetailsDialog.destroy();
      }
    }
  });
}(window.Northwind, window.jQuery, window.serenity));