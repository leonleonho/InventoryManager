using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using oDataService.Models;

namespace oDataService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using oDataService.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<EventsItemUsage>("EventsItemUsages");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EventsItemUsagesController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/EventsItemUsages
        [EnableQuery]
        public IQueryable<EventsItemUsage> GetEventsItemUsages()
        {
            return db.EventsItemUsages;
        }

        // GET: odata/EventsItemUsages(5)
        [EnableQuery]
        public SingleResult<EventsItemUsage> GetEventsItemUsage([FromODataUri] string key)
        {
            return SingleResult.Create(db.EventsItemUsages.Where(eventsItemUsage => eventsItemUsage.itemName == key));
        }

        // PUT: odata/EventsItemUsages(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<EventsItemUsage> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventsItemUsage eventsItemUsage = await db.EventsItemUsages.FindAsync(key);
            if (eventsItemUsage == null)
            {
                return NotFound();
            }

            patch.Put(eventsItemUsage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventsItemUsageExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventsItemUsage);
        }

        // POST: odata/EventsItemUsages
        public async Task<IHttpActionResult> Post(EventsItemUsage eventsItemUsage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventsItemUsages.Add(eventsItemUsage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EventsItemUsageExists(eventsItemUsage.itemName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(eventsItemUsage);
        }

        // PATCH: odata/EventsItemUsages(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<EventsItemUsage> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventsItemUsage eventsItemUsage = await db.EventsItemUsages.FindAsync(key);
            if (eventsItemUsage == null)
            {
                return NotFound();
            }

            patch.Patch(eventsItemUsage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventsItemUsageExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventsItemUsage);
        }

        // DELETE: odata/EventsItemUsages(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            EventsItemUsage eventsItemUsage = await db.EventsItemUsages.FindAsync(key);
            if (eventsItemUsage == null)
            {
                return NotFound();
            }

            db.EventsItemUsages.Remove(eventsItemUsage);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventsItemUsageExists(string key)
        {
            return db.EventsItemUsages.Count(e => e.itemName == key) > 0;
        }
    }
}
