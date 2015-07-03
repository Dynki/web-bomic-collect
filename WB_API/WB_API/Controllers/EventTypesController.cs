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
using System.Web.Http.Description;
using WB_API.Models;

namespace WB_API.Controllers
{
    public class EventTypesController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET: api/EventTypes
        public IQueryable<etype> Getetype()
        {
					return db.etype.Where(e => e.can == 0 && e.f_left == 1 && e.nca != 1).OrderBy(r => r.name);
        }

        // GET: api/EventTypes/5
        [ResponseType(typeof(etype))]
        public async Task<IHttpActionResult> Getetype(decimal id)
        {
            etype etype = await db.etype.Where(e => e.etype1 == id && e.can == 0 && e.f_left == 1 && e.nca != 1).FirstOrDefaultAsync();
            if (etype == null)
            {
                return NotFound();
            }

            return Ok(etype);
        }

        // PUT: api/EventTypes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Putetype(decimal id, etype etype)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != etype.etype1)
            {
                return BadRequest();
            }

            db.Entry(etype).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!etypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/EventTypes
        [ResponseType(typeof(etype))]
        public async Task<IHttpActionResult> Postetype(etype etype)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.etype.Add(etype);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (etypeExists(etype.etype1))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = etype.etype1 }, etype);
        }

        // DELETE: api/EventTypes/5
        [ResponseType(typeof(etype))]
        public async Task<IHttpActionResult> Deleteetype(decimal id)
        {
            etype etype = await db.etype.FindAsync(id);
            if (etype == null)
            {
                return NotFound();
            }

            db.etype.Remove(etype);
            await db.SaveChangesAsync();

            return Ok(etype);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool etypeExists(decimal id)
        {
            return db.etype.Count(e => e.etype1 == id) > 0;
        }
    }
}