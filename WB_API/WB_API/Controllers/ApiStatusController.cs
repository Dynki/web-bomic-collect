using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace WB_API.Controllers
{
    public class ApiStatusController : ApiController
    {
        // GET: api/ApiStatus
        public IHttpActionResult Get()
        {
            return Ok("OK");
        }
    }
}
