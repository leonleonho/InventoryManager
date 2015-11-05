sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";
    return UIComponent.extend("com.scout138.inventoryManager.Component", {
        metadata : {
            manifest: "json"
        },
        appConfig: {
            "oDataService": "http://localhost/InventoryManager/mock/"
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            var oData = {
                recipient : {
                   name : "World"
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            window.appConfig = this.appConfig;
            console.warn("in Component.init()");
        }
    });
});
