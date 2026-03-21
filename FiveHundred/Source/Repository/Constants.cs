using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiveHundred.Repository
{
    public static class Constants
    {
        public const string DatabaseName = "FiveHundred";
#if DEBUG
        public const string EventCollection = "Events_Dev";
        public const string EventCollection_Prod = "Events";
#else
        public const string EventCollection = "Events";
#endif
        public const string GameCollection = "Games";
        public const string UserCollection = "Users";
        public const string ConnectionString = "mongodb+srv://FiveHundredApp:jjshkH2WCarUrlXv@cluster0.xjcon.mongodb.net/?retryWrites=true&w=majority";

        public static readonly string[] Chadisms = new string[]
        {
            "I think I'm gonna piss hot bro",
            "Welcome to Cloud 11!",
            "That was as bad as when I got set going alone",
            "Looks like I got caught with a smokin bong",
            "I don't know where we're going, but we're making great time",
            "So... What do you want to do?",
            "I don't want to piss anyone off",
            "Whatever's Clever",
            "What happened partner?  I was counting on you for 4",
            "I thought the joker was in the blind",
            "Oh shit I discarded trump",
            "What to do you mean I called it?  Fuck!",
            "Howdy-Ho Kyle!",
            "Woooohooooo!",
            "Shit, I think I am supposed to be in an interview right now"
        };
    }
}
