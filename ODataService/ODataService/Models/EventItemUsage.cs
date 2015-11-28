namespace oDataService.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class EventItemUsage
    {
        [Key]
        [StringLength(50)]
        public string itemName { get; set; }

        public int? CheckedOut { get; set; }

        [Column(TypeName = "money")]
        public decimal? price { get; set; }
    }
}
