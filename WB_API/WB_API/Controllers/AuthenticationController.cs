using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WB_API.Models;

namespace WB_API.Controllers
{
    public class AuthenticationController : ApiController
    {
        private BlitheWBEntities db = new BlitheWBEntities();

        // GET: api/Authentication
        public HttpResponseMessage Post([FromBody] AppUser userCreds)
        {
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.NotModified);

            usrs_dat usrs_dat = db.usrs_dat.Where(b => b.user_name.ToLower() == userCreds.username.ToLower()).FirstOrDefault();
            if (usrs_dat == null)
            {
                response = Request.CreateResponse(HttpStatusCode.NotFound, "Username is not found");
            }
            else
            {
                Security security = new Security();

                var hashedCreds = security.Encrypt(userCreds.username.Trim().ToLower() + userCreds.pin.Trim());
                var hashedFromDb = security.Encrypt(usrs_dat.user_name.Trim().ToLower() + usrs_dat.pin.Trim());

                if (hashedCreds == hashedFromDb)
                {
                    var userToReturn = new UserResponse();

                    userToReturn.username = userCreds.username;
                    userToReturn.hash = hashedFromDb;

                    response = Request.CreateResponse(HttpStatusCode.OK, userToReturn);
                }
                else
                {
                    response = Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid Credentials");
                }
            }

            return response;
        }
    }
}
