Calendar.Models.Event = serenity.Model.extend({
    id: null,
    calendar: null,
    title: null,
    description: null,
    location: null,
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    repeatId: null,
    repeatException: null,
    repeatRule: null,

    constructor: function () {

        serenity.Model.apply(this, arguments);

        // If the instance id is not initialized, then create an id.
        if (this.id === null) {
            this.id = serenity.guid();
        }
    }
});