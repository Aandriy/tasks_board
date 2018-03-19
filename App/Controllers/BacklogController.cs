using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Filters;
using App.Helpers;
using App.Helpers.Converters;
using App.Models;
using App.ViewModels;
using App.ViewModels.Board;
using App.ViewModels.Goal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Controllers
{

	[Authorize]
	public class BacklogController : Controller
	{
		private readonly ApplicationDbContext _applicationDbContext;
		public BacklogController(
			ApplicationDbContext applicationDbContext)
		{
			_applicationDbContext = applicationDbContext;
		}

		[HttpPost]
		public async Task<IActionResult> GetPrioritizeBacklog(long id)
		{
			ResponseBoardViewModels result = await ResponseBoardHelper.GetResponseBoardViewModels(_applicationDbContext, User, id);
			if (result.Access == null)
			{
				return NotFound();
			}
			if (!result.Access.CanReadBacklog)
			{
				return NotFound();
			}

			var tasks = await _applicationDbContext.Goals
						.Where((tw) => tw.Closed == false &&
							tw.Status == GoalStatusEnum.Backlog &&
							tw.BoardId == id)
						.Include(p => p.Comments)
						.Include(p => p.CreateBy)
						.Include(p => p.Owner)
						.Include(p => p.ModifyBy)
						.OrderBy(tw => tw.Priority)
						.ToListAsync();

			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var isAllEditable = result.Access.CanWriteAllTasks;
			var isEditable = result.Access.CanWriteTask;
			result.Tasks = GoalConverter.ConvertToPreviewGoalViewModelList(tasks, isAllEditable, isEditable, userId);
			return Json(result);
		}


		[HttpPost]
		public async Task<IActionResult> GetBacklogFromBoard(long id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where((a) => a.BoardId == id && a.UserId == userId && a.CanReadBoard == true)
						.Include(b => b.Board)
					.FirstOrDefaultAsync();

			if (userBoardAccess == null)
			{
				return NotFound();
			}
			var tasks = await _applicationDbContext.Goals
						.Where((tw) => tw.Closed == false && tw.Status == GoalStatusEnum.Backlog && tw.BoardId == id)
						.OrderBy(tw => tw.Priority)
						.Select(p => new PreviewGoalViewModel
						{
							BoardId = p.BoardId,
							Closed = p.Closed,
							CreateBy = p.CreateBy.UserName,
							DateOfCreation = p.DateOfCreation,
							DateOfModify = p.DateOfModify,
							Purpose = p.Purpose,
							GoalId = p.GoalId,
							ModifyBy = p.ModifyBy.UserName,
							Owner = p.Owner.FullName,
							OwnerImg = p.Owner.Avatar,
							Priority = p.Priority,
							Setting = p.Setting,
							Status = p.Status,
							TimeBound = p.TimeBound,
							Title = p.Title
						})
						.ToListAsync();
			var result = new
			{
				UserBoardAccess = userBoardAccess,
				Tasks = tasks,
				TaskStatus = Enum.GetValues(typeof(GoalStatusEnum))
								.Cast<GoalStatusEnum>()
								.ToDictionary(t => t.ToString(), t => (int)t)
			};
			return Json(result);
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> ChangeSettingAndPriority([FromBody] RequestSettingPriorityViewModels query)
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
						.Where(
							(tw) => tw.Closed == false &&
							access.BoardId == tw.BoardId &&
							allowedIds.Contains(tw.GoalId) &&
							tw.Status == GoalStatusEnum.Backlog
						)
						.OrderBy(tw => tw.Priority)
						.ToListAsync();

			tasks.ForEach((model) =>
			{
				GoalSettingPriorityViewModels props = query.Items.Find(p => p.GoalId == model.GoalId);
				if (model.Priority != props.Priority || model.Setting != props.Setting)
				{
					if (model.Priority != props.Priority)
					{
						model.Priority = props.Priority;
					}
					if (model.Setting != props.Setting)
					{
						model.Setting = props.Setting;
					}
					_applicationDbContext.Goals.Update(model);
				}
			});
			await _applicationDbContext.SaveChangesAsync();
			return Json(new { });
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> SetOpenTasks([FromBody] BoardStatusPriorityViewModels query)
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

			var maxPriority = await _applicationDbContext
				.Goals
				.Where(p => p.Status == GoalStatusEnum.Backlog && !p.Closed)
				.MaxAsync(p => p.Priority);


			var allowedIds = ids.ToArray();

			var tasks = await _applicationDbContext.Goals
						.Where((tw) =>
							query.BoardId == tw.BoardId &&
							tw.Closed == false &&
							allowedIds.Contains(tw.GoalId) &&
							tw.Status == GoalStatusEnum.Backlog
						)
						.OrderBy(tw => tw.Priority)
						.ToListAsync();

			tasks.ForEach((model) =>
			{
				GoalStatusPriorityViewModels props = query.Items.Find(p => p.GoalId == model.GoalId);
				maxPriority += 1;
				model.Priority = maxPriority;
				model.Status = GoalStatusEnum.Open;
				_applicationDbContext.Goals.Update(model);
			}
			);
			await _applicationDbContext.SaveChangesAsync();
			return Json(new { });
		}
	}
}