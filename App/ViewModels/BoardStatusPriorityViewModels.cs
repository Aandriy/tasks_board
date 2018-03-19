using App.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace App.ViewModels
{
	public class BoardStatusPriorityViewModels
	{
		[Required]
		public long BoardId { get; set; }
		[Required]
		public List<GoalStatusPriorityViewModels> Items { get; set; }
	}

	public class GoalStatusPriorityViewModels
	{
		[Required]
		public long GoalId { get; set; }
		[Required]
		public int Priority { get; set; }
		[Required]
		public GoalStatusEnum Status { get; set; }
	}
}
