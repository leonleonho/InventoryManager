sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter",
   "sap/ui/core/routing/History"
], function (Controller, MessageToast, JSONModel, ODataModel, Filter, History) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.MembersDetail", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function () {
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
          this.eventBus = sap.ui.getCore().getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
          this.memberModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(this.memberModel);
          this.inventoryList = this.byId("inventoryList");
          this.inventoryList.setBusy(true);
          this.core = sap.ui.getCore();
          this.oDataModelReady = $.Deferred();
          if(APP_CONFIG.state.auth.loggedIn) {
            this.loggedin();
          }
        },
        handlePress: function(evt) {
            var src = evt.getSource();
            var obj = src.getBindingContext().getObject();
            console.log(obj);
            MessageToast.show(evt.getSource().getId() + "Pressed");
        },
        onRouteMatched: function(evt) {
            var args = evt.getParameters().arguments;
            this.member = {
                memberID: args.detailID,
                fName: args.fName,
                lName: args.lName
            };
            this.memberModel.setData(this.member);
            this.initTable();
        },
        loggedin: function() {
          this.ODataModel = this.getOwnerComponent().getModel("oDataModel");
          this.oDataModelReady.resolve();
        },
        initTable: function() {
          this.oDataModelReady.done((function() {
            var filter = new Filter("memberID", sap.ui.model.FilterOperator.EQ, this.member.memberID);  
            this.membersList.setBusy(true);
            this.ODataModel.read("InventoryUsages", {
              filters: [filter],
              urlParameters: {
                $select: 'inventoryID, memberID, fName, lName, condition, purchasedAt, price'
              },
              success: (function(data){
                var temp = this.memberModel.getData();
                var checkedOut = this._retrieveSize(data.results, "memberID");
                temp.checkedOut = checkedOut;
                temp.Inventory = data.results;
                temp.total = data.results.length;
                this.inventoryModel.setData(temp);
                this.inventoryList.setBusy(false);
              }).bind(this)
            });
          }).bind(this));
        },
        conditionFormat: function(value) {
          return parseFloat(value);
        },
        priceFormatter: function(value){
          return "$"+parseFloat(value).toFixed(2);
        },
        _retrieveSize: function(obj, property) {
          var count=0;
          for(var i=0; i<obj.length; i++) {
            if(obj[i][property]) 
              count++;
          }
          return count;
        },
        handleNavBack: function() {
          var oHistory, sPreviousHash;
          oHistory = History.getInstance();
          sPreviousHash = oHistory.getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            this.oRouter.navTo("Members", {
              from: "MembersDetail"
            });
          }
        },
        onAddPress: function(){
          if(!this._addMenu) {
              this.addFragmentModel = new JSONModel();
              this._addMenu=sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.AddInventory", this.getView().getController());
              this.getView().addDependent(this._addMenu);
              this.getView().setModel(this.addFragmentModel, "addInventoryItems");
          }
          $.sap.delayedCall(0, this, function(){
              var data = {
                purchasedAt: "",
                condition: 5,
                price: undefined,
                quantity: 1
              };
              this.addFragmentModel.setData(data);
              this._addMenu.open();
          });
        },
        addFragmentCreate: function() {
          var data = this.addFragmentModel.getData();
          this._clearErrorStates();
          var error = false;
          if(!data.price || isNaN(data.price)){
            this.core.byId("addInventoryPrice").setValueState("Error")
            .setValueStateText("Must be a number");
            error = true;
          }
          if(!data.quantity || isNaN(data.quantity)){
            this.core.byId("itemQuantity").setValueState("Error")
            .setValueStateText("Must be a number");
            error = true;
          }
          if(!error) {
            var payload = {
              purchasedAt: data.purchasedAt,
              price: data.price,
              condition: data.condition,
              itemID: this.item.itemID,
              dateAdded: new Date().toISOString().slice(0, 19)
            };
            var deferreds = [];
            for(var i = 0; i < data.quantity; i++) {
              var deferred = $.Deferred();
              deferreds.push(deferred);
              this.ODataModel.create("Inventories", payload, {
                success: (function(){
                }).bind(this), error: function() {
                }
              });
            }
              this.initTable();
              MessageToast.show("Items Added");
              this._addMenu.close();
          }
        },
        _clearErrorStates: function() {
          this.core.byId("addInventoryPrice").setValueState("None")
            .setValueStateText("Must be a number");
          this.core.byId("itemQuantity").setValueState("None")
            .setValueStateText("Must be a number");
        },
        onDelete: function() {
          console.log("Deleted");
          this.ODataModel.remove("Items("+this.item.itemID+")", {
            success: function(){
              console.log("Deleted");
            }
          });
        },
        nameFormater: function(part1, part2) {
          if(!part1 && !part2) {
            return "In Inventory";
          }
          return part1 + " " + part2;
        },
        addFragmentCancel: function() {
          this._addMenu.close();
        },
        onRowDelete: function(evt) {
          var bindingCtx = evt.getSource().getParent().getBindingContext();
          this.ODataModel.remove("Inventories("+bindingCtx.getObject().inventoryID+")", {
            success: function(){
              MessageToast.show("Inventory Item Deleted");
            },
            error: function() {
              MessageToast.show("Failed To Delete Item");
            }
          });
          this.initTable();
        },
        onRatingPress: function(evt) {
          var src = evt.getSource();
          var obj = src.getBindingContext().getObject();
          var path = "Inventories("+obj.inventoryID+")";
          var payload = {condition: obj.condition};
          this.ODataModel.update(path, payload, {
            success: function() {
              MessageToast.show("Updated Entry");
            },
            error: function(err) {
              MessageToast.show("Failed to update entry");
              console.error(err);
            },
            merge: true
          });
        }
    });
});