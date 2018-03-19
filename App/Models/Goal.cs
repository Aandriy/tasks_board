using App.Areas.Auth.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace App.Models
{
	public class Goal
	{
		public Goal()
		{
			Status = GoalStatusEnum.Backlog;
			Setting = GoalSettingEnum.ImportantNotUrgent;
			Closed = false;
			TimeBound = DateTime.UtcNow.AddDays(1);
			Priority = 1;
		}

		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long GoalId { get; set; }
		[Required]
		public long BoardId { get; set; }
		[Required]
		public int Priority { get; set; }
		[Required]
		[StringLength(256)]
		public string Title { get; set; }
		[Required]
		[StringLength(2048)]
		public string Purpose { get; set; }
		[Required]
		[StringLength(10240)]
		public string AcceptanceCriteria { get; set; }
		[StringLength(10240)]
		public string Details { get; set; }
		public bool Closed { get; set; }
		[Required]
		public DateTime TimeBound { get; set; }
		[Required]
		[StringLength(450)]
		public string OwnerId { get; set; }
		public DateTime DateOfCreation { get; set; }
		public DateTime DateOfModify { get; set; }
		[StringLength(450)]
		public string ModifyById { get; set; }
		[StringLength(450)]
		public string CreateById { get; set; }
		[Required]
		public GoalStatusEnum Status { get; set; }
		[Required]
		public GoalSettingEnum Setting { get; set; }
		[ForeignKey(nameof(BoardId))]
		public virtual Board Board { get; set; }
		[ForeignKey("CreateById")]
		public virtual User CreateBy { get; set; }
		[ForeignKey("ModifyById")]
		public virtual User ModifyBy { get; set; }
		[ForeignKey("OwnerId")]
		public virtual User Owner { get; set; }
		[ForeignKey("GoalId")]
		public List<Comment> Comments { get; set; }
	}
}
