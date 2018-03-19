using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Models;
using App.ViewModels.Board;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace App.Helpers
{
	public class ResponseBoardHelper
	{
		public static async Task<ResponseBoardViewModels> GetResponseBoardViewModels(ApplicationDbContext _applicationDbContext, ClaimsPrincipal User, long boardId)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			ResponseBoardViewModels model = new ResponseBoardViewModels();
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where((a) => a.BoardId == boardId && a.UserId == userId && a.CanReadBoard == true)
						.Include(b => b.Board)
					.FirstOrDefaultAsync();
			if (userBoardAccess == null)
			{
				return model;
			}
			model.BoardId = boardId;
			model.BoardTitle = userBoardAccess.Board.Title;
			model.BoardDescription = userBoardAccess.Board.Description;
			model.AmountTasksInDashboard = await _applicationDbContext.Goals.Where((g) => g.BoardId == boardId && g.Closed == false && g.Status != GoalStatusEnum.Backlog).CountAsync();
			model.AmountTotalTasks = await _applicationDbContext.Goals.Where((g) => g.BoardId == boardId).CountAsync();
			model.AmountTasksInBacklog = await _applicationDbContext.Goals.Where((g) => g.BoardId == boardId && g.Closed == false && g.Status == GoalStatusEnum.Backlog).CountAsync();
			model.AmountClosedTasks = await _applicationDbContext.Goals.Where((g) => g.BoardId == boardId && g.Closed == true).CountAsync();
			model.AmountAcceptedTasks = await _applicationDbContext.Goals.Where((g) => g.BoardId == boardId && g.Closed == false && g.Status == GoalStatusEnum.Accepted).CountAsync();
			model.Access = new UserBoardAccessPartial
			{
				CanAcceptTask = userBoardAccess.CanAcceptTask,
				CanCloseTask = userBoardAccess.CanCloseTask,
				CanReadBacklog = userBoardAccess.CanReadBacklog,
				CanReadBoard = userBoardAccess.CanReadBoard,
				CanTestTask = userBoardAccess.CanTestTask,
				CanWriteAccess = userBoardAccess.CanWriteAccess,
				CanWriteBoard = userBoardAccess.CanWriteBoard,
				CanWriteComment = userBoardAccess.CanWriteComment,
				CanWriteTask = userBoardAccess.CanWriteTask,
				CanWriteAllTasks = userBoardAccess.CanWriteAllTasks,
				CanСhangeBacklog = userBoardAccess.CanСhangeBacklog,
				CanСhangeBoard = userBoardAccess.CanСhangeBoard
			};
			model.TaskSettings = Enum.GetValues(typeof(Models.GoalSettingEnum))
								.Cast<Models.GoalSettingEnum>()
								.ToDictionary(t => t.ToString(), t => (int)t);
			model.TaskStatus = Enum.GetValues(typeof(GoalStatusEnum))
							.Cast<GoalStatusEnum>()
							.ToDictionary(t => t.ToString(), t => (int)t);
			model.Display = new DisplaySettingsBoardViewModels
			{
				AllowTesting = userBoardAccess.Board.AllowTesting,
				OnlyEditableSection = userBoardAccess.OnlyEditableSection,
				OnlyMineTasks = userBoardAccess.OnlyMineTasks
			};
			return model;
		}
	}
}
