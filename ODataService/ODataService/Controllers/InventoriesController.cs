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
    public class InventoriesController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/Inventories
        [EnableQuery]
        public IQueryable<Inventory> GetInventories()
        {
            return db.Inventories;
        }

        // GET: odata/Inventories(5)
        [EnableQuery]
        public SingleResult<Inventory> GetInventory([FromODataUri] int key)
        {
            return SingleResult.Create(db.Inventories.Where(inventory => inventory.inventoryID == key));
        }

        // PUT: odata/Inventories(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Inventory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Inventory inventory = await db.Inventories.FindAsync(key);
            if (inventory == null)
            {
                return NotFound();
            }

            patch.Put(inventory);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(inventory);
        }

        // POST: odata/Inventories
        public async Task<IHttpActionResult> Post(Inventory inventory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Inventories.Add(inventory);
            await db.SaveChangesAsync();

            return Created(inventory);
        }

        // PATCH: odata/Inventories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Inventory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Inventory inventory = await db.Inventories.FindAsync(key);
            if (inventory == null)
            {
                return NotFound();
            }

            patch.Patch(inventory);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(inventory);
        }

        // DELETE: odata/Inventories(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Inventory inventory = await db.Inventories.FindAsync(key);
            if (inventory == null)
            {
                return NotFound();
            }

            db.Inventories.Remove(inventory);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Inventories(5)/EventInventories
        [EnableQuery]
        public IQueryable<EventInventory> GetEventInventories([FromODataUri] int key)
        {
            return db.Inventories.Where(m => m.inventoryID == key).SelectMany(m => m.EventInventories);
        }

        // GET: odata/Inventories(5)/Item
        [EnableQuery]
        public SingleResult<Item> GetItem([FromODataUri] int key)
        {
            return SingleResult.Create(db.Inventories.Where(m => m.inventoryID == key).Select(m => m.Item));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool InventoryExists(int key)
        {
            return db.Inventories.Count(e => e.inventoryID == key) > 0;
        }
    }
}
