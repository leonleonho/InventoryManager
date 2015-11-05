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
            
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            var oData = {
                recipient : {
                   name : "World"
                }
            };

            var oModel = new JSONModel(oData);
            this.setModel(oModel, "oData");

            window.appConfig = this.appConfig;


            var oConfig = this.getMetadata().getConfig();
            var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
            var oDataModel = new JSONModel(jQuery.sap.getModulePath(sNamespace, oConfig.oDataService + 'events.json'));
            this.setModel(oDataModel, "oDataService");
            this.getRouter().initialize();
        }
    });
});
