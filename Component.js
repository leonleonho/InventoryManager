sap.ui.define([
    "sap/ui/core/UIComponent",
    "./util/LoginDialog",
    "sap/ui/model/odata/ODataModel"
], function (UIComponent, LoginDialog, ODataModel) {
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
            sap.ui.getCore().getEventBus().subscribe("app", "loggedin", this.loggedin, this);
            login.show();
            login.attemptAuth();
            this.getRouter().initialize();
        },
        initODataModel: function() {
            this.ODataModel = new ODataModel(APP_CONFIG.oDataService, {
              headers: {
                "Authorization": APP_CONFIG.state.auth.headers
              },
              defaultCountMode: "Inline"
            });
            this.setModel(this.ODataModel, "oDataModel");
        },
        loggedin: function(){
           this.initODataModel();
        }
    });
});
