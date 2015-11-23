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
    public class PurchasedAtController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/PurchasedAt
        [EnableQuery]
        public IQueryable<PurchasedAt> GetPurchasedAt()
        {
            return db.PurchasedAts;
        }

        // GET: odata/PurchasedAt(5)
        [EnableQuery]
        public SingleResult<PurchasedAt> GetPurchasedAt([FromODataUri] string key)
        {
            return SingleResult.Create(db.PurchasedAts.Where(purchasedAt => purchasedAt.purchasedAt1 == key));
        }

        // PUT: odata/PurchasedAt(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<PurchasedAt> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PurchasedAt purchasedAt = await db.PurchasedAts.FindAsync(key);
            if (purchasedAt == null)
            {
                return NotFound();
            }

            patch.Put(purchasedAt);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchasedAtExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(purchasedAt);
        }

        // POST: odata/PurchasedAt
        public async Task<IHttpActionResult> Post(PurchasedAt purchasedAt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PurchasedAts.Add(purchasedAt);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PurchasedAtExists(purchasedAt.purchasedAt1))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(purchasedAt);
        }

        // PATCH: odata/PurchasedAt(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<PurchasedAt> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PurchasedAt purchasedAt = await db.PurchasedAts.FindAsync(key);
            if (purchasedAt == null)
            {
                return NotFound();
            }

            patch.Patch(purchasedAt);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PurchasedAtExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(purchasedAt);
        }

        // DELETE: odata/PurchasedAt(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            PurchasedAt purchasedAt = await db.PurchasedAts.FindAsync(key);
            if (purchasedAt == null)
            {
                return NotFound();
            }

            db.PurchasedAts.Remove(purchasedAt);
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

        private bool PurchasedAtExists(string key)
        {
            return db.PurchasedAts.Count(e => e.purchasedAt1 == key) > 0;
        }
    }
}
