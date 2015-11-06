using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Security.Cryptography;

namespace oDataService.Classes
{
    public class Auth
    {
        private static Regex passwordTest = new Regex(@"^.*(?=.{4,15})(?=.*\d)(?=.*[a-zA-Z]).*$");
        /// <summary>
        /// Decodes a encoded key value pair in base64 and returns it as a 
        /// username and password.
        /// Sample hash: "dXNlcm5hbWU6cGFzcw=="
        /// Decodaed: "username:pass"
        /// The key will be "username"
        /// The value will be "pass"
        /// </summary>
        /// <param name="hash">A base 64 hash</param>
        /// <returns>Key value pair the key is the user, the value is the pass</returns>
        public static KeyValuePair<string, string> DecodeHash(string hash)
        {
            byte[] data = Convert.FromBase64String(hash);
            string decoded = Encoding.UTF8.GetString(data);
            
            string[] userPass = decoded.Split(':');
            return new KeyValuePair<string, string>(userPass[0], userPass[1]);
        }
        /// <summary>
        /// Regex tests the password to see if it is secure enough
        /// </summary>
        /// <param name="pass">Password to test</param>
        /// <returns>Password to test</returns>
        public static bool TestPass(string pass)
        {
            return passwordTest.IsMatch(pass);
        }
        /// <summary>
        /// Mapped to PasswordHash to hash the password. 
        /// </summary>
        /// <param name="password">Password to be hashed</param>
        /// <returns>hashed password</returns>
        public static string hashPassword(string password)
        {
            return PasswordHash.CreateHash(password);
        }

        public static bool verifyPassword(string password, string hash)
        {
            return PasswordHash.ValidatePassword(password, hash);
        }
    }
}