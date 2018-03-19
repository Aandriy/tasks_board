using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using App.Models;

namespace App.ViewModels.Goal
{
	public class ResponseGoalViewModel
	{
		
		public string BoardTitle { get; set; }
		public bool BoardWrite { get; set; }
		public List<SelectViewModels> Settings { get; set; }
		public Models.Goal Model { get; set; }
		public List<SelectViewModels> Users { get; set; }
		public List<SelectViewModels> Statuses { get; set; }
		public bool CanTaskClose { get; set; }
	}
}
