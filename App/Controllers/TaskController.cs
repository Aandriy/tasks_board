using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Filters;
using App.Helpers;
using App.Models;
using App.ViewModels;
using App.ViewModels.Goal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Controllers
{
	[Authorize]
	public class TaskController : Controller
	{
		private readonly ApplicationDbContext _applicationDbContext;
		public TaskController(
			ApplicationDbContext applicationDbContext)
		{
			_applicationDbContext = applicationDbContext;
		}

		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> Manage([FromBody] Goal model)
		{

			if (model.BoardId == 0)
			{
				return NotFound();
			}
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var result = await _applicationDbContext.UserBoardAccesses.Where((t) => t.BoardId == model.BoardId && t.UserId == userId && t.CanWriteTask == true).FirstOrDefaultAsync();
			if (result == null)
			{
				return NotFound();
			}
			DateTime date = DateTime.UtcNow;
			model.DateOfModify = date;
			model.ModifyById = userId;

			if (model.GoalId == 0)
			{
				model.DateOfCreation = date;
				model.CreateById = userId;
				_applicationDbContext.Goals.Add(model);
				await _applicationDbContext.SaveChangesAsync();
			}
			else
			{
				var current = await _applicationDbContext.Goals.Where((t) => t.BoardId == model.BoardId && t.GoalId == model.GoalId).FirstOrDefaultAsync();
				if (current == null)
				{
					return NotFound();
				}
				model.DateOfCreation = current.DateOfCreation;
				model.CreateById = current.CreateById;

				_applicationDbContext.Entry(current).State = EntityState.Detached;
				current = null;

				_applicationDbContext.Goals.Update(model);
				await _applicationDbContext.SaveChangesAsync();
			}
			return Ok(new
			{
				Id = model.GoalId
			});

		}
		[HttpPost]
		public async Task<IActionResult> GetCreateTaskData(long id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
				.Where((t) => t.BoardId == id && t.UserId == userId && t.CanWriteTask == true)
				.Include(t => t.Board)
				.FirstOrDefaultAsync();

			if (userBoardAccess == null)
			{
				return NotFound();
			}

			var result = GetManageTaskModel(new Goal
			{
				BoardId = id,
				OwnerId = userId
			}, userBoardAccess);

			return Json(result);
		}

		[HttpPost]
		public async Task<IActionResult> GetEditTaskData(long id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			Goal task = await _applicationDbContext.Goals.Where((t) => t.GoalId == id).FirstOrDefaultAsync();

			if (task == null)
			{
				return NotFound();
			}
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where((t) => t.BoardId == task.BoardId && t.UserId == userId)
					.Include(t => t.Board)
					.FirstOrDefaultAsync();

			if (userBoardAccess == null)
			{
				return NotFound();
			}
			var result = GetManageTaskModel(task, userBoardAccess);
			return Json(result);
		}
		[HttpPost]
		public async Task<IActionResult> GetViewTaskDetails([FromBody]RequestSimpleModel<long> model)
		{
			long id = model.Item;
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			Goal result = await _applicationDbContext.Goals
					.Where((t) => t.GoalId == id)
					.Include(t => t.CreateBy)
					.Include(t => t.Owner)
					.Include(t => t.ModifyBy)
					.FirstOrDefaultAsync();

			if (result == null)
			{
				return NotFound();
			}
			var access = await _applicationDbContext
				.UserBoardAccesses
				.Where((t) => t.BoardId == result.BoardId && t.UserId == userId && t.CanReadBoard == true)
				.Include(a => a.Board)
				.FirstOrDefaultAsync();

			if (access == null)
			{
				return NotFound();
			}
			ViewGoalViewModel goal = new ViewGoalViewModel
			{
				BoardId = result.BoardId,
				Closed = result.Closed,
				CreateBy = result.CreateBy.UserName,
				DateOfCreation = result.DateOfCreation,
				DateOfModify = result.DateOfModify,
				Purpose = result.Purpose,
				AcceptanceCriteria = result.AcceptanceCriteria,
				GoalId = result.GoalId,
				ModifyBy = result.ModifyBy.FullName,
				Owner = result.Owner.FullName,
				OwnerAvatar = result.Owner.Avatar,
				Priority = result.Priority,
				Setting = ((GoalSettingEnum)result.Setting).ToString(),
				Status = ((GoalStatusEnum)result.Status).ToString(),
				TimeBound = result.TimeBound,
				Title = result.Title
			};

			return Json(new
			{
				Task = goal,
				Access = access
			});
		}

		[HttpPost]
		public async Task<IActionResult> ChangeStatusAndPriority([FromBody] BoardStatusPriorityViewModels query)
		{
			if (ModelState.IsValid)
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
				var access = await _applicationDbContext.UserBoardAccesses
						.Where((a) => a.BoardId == query.BoardId && a.UserId == userId && a.CanReadBoard == true)
							.Include(b => b.Board)
						.FirstOrDefaultAsync();
				if (access == null)
				{
					return NotFound();
				}

				List<long> ids = new List<long>();
				query.Items.ForEach((item) =>
				{
					ids.Add(item.GoalId);
				});

				var allowedIds = ids.ToArray();

				var tasks = await _applicationDbContext.Goals
							.Where((tw) => tw.Closed == false && allowedIds.Contains(tw.GoalId)) //.Include(t=>t.user)
							.OrderBy(tw => tw.Priority)
							.ToListAsync();

				tasks.ForEach((model) =>
				{
					GoalStatusPriorityViewModels props = query.Items.Find(p => p.GoalId == model.GoalId);
					model.Priority = props.Priority;
					model.Status = props.Status;
					_applicationDbContext.Goals.Update(model);
				}
				);
				await _applicationDbContext.SaveChangesAsync();

			}
			return Json(new { });
		}

		private List<SelectViewModels> GetStatuses(bool canAcceptTask, bool canTestTask)
		{
			var result = new List<SelectViewModels>();
			result.Add(new SelectViewModels
			{
				Value = Convert.ToString((int)GoalStatusEnum.Backlog),
				Label = "Backlog"
			});
			result.Add(new SelectViewModels
			{
				Value = Convert.ToString((int)GoalStatusEnum.Open),
				Label = "Open"
			});
			result.Add(new SelectViewModels
			{
				Value = Convert.ToString((int)GoalStatusEnum.InProgress),
				Label = "In Progress"
			});
			result.Add(new SelectViewModels
			{
				Value = Convert.ToString((int)GoalStatusEnum.Done),
				Label = "Done"
			});
			if (canTestTask) {
				result.Add(new SelectViewModels
				{
					Value = Convert.ToString((int)GoalStatusEnum.InTesting),
					Label = "In Testing"
				});
				result.Add(new SelectViewModels
				{
					Value = Convert.ToString((int)GoalStatusEnum.Valid),
					Label = "Valid"
				});
				result.Add(new SelectViewModels
				{
					Value = Convert.ToString((int)GoalStatusEnum.Invalid),
					Label = "Invalid"
				});
			}
			if (canAcceptTask)
			{
				result.Add(new SelectViewModels
				{
					Value = Convert.ToString((int)GoalStatusEnum.Accepted),
					Label = "Accepted"
				});
				result.Add(new SelectViewModels
				{
					Value = Convert.ToString((int)GoalStatusEnum.Rejected),
					Label = "Rejected"
				});
			}
			return result;
		}
		private ResponseGoalViewModel GetManageTaskModel(Goal goal, UserBoardAccess userBoardAccess)
		{
			var users = (from access in _applicationDbContext.UserBoardAccesses
						 from user in _applicationDbContext.Users
						 where (user.Id == access.UserId && access.BoardId == goal.BoardId)
						 select
						 new SelectViewModels
						 {
							 Value = user.Id,
							 Label = user.FullName
						 }).ToList();
			List<SelectViewModels> settings = ((GoalSettingEnum[])Enum.GetValues(typeof(GoalSettingEnum))).Select(c => new SelectViewModels() { Value = Convert.ToString((int)c), Label = c.ToString() }).ToList();

			return new ResponseGoalViewModel
			{
				Model = goal,
				Users = users,
				Settings = settings,
				Statuses = GetStatuses(userBoardAccess.CanAcceptTask, userBoardAccess.CanTestTask && userBoardAccess.Board.AllowTesting),
				BoardTitle = userBoardAccess.Board.Title,
				BoardWrite = userBoardAccess.CanWriteBoard,
				CanTaskClose = userBoardAccess.CanCloseTask
			};
		}
	}
}