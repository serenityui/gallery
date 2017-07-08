(function ($, serenity) {
    Calendar.Views.Search = serenity.Observable.extend({

        _widgets: null,

        _sources: null,

        events: [
            /// <event>search</event>
            /// <summary>Triggered when a search is initiated.</summary>
            /// <param name="e.what" type="String">What to search for.</param>
            "search"
        ],

        constructor: function () {

            serenity.Observable.apply(this, arguments);
            
            this._widgets = {};
            this._sources = {};

            this.render();

            this.load();
        },

        _onSearchCriteriaKeypress: function (e) {
            /// <summary>Handle the keypress event on the search criteria input field.</summary>

            if (e.which === 13) {
                console.log("Enter", this.searchCriteria.val());

                this._basicSearch();
            }
        },

        _onBasicSearchButtonClick: function (e) {
            /// <summary>Handle the click event on the "basic" search button.</summary>

            this._basicSearch();
        },

        _basicSearch: function () {

            var what = this.searchCriteria.val();

            if (what.length > 0) {
                this.trigger("search", { what: what });
            }
        },

        render: function () {
            /// <summary>Render the view.</summary>

            var that = this;

            this.searchForm = $("#searchForm");
            this.searchCriteria = $("#searchCriteria");
            this.basicSearchButton = $("#basicSearchButton");

            this._widgets.searchCalendar = $("#searchCalendar").serenityDropdownlist({
                textField: "title",
                valueField: "id"
            }).data("serenityDropdownlist");

/* THIS BROKE THE DATE PICKERS IN THE EVENT DIALOG

            this._widgets.searchFromDate = $("#searchFromDate");
            this._widgets.searchFromDate.datepicker();

            this._widgets.searchToDate = $("#searchToDate");
            this._widgets.searchToDate.datepicker();

            // For the widget "dropdowns" to display properly, they need
            // to be appended to the search form.
            this._widgets.searchCalendar.menuWrap.appendTo(this.searchForm);
            this._widgets.searchFromDate.data("datepicker").dpDiv.appendTo(that.searchForm);
            this._widgets.searchToDate.data("datepicker").dpDiv.appendTo(that.searchForm);
*/
            // Subscribe to events.
            this.searchCriteria.on("keypress", $.proxy(this._onSearchCriteriaKeypress, this));
            this.basicSearchButton.on("click", $.proxy(this._onBasicSearchButtonClick, this));
        },

        load: function () {
            /// <summary>Load information into the view.</summary>

            var that = this;

            Calendar.Stores.Calendar.getCalendars().then(function (calendars) {
                calendars.unshift({ id: 0, title: "All Calendars", show: true });
                that._sources.calendars = new serenity.DataSource({ 
                    data: calendars,
                    filter: [{ field: "show", operator: "eq", value: true }]
                });

                that._widgets.searchCalendar.setDataSource(that._sources.calendars);
            });
        },
        
        clear: function (e) {
            
            this.searchCriteria.val("");
        }
    });
})(jQuery, serenity);
