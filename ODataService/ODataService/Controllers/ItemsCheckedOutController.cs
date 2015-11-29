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
    public class ItemsCheckedOutController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/ItemsCheckedOut
        [EnableQuery]
        public IQueryable<ItemsCheckedOut> GetItemsCheckedOut()
        {
            return db.ItemsCheckedOuts;
        }

        // GET: odata/ItemsCheckedOut(5)
        [EnableQuery]
        public SingleResult<ItemsCheckedOut> GetItemsCheckedOut([FromODataUri] string key)
        {
            return SingleResult.Create(db.ItemsCheckedOuts.Where(itemsCheckedOut => itemsCheckedOut.name == key));
        }

        // PUT: odata/ItemsCheckedOut(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<ItemsCheckedOut> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ItemsCheckedOut itemsCheckedOut = await db.ItemsCheckedOuts.FindAsync(key);
            if (itemsCheckedOut == null)
            {
                return NotFound();
            }

            patch.Put(itemsCheckedOut);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemsCheckedOutExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(itemsCheckedOut);
        }

        // POST: odata/ItemsCheckedOut
        public async Task<IHttpActionResult> Post(ItemsCheckedOut itemsCheckedOut)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ItemsCheckedOuts.Add(itemsCheckedOut);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ItemsCheckedOutExists(itemsCheckedOut.name))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(itemsCheckedOut);
        }

        // PATCH: odata/ItemsCheckedOut(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<ItemsCheckedOut> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ItemsCheckedOut itemsCheckedOut = await db.ItemsCheckedOuts.FindAsync(key);
            if (itemsCheckedOut == null)
            {
                return NotFound();
            }

            patch.Patch(itemsCheckedOut);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemsCheckedOutExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(itemsCheckedOut);
        }

        // DELETE: odata/ItemsCheckedOut(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            ItemsCheckedOut itemsCheckedOut = await db.ItemsCheckedOuts.FindAsync(key);
            if (itemsCheckedOut == null)
            {
                return NotFound();
            }

            db.ItemsCheckedOuts.Remove(itemsCheckedOut);
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

        private bool ItemsCheckedOutExists(string key)
        {
            return db.ItemsCheckedOuts.Count(e => e.name == key) > 0;
        }
    }
}
