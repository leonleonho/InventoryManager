//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace oDataService.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class InventoryUsage
    {
        [Key]
        public int inventoryID { get; set; }
        public decimal condition { get; set; }
        public System.DateTime dateAdded { get; set; }
        public int itemID { get; set; }
        public Nullable<decimal> price { get; set; }
        public string purchasedAt { get; set; }
        public Nullable<int> memberID { get; set; }
        public string name { get; set; }
        public string itemName { get; set; }
        public string itemDescription { get; set; }
        public string type { get; set; }
        public Nullable<int> eventInventoryID { get; set; }
    }
}
