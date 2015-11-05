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

    public class MembersController : ODataController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();

        // GET: odata/Members
        [EnableQuery]
        public IQueryable<Member> GetMembers()
        {
            return db.Members;
        }

        // GET: odata/Members(5)
        [EnableQuery]
        public SingleResult<Member> GetMember([FromODataUri] int key)
        {
            return SingleResult.Create(db.Members.Where(member => member.memberID == key));
        }

        // PUT: odata/Members(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Member> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Member member = await db.Members.FindAsync(key);
            if (member == null)
            {
                return NotFound();
            }

            patch.Put(member);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(member);
        }

        // POST: odata/Members
        public async Task<IHttpActionResult> Post(Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Members.Add(member);
            await db.SaveChangesAsync();

            return Created(member);
        }

        // PATCH: odata/Members(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Member> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Member member = await db.Members.FindAsync(key);
            if (member == null)
            {
                return NotFound();
            }

            patch.Patch(member);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(member);
        }

        // DELETE: odata/Members(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Member member = await db.Members.FindAsync(key);
            if (member == null)
            {
                return NotFound();
            }

            db.Members.Remove(member);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Members(5)/EventInventories
        [EnableQuery]
        public IQueryable<EventInventory> GetEventInventories([FromODataUri] int key)
        {
            return db.Members.Where(m => m.memberID == key).SelectMany(m => m.EventInventories);
        }

        // GET: odata/Members(5)/EventMembers
        [EnableQuery]
        public IQueryable<EventMember> GetEventMembers([FromODataUri] int key)
        {
            return db.Members.Where(m => m.memberID == key).SelectMany(m => m.EventMembers);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MemberExists(int key)
        {
            return db.Members.Count(e => e.memberID == key) > 0;
        }
    }
}
