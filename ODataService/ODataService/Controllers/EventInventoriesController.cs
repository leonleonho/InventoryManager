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

    public class EventInventoriesController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/EventInventories
        [EnableQuery]
        public IQueryable<EventInventory> GetEventInventories()
        {
            return db.EventInventories;
        }

        // GET: odata/EventInventories(5)
        [EnableQuery]
        public SingleResult<EventInventory> GetEventInventory([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventInventories.Where(eventInventory => eventInventory.eventInventoryID == key));
        }

        // PUT: odata/EventInventories(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<EventInventory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventInventory eventInventory = await db.EventInventories.FindAsync(key);
            if (eventInventory == null)
            {
                return NotFound();
            }

            patch.Put(eventInventory);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventInventoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventInventory);
        }

        // POST: odata/EventInventories
        public async Task<IHttpActionResult> Post(EventInventory eventInventory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventInventories.Add(eventInventory);
            await db.SaveChangesAsync();

            return Created(eventInventory);
        }

        // PATCH: odata/EventInventories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<EventInventory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventInventory eventInventory = await db.EventInventories.FindAsync(key);
            if (eventInventory == null)
            {
                return NotFound();
            }

            patch.Patch(eventInventory);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventInventoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventInventory);
        }

        // DELETE: odata/EventInventories(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            EventInventory eventInventory = await db.EventInventories.FindAsync(key);
            if (eventInventory == null)
            {
                return NotFound();
            }

            db.EventInventories.Remove(eventInventory);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/EventInventories(5)/Event
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventInventories.Where(m => m.eventInventoryID == key).Select(m => m.Event));
        }

        // GET: odata/EventInventories(5)/Inventory
        [EnableQuery]
        public SingleResult<Inventory> GetInventory([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventInventories.Where(m => m.eventInventoryID == key).Select(m => m.Inventory));
        }

        // GET: odata/EventInventories(5)/Member
        [EnableQuery]
        public SingleResult<Member> GetMember([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventInventories.Where(m => m.eventInventoryID == key).Select(m => m.Member));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventInventoryExists(int key)
        {
            return db.EventInventories.Count(e => e.eventInventoryID == key) > 0;
        }
    }
}
