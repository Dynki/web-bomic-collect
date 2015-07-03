using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WB_API
{
    public class EventPayload
    {
        public EventPayload() { }

        public String WBNumber { get; set; }
        public DateTime EventDate { get; set; }
        public String Start { get; set; }
        public String End { get; set; }
        public int Keyworker { get; set; }
        public int EventType { get; set; }
        public int Location { get; set; }
        public int Status { get; set; }
        public String Notes { get; set; }
        public int Duration { get; set; }
				public String User { get; set; }
    }
}