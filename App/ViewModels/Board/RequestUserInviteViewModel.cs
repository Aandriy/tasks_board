using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace App.ViewModels.Board
{
	public class RequestUserInviteViewModel
	{
		[Required]
		public long boardId { get; set; }
		[Required]
		[EmailAddress(ErrorMessage = "Invalid Email Address")]
		public string email { get; set; }
	}
}
