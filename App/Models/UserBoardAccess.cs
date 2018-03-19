using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App.Models
{
	public class UserBoardAccess : UserBoardAccessPartial
	{
		public UserBoardAccess()
		{
			CanReadBoard = true;
			CanWriteBoard = true;
			CanСhangeBoard = true;

			CanReadBacklog = true;
			CanСhangeBacklog = true;

			CanWriteTask = true;
			CanWriteAllTasks = false;
			CanWriteComment = true;
			CanWriteAccess = true;
			
			CanCloseTask = false;
			CanTestTask = false;
		}
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }
		[Key]
		[Required]
		[StringLength(450)]
		public string UserId { get; set; }
		[Key]
		[Required]
		public long BoardId { get; set; }


		public bool OnlyMineTasks { get; set; }
		public bool OnlyEditableSection { get; set; }

		[ForeignKey("BoardId")]
		public Board Board { get; set; }
	}
}
