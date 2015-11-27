sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter",
   "sap/ui/core/routing/History",
   "../../util/Service"
], function (Controller, MessageToast, JSONModel, ODataModel, Filter, History, Service) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.EventDetail", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
          this.eventBus = sap.ui.getCore().getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);        
          this.inventoryModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(this.inventoryModel);
          this.inventoryList = this.byId("inventoryList");
          this.core = sap.ui.getCore();
          this.service = Service;
          this.oDataModelReady = $.Deferred();
          if(APP_CONFIG.state.auth.loggedIn) {
            this.loggedin();
          }
        },
        onRouteMatched: function(evt) {
          var params = evt.getParameters();
          if(params.name != "EventDetail") {
            this.byId("inventoryDetailPage").setVisible(false);
            return;
          }else {
            this.byId("inventoryDetailPage").setVisible(true);
          }
          var args = params.arguments;
          this.item = {
              itemID: args.detailID,
              itemName: args.itemName,
              itemDescription: args.itemDescription
          };
          this.inventoryModel.setData(this.item);
          this.initTable();
        },
        loggedin: function(evt) {
          this.ODataModel = this.getOwnerComponent().getModel("oDataModel");
          this.oDataModelReady.resolve();
        },
        initTable: function() {
          
          this.oDataModelReady.done((function() {
            var filter = new Filter("itemID", sap.ui.model.FilterOperator.EQ, this.item.itemID);  
            this.inventoryList.getBinding("items").filter(filter);
            var path = "InventoryUsages"
            this.service.ajax({
              path: path+"?$inlinecount=allpages&$top=0&$filter=(itemID+eq+"+this.item.itemID+")"
            }).done((function(data){
              var temp = this.inventoryModel.getData();
              temp.total = data["odata.count"];
              this.inventoryModel.setData(temp);
              this.inventoryModel.refresh();
            }).bind(this)).fail(function(reason){
              console.error(reason);
            });
              path: 
            this.service.ajax({
              path: path+"?$inlinecount=allpages&$top=0&$filter=(fName+ne+null)and(fName+ne+null)and(itemID+eq+"+this.item.itemID+")"
            }).done((function(data){
              var temp = this.inventoryModel.getData();
              temp.checkedOut = data["odata.count"];
              this.inventoryModel.setData(temp);
              this.inventoryModel.refresh();
            }).bind(this)).fail(function(reason){
              console.error(reason);
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
            this.oRouter.navTo("Inventory", {
              from: "InventoryDetail"
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
          this.addFragmentModel.setData({});
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
            success: (function(){
              MessageToast.show("Delete Item");
              this.oRouter.navTo("Inventory", {
                from: "InventoryDetail"
              });
            }).bind(this)
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
          var bindingCtx = evt.getSource().getParent().getBindingContext("oDataModel");
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
          var obj = src.getBindingContext("oDataModel").getObject();
          var path = APP_CONFIG.oDataService + "Inventories("+obj.inventoryID+")";
          var payload = {
            condition: evt.getParameter("value").toString()
          };
          OData.request({ //OData model update doesnt work for some reason
            requestUri: path,
            headers: {Authorization: APP_CONFIG.state.auth.headers},
            method: "PATCH",
            data: payload // json object with the new entry
            },
            function(insertedItem) {
                MessageToast.show("Updated Entry");
            },
            function(err) {
              MessageToast.show("Failed to update entry");
              console.error(err);
            }
          );  
        },
        onRowPress: function(evt) {
          if(!this._memberPopover) {
              this._memberPopover =sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.MemberDetailPopOver", this);
              this._memberPopover.setBusyIndicatorDelay(0);
              this.memberInfo = new JSONModel({});
              this.getView().setModel(this.memberInfo, "memberInfo");
              this.getView().addDependent(this._memberPopover);
          }
          var row = evt.getSource();
          var data = row.getBindingContext("oDataModel").getObject();
          this._memberPopover.setBusy(true);
          this._memberPopover.openBy(row)
          this.ODataModel.read("Members("+data.memberID+")", {
              success: (function(data){
                this.memberInfo.setData(data);
                this._memberPopover.setBusy(false);
              }).bind(this),
              error: (function(data){
                MessageToast.show("Failed to retrieve member info");
                this._memberPopover.close()
              }).bind(this)
            });
        }
    });
});
