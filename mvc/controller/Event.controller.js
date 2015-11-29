sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/odata/ODataModel",
   "sap/ui/model/Filter",
   "sap/ui/model/Sorter",
   "../../util/Service"
], function (Controller, MessageToast, JSONModel, ODataModel, Filter, Sorter, Service) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.Event", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function (evt) {
          this.core = sap.ui.getCore();
          this.eventBus = this.core.getEventBus();
          this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.eventList = this.byId("eventList");
          
        },
        loggedin: function(evt){
          var sorter = new Sorter("dateCreated", true);  
          this.byId("eventList").getBinding("items").sort([sorter]);
          this.ODataModel = this.getOwnerComponent().getModel("oDataModel");
        },
        handlePress: function(evt) {
            var src = evt.getSource();
            var obj = src.getBindingContext("oDataModel").getObject();
            this.oRouter.navTo("EventDetail", {
              from: "EventDetail",
              detailID: obj.eventID
            });
        },
        onSearch: function(evt) {
          // var src = evt.getSource();
          // var nameFilter = new Filter({
          //   path: "itemName",
          //   operator: "Contains",
          //   value1: src.getValue()
          // });
          // var typeFilter = new Filter({
          //   path: "type",
          //   operator: "Contains",
          //   value1: src.getValue()
          // });
          // var orFilter = new Filter({
          //   filters: [nameFilter, typeFilter],
          //   and: false
          // });
          // //var typeFilter = new Filter("type", sap.ui.model.FilterOperator.Contains, src.getValue());
          // var bindings = this.byId("eventList").getBinding("items");          
          // bindings.filter([orFilter]);
        },
        onAddPress: function(evt) {
          if(!this._addMenu) {
              this.addFragmentModel = new JSONModel({});
              this._addMenu=sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.AddEvent", this);
              this.getView().addDependent(this._addMenu);
              this.getView().setModel(this.addFragmentModel, "addEvent");
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
          payload.dateCreated = new Date();
          this._addMenu.setBusyIndicatorDelay(0);
          this._addMenu.setBusy(true);
          this.ODataModel.create("Events", payload, {
            success: function() {
              MessageToast.show("Event Created");
            },
            error: function() {
              MessageToast.show("Failed to create event, contact an admin if this persists");
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
        onMenuItemPress: function(evt) {
          var viewName = evt.getSource().data().navView;
          if(viewName == "Event")
            return;
          this.oRouter.navTo(viewName);
        }

    });
});
