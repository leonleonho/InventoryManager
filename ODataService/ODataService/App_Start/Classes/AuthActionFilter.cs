using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace oDataService.Classes
{
    public class AuthAction: AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            AuthenticationHeaderValue authHeaders = actionContext.Request.Headers.Authorization;
            if (authHeaders == null)
                return false;
            if (authHeaders.Scheme == "Token")
            {
                string authToken = authHeaders.Parameter;
                return Auth.Authenticate(authToken);

            } else if (authHeaders.Scheme == "Basic")
            {
                string authValue = authHeaders.Parameter;
                KeyValuePair<string, string> login = Auth.DecodeHash(authValue);
                return Auth.Authenticate(login);
            }
            return false;
            
        }
    }
}