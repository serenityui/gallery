(function ($, serenity) {
    Calendar.Views.SearchResults = serenity.Observable.extend({

        _widgets: null,
        
        events: [
            /// <event>back</event>
            /// <summary>Triggered to show the calendar.</summary>
            "back",
            
            /// <event>dateSelect</event>
            /// <summary>Triggered when a date has been selected.</summary>
            "dateSelect"
        ],

        constructor: function () {

            serenity.Observable.apply(this, arguments);

            this._widgets = {};
            this._sources = {};

            this.render();
            
            this._initEvents();

            this._resize();
        },
        
        _onBackClick: function () {
            
            this.trigger("back");
        },
        
        _onSearchResultDateClick: function (event) {
            
            var date = $(event.currentTarget).attr("data-date");
            
            console.log("_onSearchResultDateClick", event, date);
            
            this.trigger("dateSelect", { date: date });
        },
        
        _initEvents: function () {
            
            $(".sgc-back").on("click", $.proxy(this._onBackClick, this));
            
            this._widgets.searchResults.element.on("click", ".sgc-search-result-date", $.proxy(this._onSearchResultDateClick, this));
        },
        
        _resize: function () {
            
        },
        
        render: function () {
            
            var that = this;
            
            Calendar.Stores.Calendar.getCalendars().then(function (calendars) {
                that.calendars = new serenity.DataSource({ data: calendars });
                
                that._widgets.searchResults = $("#searchResultsList").serenityTable({
                    altRowCss: null,
                    rowTemplate: function (item) {
                        var occuranceMoment = moment(item.startDate);
                        return serenity.format("<tr data-date='{0}'></tr>", occuranceMoment.format("DD-MM-YYYY"));
                    },
                    columns: [{
                        field: "startDate",
                        title: "Date",
                        width: "15em;",
                        styles: "padding:0.2em;"
                    }, {
                        field: "",
                        title: "Time",
                        template: function (item) {
                            var time = "";
                            var st = item.startTime;
                            var et = item.endTime;

                            if (typeof st === "string" && st.length > 0) {
                                time = serenity.format("{0} - {1}", st, et);
                            } else {
                                time = "All Day";
                            }
                            return time;
                        },
                        width: "200px"
                    }, {
                        field: "",
                        title: "Event",
                        template: function (item) {
                            var html = "";

                            try {
                                var calendarIndex = 0;
                                var calendar = that.calendars.get(function (calendar, cdx) {
                                    var result = calendar.id === item.calendar;
                                    if (result) {
                                        calendarIndex = cdx;
                                    }
                                    return result;
                                });
                                var repeatRule = item.repeatRule;
                                var isRepeat = (typeof repeatRule === "string" && repeatRule.length > 0);
                                html = $.serenity.scheduleragenda.prototype.html.title({ color: calendar.color, isRepeat: isRepeat, title: item.title });
                            } finally {
                                return html;
                            }
                        }
                    }],
                    dataBound: function (event, ui) {

                        var $rows = ui.sender.widgets.body.find("tr");
                        var date = null;
                        // var $startDateCell = null;
                        var span = { start: 0, end: 0 };
                        var agendaRow = 0;

                        var formatAgendaRow = function () {
                            var $startRow = $($rows[span.start]);
                            var $endRow = $($rows[span.end]);
                            var $startDateCell = $startRow.children("td:first");

                            // The start date cell spans all rows for the agenda date.
                            $startDateCell.attr("rowspan", (span.end - span.start) + 1);

                            // Remove the date cell from the other rows with the same agenda date.
                            for (var idx = (span.start + 1); idx <= span.end; idx++) {
                                $($rows[idx]).children("td:first").remove();
                            }

                            // If this is an alternate "agenda" row.
                            if (agendaRow % 2 !== 0) {
                                // Add the altrow style to all the rows in the "agenda" row.
                                for (var idx = span.start; idx <= span.end; idx++) {
                                    $($rows[idx]).addClass("sr-table-altrow");
                                }
                            }

                            // Display the date in the startDateCell.
                            var occuranceMoment = moment(date, "DD-MM-YYYY");
                            $startDateCell.addClass("sgc-search-result-date").attr("data-date", date);
                            $startDateCell.html(serenity.format("<div style='float:left;width:2em;font-size:2em;font-weight:bold;'>{0}</div>" +
                                                                "<div style='float:left;width:10em;'><div>{1}</div><div>{2}</div></div>", 
                                occuranceMoment.date(),
                                occuranceMoment.format("dddd"),
                                occuranceMoment.format("MMMM, YYYY")));
                        }

                        // Loop over all the rows in the table.
                        $rows.each(function (idx, tr) {
                            var $row = $(tr);

                            $row.addClass("ui-widget-content");

                            // Get the date.
                            var currentDate = $row.attr("data-date");

                            // If the date has changed.
                            if (currentDate !== date) {
                                // This is not the first row.
                                if (idx > 0) {
                                    // Set the last row in the "span" to the previous row.
                                    span.end = idx - 1;

                                    // Format the "agenda row".
                                    formatAgendaRow();

                                    // Set the start row to the current row.
                                    span.start = idx;

                                    agendaRow++;
                                }
                                date = currentDate;
                            }
                        });
                        if (date !== null) {
                            // Set the last row in the "span" to the last row in the table.
                            span.end = $rows.length - 1;

                            // Format the "agenda row".
                            formatAgendaRow();
                        }
                    }
                }).data("serenityTable");
            });
        },
        
        search: function (e) {
            
            var that = this;
            
            $("#searchResultsMessage").text("Searching for");
            $("#searchResultsCriteria").text(e.what);
            
            $("#searchResultsList").empty();
            
            Calendar.Stores.Event.searchEvents(e).then(function (list) {
                $("#searchResultsMessage").text(serenity.format("{0} results for", list.length));
                that._widgets.searchResults.dataSource().data(list);
            });
        }
    });
})(jQuery, serenity);
