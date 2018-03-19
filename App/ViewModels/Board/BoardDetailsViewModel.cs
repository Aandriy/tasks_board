using App.Models;
using System;

namespace App.ViewModels
{
	public class BoardDetailsViewModel : UserBoardAccessPartial
	{
		public long BoardId { get; set; }
		public int Priority { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public bool Publish { get; set; }
		public DateTime DateOfCreation { get; set; }
		public DateTime DateOfModify { get; set; }
		public string CreateBy { get; set; }
		public string ModifyBy { get; set; }

		public bool AllowTesting { get; set; }
	}
	public class UserViewModel
	{
		public string User { get; set; }
		public string Avatar { get; set; }
	}



	public class UserBoardAccessViewModel : UserBoardAccessPartial
	{
		public long Id { get; set; }
		public long BoardId { get; set; }
		public string User { get; set; }
		public string Avatar { get; set; }
		public bool AllowTesting { get; set; }
		
	}
}

