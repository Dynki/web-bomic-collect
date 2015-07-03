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
    public class KeyWorkersController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET: api/KeyWorkers
        public IQueryable<keyw> Getkeyw()
        {
            return db.keyw.Where(e => e.can == 0 && e.f_left == 1).OrderBy(r => r.name);
        }

        // GET: api/KeyWorkers/5
        [ResponseType(typeof(keyw))]
        public async Task<IHttpActionResult> Getkeyw(int id)
        {
            keyw keyw = await db.keyw.Where(e => e.keyw1 == id && e.can == 0 && e.f_left == 1).FirstOrDefaultAsync();
            if (keyw == null)
            {
                return NotFound();
            }

            return Ok(keyw);
        }

        // PUT: api/KeyWorkers/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Putkeyw(int id, keyw keyw)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != keyw.keyw1)
            {
                return BadRequest();
            }

            db.Entry(keyw).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!keywExists(id))
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

        // POST: api/KeyWorkers
        [ResponseType(typeof(keyw))]
        public async Task<IHttpActionResult> Postkeyw(keyw keyw)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.keyw.Add(keyw);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (keywExists(keyw.keyw1))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = keyw.keyw1 }, keyw);
        }

        // DELETE: api/KeyWorkers/5
        [ResponseType(typeof(keyw))]
        public async Task<IHttpActionResult> Deletekeyw(int id)
        {
            keyw keyw = await db.keyw.FindAsync(id);
            if (keyw == null)
            {
                return NotFound();
            }

            db.keyw.Remove(keyw);
            await db.SaveChangesAsync();

            return Ok(keyw);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool keywExists(int id)
        {
            return db.keyw.Count(e => e.keyw1 == id) > 0;
        }
    }
}