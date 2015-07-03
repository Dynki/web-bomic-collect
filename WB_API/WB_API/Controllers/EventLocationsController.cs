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
    public class EventLocationsController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET: api/EventLocations
        public IQueryable<evloc> Getevloc()
        {
            return db.evloc.Where(l => l.can == 0 && l.f_left == 1).OrderBy(r => r.name);
        }

        // GET: api/EventLocations/5
        [ResponseType(typeof(evloc))]
        public async Task<IHttpActionResult> Getevloc(int id)
        {
            evloc evloc = await db.evloc.FindAsync(id);
            if (evloc == null)
            {
                return NotFound();
            }

            return Ok(evloc);
        }

        // PUT: api/EventLocations/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Putevloc(int id, evloc evloc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != evloc.evloc1)
            {
                return BadRequest();
            }

            db.Entry(evloc).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!evlocExists(id))
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

        // POST: api/EventLocations
        [ResponseType(typeof(evloc))]
        public async Task<IHttpActionResult> Postevloc(evloc evloc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.evloc.Add(evloc);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (evlocExists(evloc.evloc1))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = evloc.evloc1 }, evloc);
        }

        // DELETE: api/EventLocations/5
        [ResponseType(typeof(evloc))]
        public async Task<IHttpActionResult> Deleteevloc(int id)
        {
            evloc evloc = await db.evloc.FindAsync(id);
            if (evloc == null)
            {
                return NotFound();
            }

            db.evloc.Remove(evloc);
            await db.SaveChangesAsync();

            return Ok(evloc);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool evlocExists(int id)
        {
            return db.evloc.Count(e => e.evloc1 == id) > 0;
        }
    }
}