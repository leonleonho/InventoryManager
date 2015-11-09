sap.ui.define(["../../util/Service"],
	function (Service) {
		"use strict";

		this.members = [];

		function MembersModel(data) {
			this.memberID = data.memberID;
			this.fName = data.fName;
			this.lName = data.lName;
			this.address = data.address;
			this.email = data.email;
			this.phone = data.phone;
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
			}).success((function(_data) {
				console.log("_data:");
				console.log(_data);
			}));

		};

		MembersModel.getAllMembers = function() {
			return this.members;
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

		return MembersModel;
	});