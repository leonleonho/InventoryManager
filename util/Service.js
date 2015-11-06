sap.ui.define(function () {
   "use strict";
   function Service(serviceUrl, username, password) {
      this.serviceUrl = serviceUrl;
      this.auth = btoa(username + ':' + password);   
   }
   Service.prototype.ajax = function(request) {
      request.url = this.serviceUrl + request.path;
      request.dataType = request.dataType ? request.dataType : "json";
      request.beforeSend = (function(xhr) {
         xhr.setRequestHeader("Authorization", "Basic " + this.auth);
         xhr.setRequestHeader("Accept", "application/json");
      }).bind(this);
      return $.ajax(request);
   };
   return Service;
});