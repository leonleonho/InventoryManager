sap.ui.define([
   "sap/ui/core/UIComponent",
   "./util/LoginDialog"
], function (UIComponent, LoginDialog) {
    "use strict";
    return UIComponent.extend("com.scout138.inventoryManager.Component", {
        metadata : {
            manifest: "json"
        },

        init : function () {
            UIComponent.prototype.init.apply(this, arguments);
            var deviceModel = new sap.ui.model.json.JSONModel({
                isTouch : sap.ui.Device.support.touch,
                isNoTouch : !sap.ui.Device.support.touch,
                isPhone : sap.ui.Device.system.phone,
                isNoPhone : !sap.ui.Device.system.phone,
                listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
            });
            deviceModel.setDefaultBindingMode("OneWay");
            this.setModel(deviceModel, "device");
            window.APP_CONFIG = this.getMetadata().getConfig();
            var login = new LoginDialog(sap.ui.getCore());
            login.show();            
            login.attemptAuth();
            this.getRouter().initialize();
        }
    });
});
