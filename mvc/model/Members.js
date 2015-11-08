sap.ui.define(["../../util/Service"],
	function (Service) {
		"use strict";

		var _members = [];

		function MembersModel(data) {
			this.memberID = data.memberID;
			this.fName = data.fName;
			this.lName = data.lName;
			this.address = data.address;
			this.email = data.email;
			this.phone = data.phone;
		}

		MembersModel.getAllMembers = function() {
			return _members;
		};

		MembersModel.getMember = function(index) {
			return _members[index];
		};

		MembersModel.updateMember = function(index, _data) {
			Service.ajax({
				path: "Members(" + index + ")",
				method: "PATCH",
				data: JSON.stringify(_data)
			}).success((function(_data) {
				console.log("_data:");
				console.log(_data);
			}));

			// var member = _members[index - 1];
			// $.each(_data, function(key, val) {
			// 	member[key] = val;
			// });
			
			// return member;
		};

		MembersModel.RetrieveAll = function() {
			var deferred = $.Deferred();

			Service.ajax(
				{
					path: "Members"
				}).success((function(data) {
					data = data.value;
					for (var i = 0; i < data.length; i++) {
						_members.push(new MembersModel(data[i]));
					}
					deferred.resolve(_members);
				}).bind(this)).fail(function(data) {
					deferred.reject(data);
				});

			return deferred;
		};

		return MembersModel;
	});