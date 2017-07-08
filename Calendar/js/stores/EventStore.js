Calendar.Stores.Event = function ($, serenity) {

    var _urls = {
        events: serenity.format("{0}data/Events.json?_=", Calendar.root, (new Date()).getTime())
    };
    
    var _events = {
        status: 0,
        list: []
    };
    
    function getEvents() {

        return $.Deferred(function (deferred) {
            if (_events.status === 0) {
                // The events have not been retrieved yet.
                
                // Set the status to be in progress.
                _events.status = 1;
                
                // Get the events.
                $.getJSON(_urls.events, function (list) {
                    // Populate a list of events.
                    Enumerable.From(list).ForEach(function (item) {
                        _events.list.push(new Calendar.Models.Event({
                            id: item.Id,
                            calendar: item.CalendarId,
                            title: item.Title,
                            description: item.Description,
                            startDate: moment(item.StartDate, "MM/DD/YYYY").toDate(),
                            startTime: item.StartTime,
                            endDate: moment(item.EndDate, "MM/DD/YYYY").toDate(),
                            endTime: item.EndTime,
                            repeatId: item.RepeatId,
                            repeatException: item.RepeatException,
                            repeatRule: item.RepeatRule
                        }));
                    });
                    
                    // Set the status to retrieved.
                    _events.status = 2;
                    
                    // Return the list of events.
                    deferred.resolve(_events.list); 
                });
            } else if (_events.status === 2) {
                // The events have already been retrieved.
                
                // Return the list of events.
                deferred.resolve(_events.list);
            } else {
                // The events are in the process of being retrieved.
                
                // Wait to see if the list has been retrieved yet.
                var wait = function () {
                    setTimeout(function () {
                        // Still being retrieved.  Wait some more.
                        if (_events.status < 2) {
                            wait();
                        } else {
                            // Return the list of events.
                            deferred.resolve(_events.list);
                        }
                    }, 500);
                }
                
                wait();
            }
        });
    }

    function saveEvent(event) {

        return $.Deferred(function (deferred) {
            deferred.resolve();
        });
    }

    function deleteEvent(event) {

        return $.Deferred(function (deferred) {
            deferred.resolve();
        });
    }
    
    function searchEvents(criteria) {
        
        return $.Deferred(function (deferred) {
            
            var text = criteria.what.toLowerCase();
            
            getEvents().then(function (events) {
                var results = Enumerable.From(events).Where(function (item) { 
                    return item.title.toLowerCase().indexOf(text) >= 0 
                        || item.description.toLowerCase().indexOf(text) >= 0;
                }).ToArray();
                deferred.resolve(results);
            });
        });
    }

    return {
        getEvents: getEvents,
        saveEvent: saveEvent,
        deleteEvent: deleteEvent,
        searchEvents: searchEvents
    }
}(jQuery, serenity);
