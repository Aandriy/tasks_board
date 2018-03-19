using App.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace App.ViewModels
{
	public class RequestSettingPriorityViewModels
	{
		[Required]
		public long BoardId { get; set; }
		[Required]
		public List<GoalSettingPriorityViewModels> Items { get; set; }
	}

	public class GoalSettingPriorityViewModels
	{
		[Required]
		public long GoalId { get; set; }
		[Required]
		public int Priority { get; set; }
		[Required]
		public GoalSettingEnum Setting { get; set; }
	}
}
