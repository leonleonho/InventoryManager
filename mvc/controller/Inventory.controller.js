sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter"
], function (Controller, MessageToast, JSONModel, ODataModel, Filter) {
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
              headers: {
                "Authorization": APP_CONFIG.state.auth.headers,
                "Content-Type": "application/json"
              },
              defaultCountMode: "Inline"
            });
          this.getView().setModel(this.ODataModel, "oDataModel");
        },
        onSearch: function(evt) {
          var src = evt.getSource();
          var nameFilter = new Filter({
            path: "itemName",
            operator: "Contains",
            value1: src.getValue(),
          });
          var typeFilter = new Filter({
            path: "type",
            operator: "Contains",
            value1: src.getValue(),
          });
          var orFilter = new Filter({
            filters: [nameFilter, typeFilter],
            and: false
          });
          //var typeFilter = new Filter("type", sap.ui.model.FilterOperator.Contains, src.getValue());
          var bindings = this.byId("inventoryList").getBinding("items");          
          bindings.filter([orFilter]);
        },
        onAddPress: function(evt) {
          if(!this._addMenu) {
              this.addFragmentModel = new JSONModel({
                type: "",
                itemDescription: "",
                itemName: ""
              });
              this._addMenu=sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.AddInventory", this);
              this.getView().addDependent(this._addMenu);
              this.getView().setModel(this.addFragmentModel, "addInventory");
          }
          $.sap.delayedCall(0, this, function(){
              this._addMenu.open();
          });
        },
        addFragmentCancel: function(evt) {
          this._addMenu.close();
        },
        addFragmentCreate: function(evt) {
          var data = this.addFragmentModel.getJSON();
          console.log(data);
          var test = {}
          test.itemName = "ItemName";
          test.itemDescription= "itemDescption";
          this.ODataModel.create("Items", data);
          this._addMenu.close();
        }

    });
});
