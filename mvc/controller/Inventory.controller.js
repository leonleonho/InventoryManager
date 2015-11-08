sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "../model/EventsViews",
   "sap/ui/model/odata/ODataModel"
], function (Controller, MessageToast, JSONModel, EventsViews, ODataModel) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.Inventory", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
          this.eventBus = sap.ui.getCore().getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
          if("loggedin" in APP_CONFIG) {
            this.initModel();
          }
            
        
        },

        handlePress: function(evt) {
            var src = evt.getSource();
            var obj = src.getBindingContext("oDataModel").getObject();
            console.log(obj);
            MessageToast.show(evt.getSource().getId() + "Pressed");
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
          this.initModel();
        },
        initModel: function() {
          this.oInvoiceModel = new ODataModel(APP_CONFIG.oDataService, {
              maxDataServiceVersion: '4',
              headers: {
                "Authorization" : APP_CONFIG.state.auth.headers
              } 
            });
          this.getView().setModel(this.oInvoiceModel, "oDataModel");
        }
        
    });
});