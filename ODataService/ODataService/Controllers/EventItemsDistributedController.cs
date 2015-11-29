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
using oDataService.Classes;

namespace oDataService.Controllers
{
    [AuthAction]
    public class EventItemsDistributedController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/EventItemsDistributed
        [EnableQuery]
        public IQueryable<EventItemsDistributed> GetEventItemsDistributed()
        {
            return db.EventItemsDistributeds;
        }

        // GET: odata/EventItemsDistributed(5)
        [EnableQuery]
        public SingleResult<EventItemsDistributed> GetEventItemsDistributed([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventItemsDistributeds.Where(eventItemsDistributed => eventItemsDistributed.eventID == key));
        }

        // PUT: odata/EventItemsDistributed(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<EventItemsDistributed> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventItemsDistributed eventItemsDistributed = await db.EventItemsDistributeds.FindAsync(key);
            if (eventItemsDistributed == null)
            {
                return NotFound();
            }

            patch.Put(eventItemsDistributed);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventItemsDistributedExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventItemsDistributed);
        }

        // POST: odata/EventItemsDistributed
        public async Task<IHttpActionResult> Post(EventItemsDistributed eventItemsDistributed)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventItemsDistributeds.Add(eventItemsDistributed);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EventItemsDistributedExists(eventItemsDistributed.eventID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(eventItemsDistributed);
        }

        // PATCH: odata/EventItemsDistributed(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<EventItemsDistributed> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventItemsDistributed eventItemsDistributed = await db.EventItemsDistributeds.FindAsync(key);
            if (eventItemsDistributed == null)
            {
                return NotFound();
            }

            patch.Patch(eventItemsDistributed);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventItemsDistributedExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventItemsDistributed);
        }

        // DELETE: odata/EventItemsDistributed(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            EventItemsDistributed eventItemsDistributed = await db.EventItemsDistributeds.FindAsync(key);
            if (eventItemsDistributed == null)
            {
                return NotFound();
            }

            db.EventItemsDistributeds.Remove(eventItemsDistributed);
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

        private bool EventItemsDistributedExists(int key)
        {
            return db.EventItemsDistributeds.Count(e => e.eventID == key) > 0;
        }
    }
}
