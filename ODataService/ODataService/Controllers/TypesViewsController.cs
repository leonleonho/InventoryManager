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
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using oDataService.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<TypesView>("TypesViews");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [AuthAction]
    public class TypesViewsController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/TypesViews
        [EnableQuery]
        public IQueryable<TypesView> GetTypesViews()
        {
            return db.TypesViews;
        }

        // GET: odata/TypesViews(5)
        [EnableQuery]
        public SingleResult<TypesView> GetTypesView([FromODataUri] string key)
        {
            return SingleResult.Create(db.TypesViews.Where(typesView => typesView.type == key));
        }

        // PUT: odata/TypesViews(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<TypesView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TypesView typesView = await db.TypesViews.FindAsync(key);
            if (typesView == null)
            {
                return NotFound();
            }

            patch.Put(typesView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TypesViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(typesView);
        }

        // POST: odata/TypesViews
        public async Task<IHttpActionResult> Post(TypesView typesView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TypesViews.Add(typesView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TypesViewExists(typesView.type))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(typesView);
        }

        // PATCH: odata/TypesViews(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<TypesView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TypesView typesView = await db.TypesViews.FindAsync(key);
            if (typesView == null)
            {
                return NotFound();
            }

            patch.Patch(typesView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TypesViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(typesView);
        }

        // DELETE: odata/TypesViews(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            TypesView typesView = await db.TypesViews.FindAsync(key);
            if (typesView == null)
            {
                return NotFound();
            }

            db.TypesViews.Remove(typesView);
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

        private bool TypesViewExists(string key)
        {
            return db.TypesViews.Count(e => e.type == key) > 0;
        }
    }
}
