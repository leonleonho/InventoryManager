﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Security.Cryptography;
using oDataService.Models;

namespace oDataService.Classes
{
    public class Auth
    {
        private static Regex passwordTest = new Regex(@"^.*(?=.{4,15})(?=.*\d)(?=.*[a-zA-Z]).*$");
        private static InventoryManagerDatabaseEntities db = new InventoryManagerDatabaseEntities();
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
        /// Checks with the backend to ensure that the user exists.
        /// </summary>
        /// <param name="login">Key value pair, the key is the username, the value is the password</param>
        /// <returns>True or false based on if auth was a success</returns>
        public static bool Authenticate(KeyValuePair<string, string> login)
        {
            string username = login.Key;
            string pass = login.Value;
            Models.User user = db.Users.Where(u => u.userName == username).First();
            if (Auth.verifyPassword(pass, user.password))
            {
                return true;
            }
            return false;
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

        private static bool verifyPassword(string password, string hash)
        {
            return PasswordHash.ValidatePassword(password, hash);
        }
    }
}