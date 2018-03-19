using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App.ViewModels.Component
{
	public class CommentResponseViewModel
	{
		public long CommentId { get; set; }
		public string Body { get; set; }
		public DateTime DateOfModify { get; set; }
		public string UserName { get; set; }
		public string Avatar { get; set; }

	}
}
