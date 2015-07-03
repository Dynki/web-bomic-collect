using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
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
    public class EventsController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET api/Events
        public IQueryable<events> Getevents()
        {
            return db.events;
        }

        // GET api/Events/5
        [ResponseType(typeof(events))]
        public async Task<IHttpActionResult> Getevents(int id)
        {
            events events = await db.events.FindAsync(id);
            if (events == null)
            {
                return NotFound();
            }

            return Ok(events);
        }

        // PUT api/Events/5
        public async Task<IHttpActionResult> Putevents(int id, events events)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != events.bkno)
            {
                return BadRequest();
            }

            db.Entry(events).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!eventsExists(id))
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

        // POST api/Events
        [ResponseType(typeof(events))]
        public IHttpActionResult Postevents(EventPayload payload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vp1 client = db.vp1.Where(p => p.persno == payload.WBNumber).FirstOrDefault();

            if (client == null)
            {
                return BadRequest("WB Client Number Not Found");
            }
            else
            {
                events newEvent = new events();
                newEvent.mno = client.mno;
                newEvent.evdate = payload.EventDate;
                newEvent.tto = payload.End.Replace(":","");
                newEvent.tfrom = payload.Start.Replace(":","");
                newEvent.keyw = payload.Keyworker;
                newEvent.estatus = payload.Status;
                newEvent.etype = payload.EventType;
                newEvent.evloc = payload.Location;
                newEvent.rem1 = "*** Added " + DateTime.Now.Hour.ToString() + ":"+ DateTime.Now.Minute.ToString().PadLeft(2,Char.Parse("0")) + " - " + DateTime.Now.Date.ToShortDateString() + " - WB Collect ***  " + payload.Notes;
                newEvent.duration = payload.Duration;
                newEvent.withint = 1;

                // Default data
                newEvent.dexp = 0;
                newEvent.flag = 0;
                newEvent.cost = 0;
                newEvent.trz = 0;
                   
                newEvent.can = 0;
                newEvent.nhs1 = 0;
                newEvent.nhs2 = 0;
                newEvent.nhs3 = 0;
                newEvent.user_delete = "";
                newEvent.user_delete_date = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.withint = 0;
                newEvent.dexp1 = 0;
                newEvent.user_upd = payload.User;
                newEvent.dtalter = DateTime.Now;
                newEvent.casestat = 0;
                newEvent.p1 = 0;
                newEvent.p2 = 0;
                newEvent.p3 = 0;
                newEvent.p4 = 0;
                newEvent.p5 = 0;
                newEvent.p6 = 0;
                newEvent.p7 = 0;
                newEvent.p8 = 0;

                newEvent.p1d = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.p2d = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.p3d = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.p4d = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.p5d = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.p6d = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);

                newEvent.p5p = 0;
                newEvent.cjit = 0;
                newEvent.carat = 0;
                newEvent.p5po = "";
                newEvent.er1 = 0;
                newEvent.er2 = 0;
                newEvent.attinit = 0;
                newEvent.attinityes = 0;
                newEvent.attinityeso = "";
                newEvent.attydate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.attinitno = 0;
                newEvent.attinitnoo = "";
                newEvent.attndate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.folreq = 0;
                newEvent.folatt = 0;
                newEvent.foldatatt = 0;
                newEvent.drrcare = 0;
                newEvent.newprov1 = 0;
                newEvent.newprov1o = "";
                newEvent.newagdate1 = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.newprov2 = 0;
                newEvent.newprov2o = "";
                newEvent.newagdate2 = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.cjitcare = 0;
                newEvent.cpdrawn = 0;
                newEvent.datecp = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.nocpdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.nocpreas = 0;
                newEvent.nocpreaso = "";
                newEvent.rengreas = 0;
                newEvent.rengreaso = "";
                newEvent.primhdel = 0;
                newEvent.primhdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.fadvdel = 0;
                newEvent.fadvdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.comhdel = 0;
                newEvent.comhdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.hadvdel = 0;
                newEvent.hadvdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.peersdel = 0;
                newEvent.peersdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.leisdel = 0;
                newEvent.leisdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.supedudel = 0;
                newEvent.supedudate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.fsupdel = 0;
                newEvent.fsupdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.supempdel = 0;
                newEvent.supempdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.osupdel = 0;
                newEvent.osupdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.osuptext = "";
                newEvent.harmdel = 0;
                newEvent.harmdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.overmdel = 0;
                newEvent.overmdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.rapidpdel = 0;
                newEvent.rapidpdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.gwdel = 0;
                newEvent.gwdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.strucdel = 0;
                newEvent.strucdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.bialcdel = 0;
                newEvent.bialcdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.crackdel = 0;
                newEvent.crackdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.appres = 0;

                newEvent.trx = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.user_new = "WB Collect";
                newEvent.user_new_date = DateTime.Now;
                newEvent.referral = 0;
                newEvent.sms_dt = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.sms_tel = "";
                newEvent.sms_user = "";
                newEvent.sms_userid = 0;
                newEvent.keyw2 = 0;
                newEvent.keyw3 = 0;
                newEvent.keyw4 = 0;
                newEvent.keyw5 = 0;
                newEvent.gid = 0;
                newEvent.rctype = 0;
                newEvent.rcdays = 0;
                newEvent.rccnt = 0;
                newEvent.rid = 0;
                newEvent.rsdate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.nca = 0;
                newEvent.redate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.recpat = 0;
                newEvent.recpatday = 0;
                newEvent.recpatdayn = 0;
                newEvent.recpatwekn = 0;
                newEvent.recpatwekd1 = 0;
                newEvent.recpatwekd2 = 0;
                newEvent.recpatwekd3 = 0;
                newEvent.recpatwekd4 = 0;
                newEvent.recpatwekd5 = 0;
                newEvent.recpatwekd6 = 0;
                newEvent.recpatwekd7 = 0;
                newEvent.recpatmon = 0;
                newEvent.recpatmonday = 0;
                newEvent.recpatmonmon = 0;
                newEvent.recpatmonthe = 0;
                newEvent.recpatmondayw = 0;
                newEvent.recpatyea = 0;
                newEvent.recpatyeamonth = 0;
                newEvent.recpatyeaday = 0;
                newEvent.recpatyeadayw = 0;
                newEvent.recpatrange = 0;
                newEvent.recpatrangenoc = 0;
                newEvent.recpatrangedate = new DateTime(1900, 01, 01, 00, 00, 00, 00, DateTimeKind.Local);
                newEvent.recdiff = 0;
                newEvent.etype2 = 0;
                newEvent.sms_text = "";
                newEvent.visitac = 0;
                newEvent.rem2 = "";
                newEvent.rem3 = "";
                newEvent.rem4 = "";

                var result = new ObjectParameter("nRetval", 0);
                db.sp_ww_NewID("events", result);
                int nextId = 0;
                int.TryParse(result.Value.ToString(), out nextId);
                newEvent.bkno = nextId;
                db.events.Add(newEvent);

                try
                {
                    db.SaveChanges();
                }
                catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
                {
                    Exception raise = dbEx;
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            string message = string.Format("{0}:{1}",
                                validationErrors.Entry.Entity.ToString(),
                                validationError.ErrorMessage);
                            // raise a new exception nesting
                            // the current instance as InnerException
                            raise = new InvalidOperationException(message, raise);
                        }
                    }
                   throw raise;

                }            
                return CreatedAtRoute("DefaultApi", new { id = newEvent.bkno }, newEvent);
            }

        }

        // DELETE api/Events/5
        [ResponseType(typeof(events))]
        public async Task<IHttpActionResult> Deleteevents(int id)
        {
            events events = await db.events.FindAsync(id);
            if (events == null)
            {
                return NotFound();
            }

            db.events.Remove(events);
            await db.SaveChangesAsync();

            return Ok(events);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool eventsExists(int id)
        {
            return db.events.Count(e => e.bkno == id) > 0;
        }
    }
}