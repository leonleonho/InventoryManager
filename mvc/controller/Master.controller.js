sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/Members"
], function (Controller, MessageToast, JSONModel, Members) {
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
      this.byId("masterList").setSelectedItemById("__item0-__xmlview1--masterList-1");
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
            jens = Members.updateMember(1, {"fName": "ima", "lName": " loser"});
        } else {
            this.toggle = true;
            jens = Members.updateMember(1, {"fName": "I really", "lName": " suck"});
        }
        this.getView().getModel().oData[1] = jens;
        this.eventsModel.refresh();
    }
});
});
