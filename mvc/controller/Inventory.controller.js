sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel"
], function (Controller, MessageToast, JSONModel, ODataModel) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.Inventory", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
          this.core = sap.ui.getCore();
          this.eventBus = this.core.getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          if(APP_CONFIG.state.auth.loggedIn) {
            this.initModel();
          }  
        },

        handlePress: function(evt) {
            var src = evt.getSource();
            var obj = src.getBindingContext("oDataModel").getObject();
            console.log(obj);
            this.oRouter.navTo("InventoryDetail", {
              from: "Inventory",
              detailID: obj.itemID,
              itemName: obj.itemName,
              itemDescription: obj.itemDescription
            });
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
          this.ODataModel = new ODataModel(APP_CONFIG.oDataService, {
              maxDataServiceVersion: '4',
              headers: {
                "Authorization": APP_CONFIG.state.auth.headers
              } 
            });
          this.getView().setModel(this.ODataModel, "oDataModel");
        }
        
    });
});
