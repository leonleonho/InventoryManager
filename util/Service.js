sap.ui.define(function () {
   "use strict";

   var serviceUrl;
   var auth;

   function Service() {
      
   }

   Service.prototype.init = function(_serviceUrl, username, password) {
      serviceUrl = _serviceUrl;
      auth = btoa(username + ":" + password);
   };

   Service.prototype.ajax = function(request) {
      request.url = serviceUrl + request.path;
      request.dataType = request.dataType ? request.dataType : "json";
      request.beforeSend = function(xhr) {
         xhr.setRequestHeader("Authorization", "Basic " + auth);
         xhr.setRequestHeader("Accept", "application/json");
         // if (request.method == "POST") {
         //    xhr.setRequestHeader("X-HTTP-Method", "MERGE");
         // }
      };
      return $.ajax(request);
   };
   return new Service();
});
