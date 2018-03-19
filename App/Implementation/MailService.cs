using App.Interfaces;
using App.Models;
using System.Net;
using System.Net.Mail;

namespace App.Implementation
{
	public class MailService : IMailService
	{
		public void Send(MailServiceSendModel args)
		{
			var client = new SmtpClient("smtp.gmail.com", 587)
			{
				Credentials = new NetworkCredential("0b1.game.m@gmail.com", "claSh!123456"),
				EnableSsl = true
			};
			MailMessage message = new MailMessage(args.From, args.Receptions, args.Subject, args.Body);
			message.IsBodyHtml = true;
			client.Send(message);
		}
	}
}
