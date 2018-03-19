using App.Models;
using App.ViewModels.Goal;
using System;
using System.Collections.Generic;

namespace App.ViewModels.Board
{
	public class ResponseBoardViewModels
	{
		public long BoardId { get; set; }
		public string BoardTitle { get; set; }
		public string BoardDescription { get; set; }
		public int AmountTotalTasks { get; set; }
		public int AmountClosedTasks { get; set; }
		public int AmountTasksInDashboard { get; set; }
		public int AmountTasksInBacklog { get; set; }
		public int AmountAcceptedTasks { get; set; }
		public UserBoardAccessPartial Access { get; set; }
		public List<PreviewGoalViewModel> Tasks { get; set; }
		public Dictionary<string, int> TaskSettings { get; set; }
		public Dictionary<string, int> TaskStatus { get; set; }
		public DisplaySettingsBoardViewModels Display { get; set; }
	}
	public class DisplaySettingsBoardViewModels {
		public bool OnlyMineTasks { get; set; }
		public bool OnlyEditableSection { get; set; }
		public bool AllowTesting { get; set; }
	}
}
