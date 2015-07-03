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
    public class EventStatusController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET: api/EventStatus
        public IQueryable<estatus> Getestatus()
        {
            return db.estatus.Where(e => e.can == 0 && e.f_left == 1);
        }

        // GET: api/EventStatus/5
        [ResponseType(typeof(estatus))]
        public async Task<IHttpActionResult> Getestatus(int id)
        {
            estatus estatus = await db.estatus.Where(e => e.estatus1 == id && e.can == 0 && e.f_left == 1).FirstOrDefaultAsync();
            if (estatus == null)
            {
                return NotFound();
            }

            return Ok(estatus);
        }

        // PUT: api/EventStatus/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Putestatus(int id, estatus estatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != estatus.estatus1)
            {
                return BadRequest();
            }

            db.Entry(estatus).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!estatusExists(id))
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

        // POST: api/EventStatus
        [ResponseType(typeof(estatus))]
        public async Task<IHttpActionResult> Postestatus(estatus estatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.estatus.Add(estatus);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (estatusExists(estatus.estatus1))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = estatus.estatus1 }, estatus);
        }

        // DELETE: api/EventStatus/5
        [ResponseType(typeof(estatus))]
        public async Task<IHttpActionResult> Deleteestatus(int id)
        {
            estatus estatus = await db.estatus.FindAsync(id);
            if (estatus == null)
            {
                return NotFound();
            }

            db.estatus.Remove(estatus);
            await db.SaveChangesAsync();

            return Ok(estatus);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool estatusExists(int id)
        {
            return db.estatus.Count(e => e.estatus1 == id) > 0;
        }
    }
}