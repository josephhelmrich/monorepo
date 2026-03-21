using System;
using System.ComponentModel.DataAnnotations;

namespace FiveHundred.Models
{
    public class AdjustScoreRequest
    {
        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string EventId { get; set; }

        [Required, StringLength(maximumLength: ValidationConstants.ObjectIdLength, MinimumLength = ValidationConstants.ObjectIdLength)]
        public string HandId { get; set; }

        [Range(-800, 800)]
        public int TeamAScore { get; set; }

        [Range(-800, 800)]
        public int TeamBScore { get; set; }
    }
}
