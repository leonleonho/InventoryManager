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
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);

            this.eventBus = sap.ui.getCore().getEventBus();
            this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
        },

        handleRouteMatched : function(evt) {
            if (evt.getParameter("name") !== "detail") {
                return;
            }
            var params = evt.getParameters();
            this.eventID = params.arguments.detailID;
            this.bindModel();
        },

        bindModel: function() {
            this.eventsViewsModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.eventsViewsModel);
            EventsViews.Retrieve(this.eventID).done((function(data){
                this.eventsViewsModel.setData(data);
                this.eventsViewsModel.refresh();
                //console.log(this.eventsViewsModel);
            }).bind(this));
        },

        loggedin: function() {
            this.bindModel();
        }

        
    });
});