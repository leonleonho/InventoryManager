sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/core/routing/History",
    "../../util/Service"
], function(Controller, MessageToast, JSONModel, ODataModel, Filter, History, Service) {
    "use strict";

    return Controller.extend("com.scout138.inventoryManager.mvc.controller.MembersDetail", {
        /**
         * Standard UI5 Controller callback. Do most of the one-time controller
         * setup here.
         */
        onInit: function() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
            this.eventBus = sap.ui.getCore().getEventBus();
            this.eventBus.subscribe("app", "loggedin", this.loggedin, this);
            this.memberModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.memberModel);
            this.inventoryList = this.byId("inventoryList");
            this.core = sap.ui.getCore();
            this.service = Service;
            this.oDataModelReady = $.Deferred();
            if (APP_CONFIG.state.auth.loggedIn) {
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
                memberID: args.detailID
            };
            this.oDataModelReady.done((function() {
                var filter = new Filter("memberID", sap.ui.model.FilterOperator.EQ, this.member.memberID);
                this.ODataModel.read("Members", {
                    filters: [filter],
                    success: (function(data) {
                        this.memberModel.setData(data.results[0]);
                    }).bind(this)
                });
            }).bind(this));
            this.initTable();
        },
        loggedin: function() {
            this.ODataModel = this.getOwnerComponent().getModel("oDataModel");
            this.oDataModelReady.resolve();
        },
        initTable: function() {
            this.oDataModelReady.done((function() {

                var filter = new Filter("memberID", sap.ui.model.FilterOperator.EQ, this.member.memberID);
                this.inventoryList.getBinding("items").filter(filter);

                var path = "InventoryUsages"
                this.service.ajax({
                    path: path + "?$inlinecount=allpages&$top=0&$filter=(memberID+eq+" + this.member.memberID + ")"
                }).done((function(data) {
                    var temp = this.memberModel.getData();
                    temp.checkedOut = data["odata.count"];
                    this.memberModel.setData(temp);
                    this.memberModel.refresh();
                }).bind(this)).fail(function(reason) {
                    console.error(reason);
                });
            }).bind(this));
        },
        conditionFormat: function(value) {
            return parseFloat(value);
        },
        priceFormatter: function(value) {
            return "$" + parseFloat(value).toFixed(2);
        },
        _retrieveSize: function(obj, property) {
            var count = 0;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][property])
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
        onEditPress: function() {
            if (!this._editMenu) {
                this._editMenu = sap.ui.xmlfragment("com.scout138.inventoryManager.mvc.fragments.EditMember", this.getView().getController());
                this.getView().addDependent(this._editMenu);
            }
            $.sap.delayedCall(0, this, function() {
                //this.editFragmentModel.setData(data);
                this._editMenu.open();
            });
        },
        editMember_save: function(evt) {
            var data = this.memberModel.getData();
            this._clearErrorStates();
            var error = false;
            if (!data.fName) {
                this.core.byId("fName").setValueState("Error")
                    .setValueStateText("Must enter a first name");
                error = true;
            }
            if (!data.lName) {
                this.core.byId("lName").setValueState("Error")
                    .setValueStateText("Must enter a last name");
                error = true;
            }
            if (!data.email) {
                this.core.byId("email").setValueState("Error")
                    .setValueStateText("Must enter an email address");
                error = true;
            }
            if (!data.phone) {
                this.core.byId("phone").setValueState("Error")
                    .setValueStateText("Must enter a phone number");
                error = true;
            }
            if (!data.address) {
                this.core.byId("address").setValueState("Error")
                    .setValueStateText("Must enter a home address");
                error = true;
            }

            if (!error) {
                var payload = {
                    fName: data.fName,
                    lName: data.lName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address
                };
                this.ODataModel.update("Members(" + this.member.memberID + ")", payload, {
                    success: (function() {}).bind(this),
                    error: function() {}
                });

                this.initTable();
                MessageToast.show("Member Updated");
                this._editMenu.close();
            }
        },
        _clearErrorStates: function() {
            this.core.byId("fName").setValueState("None")
                .setValueStateText("Must enter a first name");
            this.core.byId("lName").setValueState("None")
                .setValueStateText("Must enter a last name");
            this.core.byId("phone").setValueState("None")
                .setValueStateText("Must enter a phone number");
            this.core.byId("address").setValueState("None")
                .setValueStateText("Must enter a home address");
            this.core.byId("email").setValueState("None")
                .setValueStateText("Must enter an email address");
        },
        /*
        onDelete: function() {
          console.log("Deleted");
          this.ODataModel.remove("Items("+this.item.itemID+")", {
            success: function(){
              console.log("Deleted");
            }
          });
        },
        */
        nameFormater: function(part1, part2) {
            if (!part1 && !part2) {
                return "In Inventory";
            }
            return part1 + " " + part2;
        },
        editFragmentCancel: function() {
            this._editMenu.close();
        },
        onRowCheckin: function(evt) {
            var bindingCtx = evt.getSource().getParent().getBindingContext("oDataModel");
            this.ODataModel.remove("EventInventories(" + bindingCtx.getObject().eventInventoryID + ")", {
                success: function() {
                    MessageToast.show("Item Checked in");
                },
                error: function() {
                    MessageToast.show("Failed to check in item");
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
    });
});