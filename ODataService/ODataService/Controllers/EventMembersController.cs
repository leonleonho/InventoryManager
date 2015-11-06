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
    public class EventMembersController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/EventMembers
        [EnableQuery]
        public IQueryable<EventMember> GetEventMembers()
        {
            return db.EventMembers;
        }

        // GET: odata/EventMembers(5)
        [EnableQuery]
        public SingleResult<EventMember> GetEventMember([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventMembers.Where(eventMember => eventMember.eventMemberID == key));
        }

        // PUT: odata/EventMembers(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<EventMember> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventMember eventMember = await db.EventMembers.FindAsync(key);
            if (eventMember == null)
            {
                return NotFound();
            }

            patch.Put(eventMember);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventMemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventMember);
        }

        // POST: odata/EventMembers
        public async Task<IHttpActionResult> Post(EventMember eventMember)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventMembers.Add(eventMember);
            await db.SaveChangesAsync();

            return Created(eventMember);
        }

        // PATCH: odata/EventMembers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<EventMember> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventMember eventMember = await db.EventMembers.FindAsync(key);
            if (eventMember == null)
            {
                return NotFound();
            }

            patch.Patch(eventMember);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventMemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(eventMember);
        }

        // DELETE: odata/EventMembers(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            EventMember eventMember = await db.EventMembers.FindAsync(key);
            if (eventMember == null)
            {
                return NotFound();
            }

            db.EventMembers.Remove(eventMember);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/EventMembers(5)/Event
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventMembers.Where(m => m.eventMemberID == key).Select(m => m.Event));
        }

        // GET: odata/EventMembers(5)/Member
        [EnableQuery]
        public SingleResult<Member> GetMember([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventMembers.Where(m => m.eventMemberID == key).Select(m => m.Member));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventMemberExists(int key)
        {
            return db.EventMembers.Count(e => e.eventMemberID == key) > 0;
        }
    }
}
