using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using oDataService.Models;

namespace oDataService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            config.Routes.MapHttpRoute(
                name: "ActionApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            // OData routing
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<EventInventory>("EventInventories");
            builder.EntitySet<EventMember>("EventMembers");
            builder.EntitySet<User>("Users");
            builder.EntitySet<Event>("Events");
            builder.EntitySet<Inventory>("Inventories");
            builder.EntitySet<Member>("Members");
            builder.EntitySet<EventsView>("EventsViews");
            builder.EntitySet<Item>("Items");
            config.Routes.MapODataServiceRoute("odata", "/", builder.GetEdmModel());
            config.MapHttpAttributeRoutes();

        }
    }
}
