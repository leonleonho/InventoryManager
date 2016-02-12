sap.ui.define(["../../util/Service",
   "Members"
   ], function (Service, MembersModel) {
      "use strict";

      this.members = [];
      this.items = [];

      function EventsViewsModel(data) {
         this.members.push(new MembersModel({
            memberID: data.memberID,
            fName: data.fName,
            lName: data.lName,
            address: data.address,
            email: data.email,
            phone: data.phone,
         }));
         // this.eventID = data.eventID;
         // this.dateCreated = data.dateCreated;
         // this.hostFName = data.hostFName;
         // this.hostLName = data.hostLName;
         // this.eventName = data.eventName;
         // this.location = data.location;
      }

      EventsViewsModel.Retrieve = function(eventID){
         var deferred = $.Deferred();

         Service.ajax({
               path: "EventsViews?$filter=eventID eq " +
                  eventID + "&$inlinecount=allpages"
            }).success((function(data){
               var models = [];
               data = data.value;
               for(var i=0; i < data.length; i++) {
                  models.push(new EventsViewsModel(data[i]));
                  console.log(data[i]);
               }
               deferred.resolve(models);
            }).bind(this)).fail((function(data) {
                  deferred.reject(data);
                  console.error("fail");
            }));
         return deferred;
      };
      return EventsViewsModel;
});