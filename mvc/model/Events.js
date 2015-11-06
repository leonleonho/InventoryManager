sap.ui.define(["../../util/Service"],
   function (Service) {
      "use strict";
      var service;
      function EventsModel(data) {
         this.dateCreated = data.dateCreated;
         this.eventDate = data.eventDate;
         this.eventID = data.eventID;
         this.eventName = data.eventName;
         this.hostID = data.hostID;
         this.location = data.location;
      }
      EventsModel.Init = function(username, password){
         service = new Service(APP_CONFIG.oDataService, username, password);
      }
      EventsModel.RetrieveAll = function(){
         var deferred = $.Deferred();
         service.ajax({
               path: "Events"
           }).done((function(data){
               var models = [];
               data = data.value;
               for(var i=0; i < data.length; i++) {
                  models.push(new EventsModel(data[i]));
               }
               deferred.resolve(models);    
           }).bind(this));
         return deferred;
      }   
      return EventsModel;
});