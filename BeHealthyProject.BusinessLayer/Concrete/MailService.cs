using BeHealthyProject.BusinessLayer.Abstract;
using MailKit;
using MailKit.Net.Proxy;
using MailKit.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace BeHealthyProject.BusinessLayer.Concrete
{
	public class MailService : IMailInterface
	{
		public Task SendMail(string request)
		{
			throw new NotImplementedException();
		}
	}
}
