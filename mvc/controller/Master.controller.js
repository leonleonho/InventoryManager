sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/Members",
   "../model/Events"
], function (Controller, MessageToast, JSONModel, Members, Events) {
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
        var sPath = evt.getSource().getBindingContext().getPath();
        var oObject = this.getView().getModel().getProperty(sPath);
        console.log(oObject.eventID + " pressed");
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var bReplace = $.device.is.phone ? false : true;
        this.oRouter.navTo("Detail", {
            from:"Master",
            detailID: oObject.eventID
        }, bReplace);
    },
    onMenuPress: function() {
      sap.ui.getCore().getEventBus().publish("app", "authFailure", null);
    },
    loggedin: function() {
        Members.RetrieveAll().done((function(data){
            this.eventsModel.setData(data);
            this.eventsModel.refresh();
        }).bind(this));
    }, 
    changeJens: function() {
        var jens;
        if (this.toggle === true) {
            this.toggle = false;
            jens = Members.updateMember(2, {"fName": "Jens", "lName": "Christiansen"});
        } else {
            this.toggle = true;
            jens = Members.updateMember(2, {"fName": "Sonny", "lName": "Smith"});
        }
        this.getView().getModel().oData[1] = jens;
        this.eventsModel.refresh();
    }
});
});
