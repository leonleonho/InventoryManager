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
        
        //var eventsModel = new JSONModel("http://localhost/InventoryManager/mock/events.json");
        var eventsModel = new JSONModel(window.appConfig.oDataService + 'events.json');
        /*
        $.ajax({
            dataType: "json",
            url: window.appConfig.oDataService + 'events.json',
            data: null
        }).done(function(data){
            eventsModel.setData(data);
            eventsModel.refresh();
            console.log(data);
        });
*/
        this.getView().setModel(eventsModel);
        
    },
    handlePress: function() {
        // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sRecipient = this.getView().getModel().getProperty("/recipient/name");
         var sMsg = oBundle.getText("helloMsg", [sRecipient]);
         // show message
         MessageToast.show(sMsg);
    },

    onMenuPress: function() {

    }
});
});