sap.ui.define(["../../util/Service"],
	function (Service) {
		"use strict";

		this.members = [];
		this.items = [];

		function MembersModel(data) {
			this.memberID = data.memberID;
			this.fName = data.fName;
			this.lName = data.lName;
			this.address = data.address;
			this.email = data.email;
			this.phone = data.phone;
			this.items = [];
		}

		MembersModel.prototype.updateMember = function(_data) {

			// update the model
			$.each(_data, (function(key, val) {
				this[key] = val;
			}).bind(this));

			// update the entry in the database
			Service.ajax({
				path: "Members(" + this.memberID + ")",
				method: "PATCH",
				data: JSON.stringify(_data)
			}).fail(function(data) {
				console.error(data);
			});
		};

		MembersModel.prototype.retrieveItems = function() {
			if (this.items.length === 0) {
				for (var i = 0; i < MembersModel.items.length; i++) {
					if (MembersModel.items[i].memberID === this.memberID) {
						this.items.push(MembersModel.items[i]);
					}
				}
			}
			return this.items;
		};

<<<<<<< Updated upstream
		MembersModel.getAllMembers = function() {
			return this.members;
=======
		MembersModel.retrieve = function(index) {
			var deferred = $.Deferred();
			var member;
			Service.ajax(
				{
					path: "Members(" + index + ")"
				}).success(function(data) {
					member = new MembersModel(data);
					deferred.resolve(member);
				}).fail(function(data) {
					deferred.reject(data);
				});

			return deferred;
>>>>>>> Stashed changes
		};

		MembersModel.RetrieveAll = function() {
			var deferred = $.Deferred();
			var _members = [];
			Service.ajax(
				{
					path: "Members"
				}).success((function(data) {
					data = data.value;
					for (var i = 0; i < data.length; i++) {
						_members.push(new MembersModel(data[i]));
					}
					deferred.resolve(this.members);
				}).bind(this)).fail(function(data) {
					deferred.reject(data);
				});

			this.members = _members;

			return deferred;
		};

		MembersModel.retrieveAllItems = function() {
			var deferred = $.Deferred();
			var _items = [];
			Service.ajax(
				{
					path: "InventoryUsages"
				}).success((function(data) {
					data = data.value;
					for (var i = 0; i < data.length; i++) {
						console.log(data[i]);
						_items.push({
							eventID: data[i].eventID,
							inventoryID: data[i].inventoryID,
							memberID: data[i].memberID,
							itemName: data[i].itemName,
							dateAdded: data[i].dateAdded
						});
					}
					deferred.resolve(_items);
				}).bind(this)).fail(function(data) {
					console.error(data);
					deferred.reject(data);
				});
			this.items = _items;
			return deferred;
		};

		return MembersModel;
	});