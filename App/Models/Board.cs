using App.Areas.Auth.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App.Models
{
	public class Board
	{
		[Key]
		public long BoardId { get; set; }
		public int Priority { get; set; }
		[StringLength(256)]
		public string Title { get; set; }
		[StringLength(2560)]
		public string Description { get; set; }
		public bool Publish { get; set; }
		public DateTime DateOfCreation { get; set; }
		public DateTime DateOfModify { get; set; }
		[StringLength(450)]
		public string ModifyById { get; set; }
		[StringLength(450)]
		public string CreateById { get; set; }
		public bool AllowTesting { get; set; }

		// Relations
		public List<Goal> Goals { get; set; }
		[ForeignKey("CreateById")]
		public virtual User CreateBy { get; set; }
		[ForeignKey("ModifyById")]
		public virtual User ModifyBy { get; set; }
	}
}
