using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Models
{
    public class ScoreRequestModel
    {
        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string EventId { get; set; }

        [Range(0,10)]
        public int ActualTricks { get; set; }
        /// <summary>
        /// The number of tricks taken by the nil-caller's partner
        /// </summary>
        public int PartnerTricks { get; set; }
    }
}


