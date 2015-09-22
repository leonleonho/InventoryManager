jQuery.sap.require("com.scout138.inventoryManager.util.Router");
jQuery.sap.declare("com.scout138.inventoryManager.Component");

sap.ui.core.UIComponent.extend("com.scout138.inventoryManager.Component", {
    metadata: {
        name: "Inventory Manager",
        version: "1.0",
        includes: [],
        dependencies: {
            libs: ["sap.m", "sap.ui.layout"],
            components: []
        },
        rootView: "com.scout138.inventoryManager.mvc.view.App",
        config: {
            resourceBundle: "i18n/messageBundle.properties",
            serviceConfig: {
                name: "Northwind",
                serviceUrl: "http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
            }
        },
        routing: {
            config: {
                routerClass: com.scout138.inventoryManager.Router,
                viewType: "XML",
                viewPath: "com.scout138.inventoryManager.mvc.view",
                targetAggregation: "detailPages",
                clearTarget: false
            },
            routes: [{
                pattern: "",
                name: "main",
                view: "Master",
                targetAggregation: "masterPages",
                targetControl: "idAppControl",
                subroutes: [{
                    pattern: "{product}/:tab:",
                    name: "product",
                    view: "Detail"
                }]
            }, {
                name: "catchallMaster",
                view: "Master",
                targetAggregation: "masterPages",
                targetControl: "idAppControl",
                subroutes: [{
                    pattern: ":all*:",
                    name: "catchallDetail",
                    view: "NotFound"
                }]
            }]
        }
    },
    appConfig: {
        "oDataService": "http://localhost/InventoryManager/mock/"
    },
    init: function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        var mConfig = this.getMetadata().getConfig();

        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var rootPath = jQuery.sap.getModulePath("com.scout138.inventoryManager");

        // set i18n model
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: [rootPath, mConfig.resourceBundle].join("/")
        });
        this.setModel(i18nModel, "i18n");

        // Create and set domain model to the component
        // var sServiceUrl = mConfig.serviceConfig.serviceUrl;
        // var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
        // this.setModel(oModel);

        // set device model
        var deviceModel = new sap.ui.model.json.JSONModel({
            isTouch: sap.ui.Device.support.touch,
            isNoTouch: !sap.ui.Device.support.touch,
            isPhone: sap.ui.Device.system.phone,
            isNoPhone: !sap.ui.Device.system.phone,
            listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
        });
        deviceModel.setDefaultBindingMode("OneWay");
        window.appConfig = this.appConfig;
        this.setModel(deviceModel, "device");

        this.getRouter().initialize();
    }
});
