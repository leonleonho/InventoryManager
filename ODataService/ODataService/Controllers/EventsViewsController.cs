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
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EventsViewsController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/EventsViews
        [EnableQuery]
        public IQueryable<EventsView> GetEventsViews()
        {
            return db.EventsViews;
        }

        // GET: odata/EventsViews(5)
        [EnableQuery]
        public SingleResult<EventsView> GetEventsView([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventsViews.Where(eventsView => eventsView.eventID == key));
        }

        // PUT: odata/EventsViews(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<EventsView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventsView eventsView = await db.EventsViews.FindAsync(key);
            if (eventsView == null)
            {
                return NotFound();
            }

            patch.Put(eventsView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventsViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventsView);
        }

        // POST: odata/EventsViews
        public async Task<IHttpActionResult> Post(EventsView eventsView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventsViews.Add(eventsView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EventsViewExists(eventsView.eventID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(eventsView);
        }

        // PATCH: odata/EventsViews(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<EventsView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventsView eventsView = await db.EventsViews.FindAsync(key);
            if (eventsView == null)
            {
                return NotFound();
            }

            patch.Patch(eventsView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventsViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventsView);
        }

        // DELETE: odata/EventsViews(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            EventsView eventsView = await db.EventsViews.FindAsync(key);
            if (eventsView == null)
            {
                return NotFound();
            }

            db.EventsViews.Remove(eventsView);
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

        private bool EventsViewExists(int key)
        {
            return db.EventsViews.Count(e => e.eventID == key) > 0;
        }
    }
}
