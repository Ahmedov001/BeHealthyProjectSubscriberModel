namespace BeHealthyProject.Server.Dtos
{
    public class UpdateUserProfileDto
    {
        public string? Username { get; set; }
        public string? Nickname { get; set; }
        public int? Age { get; set; }
        public double? Height { get; set; }
        public double? Weight { get; set; }

        public bool IsCompleteProfile { get; set; }
        public double Balance { get; set; }
    }
}
