using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.Entities
{
    public class DietitianCertificate
    {
        public int Id { get; set; }
        public string FilePath { get; set; }

        public string DietitianId { get; set; }
        public Dietitian Dietitian { get; set; }
    }
}
