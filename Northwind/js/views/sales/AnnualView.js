"use strict";

(function(Northwind, $, serenity) {
  Northwind.Views.Sales.Annual = Northwind.Views.Base.extend({
    /// <summary>The annual sales view displays sales information for the selected year.</summary>

    // Data passed into the load function.
    __data: null,

    _onResize: function() {
      /// <summary>Event handler for the window resize event.</summary>

      // Resize the chart to fit the width of the page.
      this._widgets.chart.redraw();
    },

    render: function() {
      /// <summary>Render the view.</summary>

      var that = this;

      serenity.overlay.show({
        text: "Loading...",
        cssClass: "app-loading-rep"
      });

      // Get jQuery objects for elements in the view.
      this._widgets.annual = this.element.find("#annual");
      this._widgets.year = this.element.find("#year");

      // Create a table to displays the values displayed in the chart.
      this._widgets.table = $("#table").serenityTable({
        dataSource: new serenity.DataSource({
          data: [],
          aggregates: [
            {field: "seriesValue", calc: "sum"}
          ]
        }),
        columns: [{
          field: "seriesName",
          title: "Name",
          sortable: true,
          footerTemplate: "Total Annual Sales:",
          footerStyles: "float:left;"
        }, {
          field: "seriesValue",
          title: "Value",
          styles: "text-align:right;padding-right:20px;",
          template: function(item) {
            return serenity.format("${0:N2}", item.seriesValue)
          },
          sortable: true,
          footerTemplate: function (aggregates) {
            return serenity.format("${0:N2}", aggregates.sum)
          },
          footerStyles: "float:right;padding-right:20px;"
        }],
        showCalculations: true
      }).data("serenityTable");

      // Create a chart to display sales information.
      this._widgets.chart = $("#chart").serenityChart({
        chart: {
          type: "column"
        },
        valueAxis: {
          gridLines: {
            width: 1
          },
          ticks: {
            format: "${0:N2}"
          }
        },
        seriesAxis: {
          seriesField: "categoryName",
          valueField: "total",
          valueAggregate: "sum",
          column: {
            colorByPoint: true,
            highlight: {
              enable: true
            }
          }
        },
        tooltip: {
          visible: true
        },
        dataSource: new serenity.DataSource(),
        dataBound: function(event, args) {
          /// <summary>When data is bound to the chart, set the data in the table.</summary>

          that._widgets.table.dataSource().data(args.chartData);
        }
      }).data("serenityChart");

      // Subscribe to the window resize event.
      $(window).on("resize", $.proxy(this._onResize, this))
    },

    load: function(data) {
      /// <summary>Load the view with data.</summary>

      this.__data = data;

      // Display the annual view.
      this._widgets.annual.show();

      // Display the sales year.
      this._widgets.year.text(data.year);

      // Display the annual sales in the chart.
      this._widgets.chart.dataSource().data(data.sales);
      
      serenity.overlay.hide();
    }
  });
}(window.Northwind, window.jQuery, window.serenity));