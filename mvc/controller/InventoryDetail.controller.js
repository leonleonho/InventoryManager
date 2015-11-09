sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.InventoryDetail", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
            this.inventoryModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.inventoryModel);
        },
        handlePress: function(evt) {
            MessageToast.show(evt.getSource().getId() + "Pressed");
        },
        onRouteMatched: function(evt) {
            var args = evt.getParameters().arguments;
            var item = {
                detailID: args.detailID,
                itemName: args.itemName,
                itemDescription: args.itemDescription
            };
            this.inventoryModel.setData(item);
        }
    });
});
