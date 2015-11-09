sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter"
], function (Controller, MessageToast, JSONModel, ODataModel, Filter) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.InventoryDetail", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
          this.core = sap.ui.getCore();
          this.eventBus = this.core.getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
          if("loggedin" in APP_CONFIG) {
              this.initModel();
          }
          this.inventoryModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(this.inventoryModel);
          this.inventoryList = this.byId("inventoryList");
          this.inventoryList.setBusy(true);
          this.oDataModelReady = $.Deferred();
        },
        handlePress: function(evt) {
            var src = evt.getSource();
            var obj = src.getBindingContext().getObject();
            console.log(obj);
            MessageToast.show(evt.getSource().getId() + "Pressed");
        },
        onRouteMatched: function(evt) {
            var args = evt.getParameters().arguments;
            this.item = {
                itemID: args.detailID,
                itemName: args.itemName,
                itemDescription: args.itemDescription
            };
            this.inventoryModel.setData(this.item);
            this.initTable();
        },
        loggedin: function(evt) {
            this.initModel();
        },
        initModel: function() {
            
            this.ODataModel = new ODataModel(APP_CONFIG.oDataService, {
              maxDataServiceVersion: '4',
              headers: {
                "Authorization": APP_CONFIG.state.auth.headers
              } 
            });
            this.oDataModelReady.resolve();
            this.getView().setModel(this.ODataModel, "oDataModel");
        },
        initTable: function() {
          this.oDataModelReady.done((function() {
            var filter = new Filter("itemID", sap.ui.model.FilterOperator.EQ, this.item.itemID);  
            this.inventoryList.setBusy(true);
            this.ODataModel.read("Inventories", {
              filters: [filter],
              success: (function(data){
                console.log(data);
                var temp = this.inventoryModel.getData();
                temp.Inventory = data.results;
                this.inventoryModel.setData(temp);
                this.inventoryList.setBusy(false);
              }).bind(this)
            });
          }).bind(this));
        },
        conditionFormat: function(value) {
          return (parseFloat(value) / 10) * 5;
        }
    });
});
