using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities
{
	public class Subscriber
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? DietitianId { get; set; }
        public string? SubscriberId { get; set; }
        public string? Plan { get; set; }
    }
}
