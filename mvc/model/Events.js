sap.ui.define(["../../util/Service"],
   function (Service) {
      "use strict";

      function EventsModel(data) {
         this.dateCreated = data.dateCreated;
         this.eventDate = data.eventDate;
         this.eventID = data.eventID;
         this.eventName = data.eventName;
         this.hostID = data.hostID;
         this.location = data.location;
      }

      EventsModel.RetrieveAll = function(){
         var deferred = $.Deferred();
         Service.ajax({
               path: "Events"
            }).success((function(data){
               var models = [];
               data = data.value;
               for(var i=0; i < data.length; i++) {
                  models.push(new EventsModel(data[i]));
               }
               deferred.resolve(models);
            }).bind(this)).fail((function(data) {
                  deferred.reject(data);
                  console.error("EventsModel.RetrieveAll failed");
            }));
         return deferred;
      };
      return EventsModel;
});