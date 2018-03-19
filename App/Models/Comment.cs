using App.Areas.Auth.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App.Models
{
	public class Comment
	{
		[Key]
		public long CommentId { get; set; }
		[Required]
		public long GoalId { get; set; }
		[Required]
		public string Body { get; set; }
		public DateTime DateOfCreation { get; set; }
		public DateTime DateOfModify { get; set; }
		[StringLength(450)]
		public string OwnerId { get; set; }


		// Relations
		[ForeignKey("OwnerId")]
		public virtual User Owner { get; set; }
		//public virtual Goal Goal { get; set; }
	}
}
