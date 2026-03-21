using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Models
{
    public class JoinEventRequestModel
    {
        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string EventId { get; set; }
        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string UserId { get; set; }
    }

    public class CreateEventRequestModel: EventRequestBaseModel
    {
        public string EventName { get; set; }
        [Required(), MinLength(0), MaxLength(3)]
        public List<string> OtherUsers { get; set; }
    }

    public class EventRequestBaseModel
    {
        [Required]
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
