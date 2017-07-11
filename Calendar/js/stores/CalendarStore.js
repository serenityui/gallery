Calendar.Stores.Calendar = function ($, serenity) {

    var _urls = {
        calendarTypes: serenity.format("data/CalendarTypes.json?_={0}", (new Date()).getTime()),
        calendars: serenity.format("data/Calendars.json?_={0}", (new Date()).getTime())
    };
    
    var _calendarTypes = [];
    
    var _calendars = {
        status: 0,
        list: []
    };
    
    function getCalendarTypes() {

        return $.Deferred(function (deferred) {
            if (_calendarTypes.length === 0) {
                $.getJSON(_urls.calendarTypes, function (list) {
                    Enumerable.From(list).ForEach(function (item) {
                        _calendarTypes.push(new Calendar.Models.CalendarType(item));
                    });
                    deferred.resolve(_calendarTypes);
                });
            } else {
                deferred.resolve(_calendarTypes);
            }
        });
    }

    function getCalendars() {

        return $.Deferred(function (deferred) {
            if (_calendars.status === 0) {
                // The data has not been retrieved yet.
                
                // Set the status to be in progress.
                _calendars.status = 1;

                // Get the data.
                $.getJSON(_urls.calendars, function (list) {
                    // Populate a list.
                    Enumerable.From(list).ForEach(function (item) {
                        _calendars.list.push(new Calendar.Models.Calendar(item));
                    });
                    
                    // Set the status to retrieved.
                    _calendars.status = 2;
                    
                    // Return the list.
                    deferred.resolve(_calendars.list);
                });
            } else if (_calendars.status === 2) {
                // The data has already been retrieved.
                
                // Return the list.
                deferred.resolve(_calendars.list);
            } else {
                // The data is in the process of being retrieved.
                
                // Wait to see if the list has been retrieved yet.
                var wait = function () {
                    setTimeout(function () {
                        // Still being retrieved.  Wait some more.
                        if (_calendars.status < 2) {
                            wait();
                        } else {
                            // Return the list.
                            deferred.resolve(_calendars.list);
                        }
                    }, 500);
                }
                
                wait();
            }
        });
    }
    
    function getColors() {
        
    }
    
    function updateCalendar(calendar) {
        
        return $.Deferred(function (deferred) {
            
            var original = Enumerable.From(_calendars.list)
                .Where(function (item) {
                    return item.id === calendar.id;
                })
                .FirstOrDefault();
            original.title = calendar.title;
            original.color = calendar.color;
            original.show = calendar.show;
            
            deferred.resolve();
        });
    }

    return {
        getCalendarTypes: getCalendarTypes,
        getCalendars: getCalendars,
        updateCalendar: updateCalendar
    }
}(jQuery, serenity);
