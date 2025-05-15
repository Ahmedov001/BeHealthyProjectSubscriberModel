using Microsoft.AspNetCore.Identity;

namespace BeHealthyProject.Entities
{
    public class BaseUser : IdentityUser
    {
        public string? Nickname { get; set; }
        public bool IsCompleteProfile { get; set; } = false;
    }
}
