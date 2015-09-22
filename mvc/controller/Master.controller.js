
sap.ui.core.mvc.Controller.extend("com.scout138.inventoryManager.mvc.controller.Master", {
    /**
     * Standard UI5 Controller callback. Do most of the one-time controller
     * setup here.
     */
    onInit: function () {
        var eventsModel = new sap.ui.model.json.JSONModel();
        $.ajax({
            dataType: "json",
            url: window.appConfig.oDataService + 'events.json',
            data: null
        }).done(function(data){
            eventsModel.setData(data);
            eventsModel.refresh();
            console.log(data);
        });
        this.getView().setModel(eventsModel);
    }
});
