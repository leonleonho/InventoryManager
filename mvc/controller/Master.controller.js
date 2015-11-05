sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
"use strict";
return Controller.extend("com.scout138.inventoryManager.mvc.controller.Master", {
    /**
     * Standard UI5 Controller callback. Do most of the one-time controller
     * setup here.
     */
    onInit: function () {
        var eventsModel = new JSONModel();
        $.ajax({
            dataType: "json",
            url: window.appConfig.oDataService + 'events.json',
            data: null
        }).done(function(data){
            eventsModel.setData(data);
            eventsModel.refresh();
            console.log(data);
        });
        this.getView().setModel(eventsModel);
    },
    handlePress: function() {
        
    }
});
});