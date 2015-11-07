sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/Events",
   "../../util/Service"
], function (Controller, MessageToast, JSONModel, Events, Service) {
"use strict";
return Controller.extend("com.scout138.inventoryManager.mvc.controller.Detail", {
    /**
     * Standard UI5 Controller callback. Do most of the one-time controller
     * setup here.
     */
    onInit: function () {
        Service.Init(APP_CONFIG.oDataService, "lambmaster", "asdf1234");
        this.eventsModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.eventsModel);
        Events.RetrieveAll().done((function(data){
            this.eventsModel.setData(data);
            this.eventsModel.refresh();
        }).bind(this));
    },
    handlePress: function(evt) {
        MessageToast.show(evt.getSource().getId() + "Pressed");
    },

    onMenuPress: function() {
        
    }
});
});