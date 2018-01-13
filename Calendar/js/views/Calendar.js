(function ($, serenity) {
    Calendar.Views.Calendar = serenity.Observable.extend({
        _widgets: null,

        _sources: null,

        constructor: function () {

            serenity.Observable.apply(this, arguments);

            this._widgets = {};
            this._sources = {};

            this.render();

            this._resize();

            this.load();

            $(window).on("resize", $.proxy(this._resize, this));
        },

        _resize: function () {
            /// <summary>Resize the widgets to fit the window size.</summary>

            var height = $(window).height() - 65;

            this._widgets.scheduler.option("height", height);
        },

        _loadCalendars: function () {
            /// <summary>Load the list of calendars into the "My Calendar" and "Other Calendar" panels.</summary>

            var that = this;
            
            var panelTemplate = Handlebars.compile($("#calendarPanelTemplate").html(), { noEscape: true });
            var template = Handlebars.compile($("#calendarTemplate").html(), { noEscape: true });
            
            var $calendars = $("#calendars");
            $calendars.empty();

            this._sources.calendarTypes.view().OrderBy("$.id").ForEach(function (calendarType) {
                console.log("calendarType", calendarType);
                
                $calendars.append(panelTemplate(calendarType));
                var $panel = $calendars.find(serenity.format("div[data-id='{0}']", calendarType.id));
                var panel = $panel.serenityPanel({
                    collapsible: true,
                    expander: {
                        collapse: "fa fa-caret-down",
                        expand: "fa fa-caret-right"
                    }
                }).data("serenityPanel");
                var $contents = panel.element.find(".sr-panel-body");
                
                Enumerable.From(that._sources.calendars.data())
                    .Where(function (calendar) {
                        return calendar.calendarTypeId === calendarType.id;
                    })
                    .ForEach(function (calendar) {
                        $contents.append(template(calendar));
                    });
            });
            
            $("i.sgc-calendar-show").on("click", $.proxy(this._onCalendarShowClick, this));
        },

        _onCalendarShowClick: function (e) {
            /// <summary>Handle the click event on the checkbox to show / hide a calendar on the scheduler.</summary>

            var that = this;
            
            var $checkbox = $(e.currentTarget);
            
            // Get the calendar id.
            var calendarId = parseInt($checkbox.closest("div.sgc-calendar").attr("data-id"));
            
            // Get the calendar.
            var calendar = Enumerable.From(this._sources.calendars.data())
                .Where(function (item) {
                    return item.id === calendarId;
                })
                .FirstOrDefault();
            
            calendar.set("show", !$checkbox.hasClass("fa-check-square-o"));
            
            Calendar.Stores.Calendar.updateCalendar(calendar).then(function () {
                that._widgets.scheduler._renderViews();
                that._loadCalendars.call(that);
            });
        },

        _onEventChange: function (e) {
            /// <summary>Handle the change event in the events data source.</summary>

            if (e.action === "remove") {
                // If the change event was triggered by a remove, then delete the event.
                Calendar.Stores.Event.deleteEvent(e.item);
            } else {
                // If the change event was triggered by an add or an edit, then save the event.
                Calendar.Stores.Event.saveEvent(e.item);
            }
        },

        _onMiniCalendarSelect: function (dateText, obj) {
            /// <summary>Handle the Mini Calendar date select event.</summary>

            // Set the selected date for the scheduler.
            this._widgets.scheduler.option("date", new Date(dateText));
        },

        _onSchedulerNavigate: function (event, ui) {
            /// <summary>Handle the Scheduler navigate event.</summary>

            // Set the selected date for the mini calendar.
            this._widgets.miniCalendar.datepicker("setDate", ui.date);
        },
        
        _onCalendarContextMenuIconClick: function (e) {
            /// <summary>Handle the calendar contextmenu icon click event.</summary>
            
            // Set the position of the calendar contextmenu and show it.
            this._widgets.calendarContextMenu.css({ top: e.clientY, left: e.clientX });
            this._widgets.calendarContextMenu.show();
            
            if (typeof this._widgets.calendarColorPalette == "undefined") {
                this._widgets.calendarColorPalette = $("#calendarColorPalette").serenityColorpalette({
                    columns: 6,
                    dataSource: [
                        { value: 1, color: "#AC725E" }, { value: 2, color: "#D06B64" }, { value: 3, color: "#F83A22" }, { value: 4, color: "#FA573C" }, { value: 5, color: "#FF7537" }, { value: 6, color: "#FFAD46" },
                        { value: 7, color: "#42D692" }, { value: 8, color: "#16A765" }, { value: 9, color: "#7BD148" }, { value: 10, color: "#B3DC6C" }, { value: 11, color: "#FBE983" }, { value: 12, color: "#FAD165" },
                        { value: 13, color: "#92E1C0" }, { value: 14, color: "#9FE1E7" }, { value: 15, color: "#9FC6E7" }, { value: 16, color: "#4986E7" }, { value: 17, color: "#9A9CFF" }, { value: 18, color: "#B99AFF" },
                        { value: 19, color: "#C2C2C2" }, { value: 20, color: "#CABDBF" }, { value: 21, color: "#CCA4AC" }, { value: 22, color: "#F691B2" }, { value: 23, color: "#CD74E6" }, { value: 24, color: "#A47AE2" }
                    ],
                    select: $.proxy(this._onColorPaletteSelect, this)
                });
            }
            
            this._widgets.calendarColorPalette.calendarId = parseInt($(e.currentTarget).closest("div.sgc-calendar").attr("data-id"));
        },
        
        _onColorPaletteSelect: function (event, ui) {
            /// <summary>Handle the calendar color palette event.</summary>
            
            var that = this;
            var colorItem = ui.sender.dataItem();
            var calendarId = this._widgets.calendarColorPalette.calendarId;
            var calendar = this._widgets.scheduler._calendarDataSource.get(function (item) { return item.id === calendarId; });
            
            calendar.set("color", colorItem.color);
            Calendar.Stores.Calendar.updateCalendar(calendar).then(function () {
                that._widgets.scheduler._renderViews();
                that._loadCalendars.call(that);
            });
        },
        
        _onDocumentClick: function (e) {
            /// <summary>Handle the document click event.</summary>
            
            // If the calendar context menu icon was not clicked, then hide the calendar
            // context menu.
            if ($(e.target).hasClass("sgc-calendar-contextmenuicon") === false) {
                this._widgets.calendarContextMenu.hide();
            }
        },

        render: function () {
            /// <summary>Render the view.</summary>

            this._widgets.miniCalendarPanel = $("#miniCalendarPanel").serenityPanel({
                collapsible: true,
                expander: {
                    collapse: "fa fa-caret-down",
                    expand: "fa fa-caret-right"
                }
            }).data("serenityPanel");

            this._widgets.miniCalendar = $("#miniCalendar");
            this._widgets.miniCalendar.datepicker({
                onSelect: $.proxy(this._onMiniCalendarSelect, this)
            });

            this._widgets.scheduler = $("#scheduler").serenityScheduler({
                navigation: {
                    dateRange: {
                        month: "{{serenity-formatDate current 'MMMM YYYY'}}"
                    }
                },
                navigate: $.proxy(this._onSchedulerNavigate, this)
            }).data("serenityScheduler");
            
            this._widgets.calendarContextMenu = $("#calendarContextMenu");
            
            $(document).on("click", $.proxy(this._onDocumentClick, this));
            
            $("#calendars").on("click", ".sr-panel-body .sgc-calendar-contextmenuicon", $.proxy(this._onCalendarContextMenuIconClick, this));
        },

        load: function () {
            /// <summary>Load information into the view.</summary>

            var that = this;

            serenity.overlay.show({ text: "Loading...", cssClass: "sgc-overlay-text" });

            Calendar.Stores.Calendar.getCalendarTypes().then(function (calendarTypes) {
                that._sources.calendarTypes = new serenity.DataSource({ 
                    data: calendarTypes
                });

                Calendar.Stores.Calendar.getCalendars().then(function (calendars) {
                    that._sources.calendars = new serenity.DataSource({ 
                        data: calendars,
                        filter: [{ field: "show", operator: "eq", value: true }]
                    });
                    
                    that._widgets.scheduler.setCalendarDataSource(that._sources.calendars);
                    
                    Calendar.Stores.Event.getEvents().then(function (events) {
                        that._sources.events = new serenity.DataSource({
                            data: events,
                            change: $.proxy(that._onEventChange, that)
                        });

                        that._widgets.scheduler.setDataSource(that._sources.events);
                        
                        that._loadCalendars.call(that);

                        that._resize();

                        serenity.overlay.hide();
                    });
                });
            });
        },
        
        select: function (date) {
            
            this._widgets.scheduler._setOptions({ date: moment(date, "DD-MM-YYYY").toDate(), view: { selected: "day" } });
        }
    });
})(jQuery, serenity);
