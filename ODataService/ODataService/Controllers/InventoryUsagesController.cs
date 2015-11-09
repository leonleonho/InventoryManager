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
    public class InventoryUsagesController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/InventoryUsages
        [EnableQuery]
        public IQueryable<InventoryUsage> GetInventoryUsages()
        {
            return db.InventoryUsages;
        }

        // GET: odata/InventoryUsages(5)
        [EnableQuery]
        public SingleResult<InventoryUsage> GetInventoryUsage([FromODataUri] int key)
        {
            return SingleResult.Create(db.InventoryUsages.Where(inventoryUsage => inventoryUsage.inventoryID == key));
        }

        // PUT: odata/InventoryUsages(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<InventoryUsage> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            InventoryUsage inventoryUsage = await db.InventoryUsages.FindAsync(key);
            if (inventoryUsage == null)
            {
                return NotFound();
            }

            patch.Put(inventoryUsage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryUsageExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(inventoryUsage);
        }

        // POST: odata/InventoryUsages
        public async Task<IHttpActionResult> Post(InventoryUsage inventoryUsage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.InventoryUsages.Add(inventoryUsage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (InventoryUsageExists(inventoryUsage.inventoryID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(inventoryUsage);
        }

        // PATCH: odata/InventoryUsages(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<InventoryUsage> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            InventoryUsage inventoryUsage = await db.InventoryUsages.FindAsync(key);
            if (inventoryUsage == null)
            {
                return NotFound();
            }

            patch.Patch(inventoryUsage);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryUsageExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(inventoryUsage);
        }

        // DELETE: odata/InventoryUsages(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            InventoryUsage inventoryUsage = await db.InventoryUsages.FindAsync(key);
            if (inventoryUsage == null)
            {
                return NotFound();
            }

            db.InventoryUsages.Remove(inventoryUsage);
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

        private bool InventoryUsageExists(int key)
        {
            return db.InventoryUsages.Count(e => e.inventoryID == key) > 0;
        }
    }
}
