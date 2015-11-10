sap.ui.define(function () {
   "use strict";

   var serviceUrl;
   var auth;

   function Service() {
      auth = "Token " + btoa(localStorage.getItem("userName") + ":" + localStorage.getItem("authToken"));
   }

   Service.prototype.init = function(_serviceUrl, data) {
      serviceUrl = _serviceUrl;
      if(data.useToken) {
         auth = "Token " + btoa(data.username + ":" + localStorage.getItem("authToken"));
      } else {
         auth = "Basic " + btoa(data.username + ":" + data.password);
      }
      
   };

   Service.prototype.ajax = function(request) {
      request.url = request.serviceUrl ?  request.serviceUrl : serviceUrl + request.path;
      request.dataType = request.dataType ? request.dataType : "json";
      request.contentType = request.contentType ? request.contentType : "application/json";
      var _auth = request.auth ? request.auth : auth;
      request.beforeSend = function(xhr) {
         xhr.setRequestHeader("Authorization", _auth);
         xhr.setRequestHeader("Accept", "application/json");
         // if (request.method == "POST") {
         //    xhr.setRequestHeader("X-HTTP-Method", "MERGE");
         // }
      };
      return $.ajax(request);
   };
   return new Service();
});
