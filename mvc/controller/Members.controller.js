sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter",
], function (Controller, MessageToast, JSONModel, ODataModel, Filter) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.Members", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function () {
          this.core = sap.ui.getCore();
          this.eventBus = this.core.getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          if(APP_CONFIG.state.auth.loggedIn) {
            //this.initModel();
          }  
        },

        handlePress: function(evt) {
            var src = evt.getSource();
            var obj = src.getBindingContext("oDataModel").getObject();
            console.log(obj);
            this.oRouter.navTo("MembersDetail", {
              from: "Members",
              detailID: obj.memberID
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
          /*
          var src = evt.getSource();
          var fNameFilter = new Filter({
            path: "fName",
            operator: "Contains",
            value1: src.getValue()
          });
          var lNameFilter = new Filter({
            path: "lName",
            operator: "Contains",
            value1: src.getValue()
          });
          var emailFilter = new Filter({
            path: "email",
            operator: "Contains",
            value1: src.getValue()
          });
          var typeFilter = new Filter({
            path: "type",
            operator: "Contains",
            value1: src.getValue()
          });
          var orFilter = new Filter({
            filters: [fNameFilter, lNameFilter, emailFilter, typeFilter],
            and: false
          });
          //var typeFilter = new Filter("type", sap.ui.model.FilterOperator.Contains, src.getValue());
          var bindings = this.byId("membersList").getBinding("items");          
          bindings.filter([orFilter]);
          */
        },
        onAddPress: function() {
          if(!this._addMenu) {
              this.addFragmentModel = new JSONModel({
                type: "",
                itemDescription: "",
                itemName: ""
              });
              this._addMenu=sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.AddItem", this);
              this.getView().addDependent(this._addMenu);
              this.getView().setModel(this.addFragmentModel, "addInventory");
          }
          $.sap.delayedCall(0, this, function(){
              this._addMenu.open();
          });
        },
        addFragmentCancel: function() {
          this._addMenu.close();
        },
        addFragmentCreate: function() {
          var payload = this.addFragmentModel.getData();
          this._addMenu.setBusyIndicatorDelay(0);
          this._addMenu.setBusy(true);
          this.ODataModel.create("Members", payload, {
            success: function() {
              MessageToast.show("Member Added");
            },
            error: function() {
              MessageToast.show("Failed to add member, contact an admin if this persists");
            } 
          });
          this._addMenu.close();
        },
        handleDelete: function(evt) {
          var oList = evt.getSource().getParent();
          var swipedItem = oList.getSwipedItem();
          var swipedCtx = swipedItem.getBindingContext("oDataModel");
          this.ODataModel.remove("", swipedCtx);
          oList.removeAggregation("members", oList.getSwipedItem());
          oList.swipeOut();
        },
        onMenuItemPress: function(evt) {
          var viewName = evt.getSource().data().navView;
          if(viewName == "Members")
            return;
          this.oRouter.navTo(viewName);
        }

    });
});
