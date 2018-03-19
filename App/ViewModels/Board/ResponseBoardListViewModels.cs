using App.Models;
using System;

namespace App.ViewModels.Board
{
	public class ResponseBoardListViewModels : UserBoardAccessPartial
	{
		public long BoardId { get; set; }
		public int Priority { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public bool Publish { get; set; }
		public DateTime DateOfCreation { get; set; }
		public DateTime DateOfModify { get; set; }
		public string ModifyBy { get; set; }
		public string CreateBy { get; set; }
		public bool AllowTesting { get; set; }
	}
}
