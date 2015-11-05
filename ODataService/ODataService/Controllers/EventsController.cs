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
    public class EventsController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/Events
        [EnableQuery]
        public IQueryable<Event> GetEvents()
        {
            return db.Events;
        }

        // GET: odata/Events(5)
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.Events.Where(@event => @event.eventID == key));
        }

        // PUT: odata/Events(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Event> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Event @event = await db.Events.FindAsync(key);
            if (@event == null)
            {
                return NotFound();
            }

            patch.Put(@event);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(@event);
        }

        // POST: odata/Events
        public async Task<IHttpActionResult> Post(Event @event)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Events.Add(@event);
            await db.SaveChangesAsync();

            return Created(@event);
        }

        // PATCH: odata/Events(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Event> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Event @event = await db.Events.FindAsync(key);
            if (@event == null)
            {
                return NotFound();
            }

            patch.Patch(@event);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(@event);
        }

        // DELETE: odata/Events(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Event @event = await db.Events.FindAsync(key);
            if (@event == null)
            {
                return NotFound();
            }

            db.Events.Remove(@event);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Events(5)/EventInventories
        [EnableQuery]
        public IQueryable<EventInventory> GetEventInventories([FromODataUri] int key)
        {
            return db.Events.Where(m => m.eventID == key).SelectMany(m => m.EventInventories);
        }

        // GET: odata/Events(5)/EventMembers
        [EnableQuery]
        public IQueryable<EventMember> GetEventMembers([FromODataUri] int key)
        {
            return db.Events.Where(m => m.eventID == key).SelectMany(m => m.EventMembers);
        }

        // GET: odata/Events(5)/User
        [EnableQuery]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.Events.Where(m => m.eventID == key).Select(m => m.User));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventExists(int key)
        {
            return db.Events.Count(e => e.eventID == key) > 0;
        }
    }
}
