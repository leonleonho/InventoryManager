using Microsoft.CSharp.RuntimeBinder;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using oDataService.Models;
using oDataService.Classes;
using System.Threading.Tasks;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Data.Entity.Validation;

namespace oDataService.Controllers
{
    public class RegistrationController : ApiController
    {
        private InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();
        // GET <controller>
        public HttpResponseMessage Get()
        {
            HttpResponseMessage resp = new HttpResponseMessage(HttpStatusCode.BadRequest);
            resp.Content = new StringContent("Default get is denied");
            return resp;
        }

        // GET <controller>/5
        public string Get(int id)
        {
            KeyValuePair<string, int> userID = new KeyValuePair<string, int>("userID", id);
            KeyValuePair<string, int>[] keyVal = new KeyValuePair<string, int>[] { userID };
            Models.User users = db.Users.Find(id);
            return users.userName;
            
        }

        public async Task<HttpResponseMessage> PostRegister(Registration reg)
        {
            string username = null ;
            string pass;
            try
            {
                Models.User newUser = new Models.User();
                KeyValuePair<string, string> temp = Auth.DecodeHash(reg.registrationHash);
                username = temp.Key;
                pass = temp.Value;
                if(!Auth.TestPass(pass)) //Ensure that the password is secure enough
                {
                    HttpResponseMessage resp = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    resp.Content = new StringContent("Failed password security test");
                    return resp;
                }
                newUser.userName = username;
                newUser.password = Auth.hashPassword(pass);
                newUser.email = reg.email;
                newUser.phone = reg.phone;
                newUser.lName = reg.lName;
                newUser.fName = reg.fName;
                db.Users.Add(newUser);
                await db.SaveChangesAsync();
            } catch(DbUpdateException ex)
            {
                HttpResponseMessage resp = new HttpResponseMessage(HttpStatusCode.BadRequest);
                resp.Content = new StringContent("Failed to update the database");
                Exception baseEx = ex.GetBaseException();
                if(baseEx is SqlException)
                {
                    SqlException sqlExp = (SqlException)baseEx;
                    string json = new JavaScriptSerializer().Serialize(sqlExp.Errors);
                    resp.Content = new StringContent(json);
                }
                
                return resp;
            }
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        public class Registration
        {
            public string registrationHash { get; set; }
            public string email { get; set; }
            public decimal phone { get; set; }
            public string fName { get; set; }
            public string lName { get; set; }
        }
    }
    
}
