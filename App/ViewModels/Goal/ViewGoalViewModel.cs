using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App.ViewModels.Goal
{
	public class ViewGoalViewModel
	{
		public long GoalId { get; set; }
		public long BoardId { get; set; }
		public int Priority { get; set; }
		public string Title { get; set; }
		public string Purpose { get; set; }
		public string AcceptanceCriteria { get; set; }
		public bool Closed { get; set; }
		public DateTime TimeBound { get; set; }
		public string Owner { get; set; }
		public string OwnerAvatar { get; set; }
		public DateTime DateOfCreation { get; set; }
		public DateTime DateOfModify { get; set; }
		public string ModifyBy { get; set; }
		public string CreateBy { get; set; }
		public string Status { get; set; }
		public string Setting { get; set; }
	}
}
