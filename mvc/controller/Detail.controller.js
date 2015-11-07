sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/EventsViews"
], function (Controller, MessageToast, JSONModel, EventsViews) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.Detail", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
            console.log("evt:" + evt.detailID);
            this.eventsViewsModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.eventsViewsModel);
            EventsViews.Retrieve(1).done((function(data){
                this.eventsViewsModel.setData(data);
                this.eventsViewsModel.refresh();
            }).bind(this));
        },

        handlePress: function(evt) {
            MessageToast.show(evt.getSource().getId() + "Pressed");
        }

        
    });
});