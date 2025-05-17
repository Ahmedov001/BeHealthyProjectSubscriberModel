using Microsoft.AspNetCore.Identity;

namespace BeHealthyProject.Entities
{
    public class User : BaseUser
    {
        public int? Age { get; set; }
        public double? Height { get; set; }
        public double? Weight { get; set; }
        public double Balance { get; set; } = 0;
        public List<Subscriber>? Subscribers { get; set; } = new();

    }
}
