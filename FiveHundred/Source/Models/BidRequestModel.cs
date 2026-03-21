using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Models
{
    public class BidRequestModel
    {
        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string EventId { get; set; }

        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string UserId { get; set; }
        [Required()]
        public Suit Suit { get; set; }
        public int Bid { get; set; } = 0;
    }
}


