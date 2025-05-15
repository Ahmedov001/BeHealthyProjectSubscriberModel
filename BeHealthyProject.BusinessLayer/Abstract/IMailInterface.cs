using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Abstract
{
	public interface IMailInterface
	{
		Task SendMail(string request);

	}
}
