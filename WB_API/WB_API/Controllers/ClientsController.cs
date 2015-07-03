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
    public class ClientsController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET: api/Clients
        public IQueryable<vp1> Getvp1()
        {
            return db.vp1;
        }

        // GET: api/Clients/5
        [ResponseType(typeof(vp1))]
        public async Task<IHttpActionResult> Getvp1(int id)
        {
            vp1 vp1 = await db.vp1.FindAsync(id);
            if (vp1 == null)
            {
                return NotFound();
            }

            return Ok(vp1);
        }

        // PUT: api/Clients/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Putvp1(int id, vp1 vp1)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vp1.mno)
            {
                return BadRequest();
            }

            db.Entry(vp1).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vp1Exists(id))
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

        // POST: api/Clients
        [ResponseType(typeof(vp1))]
        public async Task<IHttpActionResult> Postvp1(vp1 vp1)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.vp1.Add(vp1);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (vp1Exists(vp1.mno))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = vp1.mno }, vp1);
        }

        // DELETE: api/Clients/5
        [ResponseType(typeof(vp1))]
        public async Task<IHttpActionResult> Deletevp1(int id)
        {
            vp1 vp1 = await db.vp1.FindAsync(id);
            if (vp1 == null)
            {
                return NotFound();
            }

            db.vp1.Remove(vp1);
            await db.SaveChangesAsync();

            return Ok(vp1);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool vp1Exists(int id)
        {
            return db.vp1.Count(e => e.mno == id) > 0;
        }
    }
}