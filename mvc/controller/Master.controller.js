sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/Events"
], function (Controller, MessageToast, JSONModel, Events, Service) {
"use strict";
return Controller.extend("com.scout138.inventoryManager.mvc.controller.Master", {
    /**
     * Standard UI5 Controller callback. Do most of the one-time controller
     * setup here.
     */
    onInit: function () {
        this.eventsModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.eventsModel);
        this.eventBus = sap.ui.getCore().getEventBus();
        this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
    },
    handlePress: function(evt) {
        console.log("pressed");
    },

    onMenuPress: function() {
    },
    loggedin: function() {
      Events.RetrieveAll().done((function(data){
            this.eventsModel.setData(data);
            this.eventsModel.refresh();
        }).bind(this));
    }
});
});
