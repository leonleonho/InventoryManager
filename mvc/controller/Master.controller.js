sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/Events"
], function (Controller, MessageToast, JSONModel, Events) {
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
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var bReplace = $.device.is.phone ? false : true;
        this.oRouter.navTo("Detail", {
            from: "Master",
            detailID: oObject.eventID
        }, bReplace);
    },
    onMenuPress: function(evt) {
        if(!this._menuPopover) {
            this._menuPopover =sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.Menu", this);
            this.getView().addDependent(this._menuPopover);
        }
        var button = evt.getSource();
        $.sap.delayedCall(0, this, function(){
            this._menuPopover.openBy(button);
        });
    },
    loggedin: function() {
        Events.RetrieveAll().done((function(data){
            this.eventsModel.setData(data);
            this.eventsModel.refresh();
        }).bind(this));
    },
    onNavToProduct: function(evt) {
        var src = evt.getSource();
    }
});
});
