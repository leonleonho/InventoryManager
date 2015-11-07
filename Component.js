sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "./util/LoginDialog"
], function (UIComponent, JSONModel, LoginDialog) {
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
            // set data model
            var eventsModel = new sap.ui.model.json.JSONModel();
            // $.ajax({
            //     dataType: "json",
            //     url: oConfig.oDataService,
            //     beforeSend: function (xhr) {
            //         xhr.setRequestHeader("Authorization", "Basic " + btoa("lambmaster:asdf1234"));
            //         xhr.setRequestHeader("Accept", "application/json");
            //     },
            //     data: null
            // }).done(function(data){
            //     console.error(data);
            //     eventsModel.setData(data);
            //     eventsModel.refresh();
            // });

            this.setModel(eventsModel);
            sap.ui.getCore().setModel(eventsModel, "events");

            console.log(eventsModel);           

            this.getRouter().initialize();
        }
    });
});
