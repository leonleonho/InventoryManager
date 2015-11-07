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
            window.APP_CONFIG = this.getMetadata().getConfig();
            var login = new LoginDialog(sap.ui.getCore());
            login.show();
            this.getRouter().initialize();
        }
    });
});
