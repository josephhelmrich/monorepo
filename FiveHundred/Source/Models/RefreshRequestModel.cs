using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Models
{
    public class RefreshRequestModel
    {
        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string EventId { get; set; }
        [Required()]
        public int VersionNumber { get; set; }
    }
}


