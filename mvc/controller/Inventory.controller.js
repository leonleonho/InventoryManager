sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter",
   "../../util/Service"
], function (Controller, MessageToast, JSONModel, ODataModel, Filter, Service) {
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
          this.ODataModel = this.getOwnerComponent().getModel("oDataModel");
        },
        onSearch: function(evt) {
          var src = evt.getSource();
          var nameFilter = new Filter({
            path: "itemName",
            operator: "Contains",
            value1: src.getValue()
          });
          var typeFilter = new Filter({
            path: "type",
            operator: "Contains",
            value1: src.getValue()
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
              this._addMenu=sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.AddItem", this);
              this.suggestionModel = new JSONModel();
              this.ODataModel.read("TypesViews", {
                success: (function(data){
                  this.suggestionModel.setData(data.results);
                }).bind(this)
              });
              this.getView().setModel(this.suggestionModel, "addSuggestionModel");
              this.getView().addDependent(this._addMenu);
              this.getView().setModel(this.addFragmentModel, "addInventory");
          }
          this._addMenu.setBusy(false); //Reset fragment
          this.addFragmentModel.setData({}); //Reset Data
          $.sap.delayedCall(0, this, function(){
              this._addMenu.open();
          });
        },
        addFragmentCancel: function(evt) {
          this._addMenu.close();
        },
        addFragmentCreate: function(evt) {
          var payload = this.addFragmentModel.getData();
          this._addMenu.setBusyIndicatorDelay(0);
          this._addMenu.setBusy(true);
          this.ODataModel.create("Items", payload, {
            success: function() {
              MessageToast.show("Item Created");
            },
            error: function() {
              MessageToast.show("Failed to create item, contact an admin if this persists");
            } 
          });
          this._addMenu.close();
        },
        handleDelete: function(evt) {
          var oList = evt.getSource().getParent();
          var swipedItem = oList.getSwipedItem();
          var swipedCtx = swipedItem.getBindingContext("oDataModel");
          this.ODataModel.remove("", swipedCtx);
          oList.removeAggregation("items", oList.getSwipedItem());
          oList.swipeOut();
        },
        onMenuItemPress: function(evt) {
          var viewName = evt.getSource().data().navView;
          if(viewName == "Inventory")
            return;
          this.oRouter.navTo(viewName);
        }

    });
});
