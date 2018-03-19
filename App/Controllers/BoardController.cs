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
using App.ViewModels.Common;
using App.ViewModels.Goal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Controllers
{

	[Authorize]
	public class BoardController : Controller
	{
		private readonly ApplicationDbContext _applicationDbContext;
		private readonly IHostingEnvironment _env;
		public BoardController(
			ApplicationDbContext applicationDbContext,
			IHostingEnvironment env
		)
		{
			_applicationDbContext = applicationDbContext;
			_env = env;
		}


		[HttpPost]
		public async Task<IActionResult> GetBoardList()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var bords = await _applicationDbContext
				.UserBoardAccesses
				.Include(p => p.Board)
				.ThenInclude(t => t.CreateBy)
				.Include(p => p.Board)
				.ThenInclude(t => t.ModifyBy)
				.Where(p => p.UserId == userId && p.CanReadBoard)
				.Select(p => new ResponseBoardListViewModels
				{
					BoardId = p.BoardId,
					Title = p.Board.Title,
					ModifyBy = p.Board.ModifyBy.FullName,
					CreateBy = p.Board.CreateBy.FullName,
					AllowTesting = p.Board.AllowTesting,
					DateOfCreation = p.Board.DateOfCreation,
					DateOfModify = p.Board.DateOfModify,
					Description = p.Board.Description,
					Priority = p.Board.Priority,
					Publish = p.Board.Publish,
					CanAcceptTask = p.CanAcceptTask,
					CanCloseTask = p.CanCloseTask,
					CanReadBacklog = p.CanReadBacklog,
					CanReadBoard = p.CanReadBoard,
					CanTestTask = p.CanTestTask,
					CanWriteAccess = p.CanWriteAccess,
					CanWriteBoard = p.CanWriteBoard,
					CanWriteComment = p.CanWriteComment,
					CanWriteTask = p.CanWriteTask,
					CanСhangeBacklog = p.CanСhangeBacklog,
					CanСhangeBoard = p.CanСhangeBoard
				})
				.OrderBy(p => p.Publish)
				.ThenBy(p => p.Priority)
				.ToListAsync();

			return Json(bords);
		}


		[HttpPost]
		public async Task<IActionResult> GetClosedTasks(long id)
		{
			ResponseBoardViewModels result = await ResponseBoardHelper.GetResponseBoardViewModels(_applicationDbContext, User, id);
			if (result.Access == null)
			{
				return NotFound();
			}
			if (!result.Access.CanCloseTask)
			{
				return NotFound();
			}
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var isAllEditable = result.Access.CanWriteAllTasks;
			var isEditable = result.Access.CanWriteTask;
			var tasks = await _applicationDbContext.Goals
						.Where((tw) => tw.BoardId == result.BoardId && tw.Closed == true )
						.Include(p => p.Comments)
						.Include(p => p.CreateBy)
						.Include(p => p.Owner)
						.Include(p => p.ModifyBy)
						.OrderByDescending(tw => tw.DateOfModify)
						.ToListAsync();

			result.Tasks = GoalConverter.ConvertToPreviewGoalViewModelList(tasks, isAllEditable, isEditable, userId);

			return Json(result);
		}


		[HttpPost]
		public async Task<IActionResult> GetBacklogFromBoard([FromBody]RequestSimpleModel<long> model)
		{
			long id = model.Item;
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
						.Where((tw) => tw.Closed == false && tw.Status == GoalStatusEnum.Backlog)
						.OrderBy(tw => tw.Priority)
						.ToListAsync();
			var result = new
			{
				UserBoardAccess = userBoardAccess,
				Tasks = tasks,
				TaskStatus = Enum.GetValues(typeof(Models.GoalStatusEnum))
								.Cast<Models.GoalStatusEnum>()
								.ToDictionary(t => t.ToString(), t => (int)t)
			};
			return Json(result);
		}


		[HttpPost]
		public async Task<IActionResult> GetBoard(long id)
		{
			ResponseBoardViewModels result = await ResponseBoardHelper.GetResponseBoardViewModels(_applicationDbContext, User, id);
			if (result.Access == null)
			{
				return NotFound();
			}

			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);



			var allowedStatus = new List<GoalStatusEnum> {
				GoalStatusEnum.Done,
				GoalStatusEnum.InProgress,
				GoalStatusEnum.Open
			};

			if (!(!result.Access.CanAcceptTask && result.Display.OnlyEditableSection))
			{
				allowedStatus.Add(GoalStatusEnum.Rejected);
				allowedStatus.Add(GoalStatusEnum.Accepted);
			}

			if (result.Display.AllowTesting && !(!result.Access.CanTestTask && result.Display.OnlyEditableSection))
			{
				allowedStatus.Add(GoalStatusEnum.InTesting);
				allowedStatus.Add(GoalStatusEnum.Invalid);
				allowedStatus.Add(GoalStatusEnum.Valid);
			}

			var statususes = allowedStatus.ToArray();

			var source = (!result.Display.OnlyMineTasks) ?
				_applicationDbContext.Goals.Where((tw) => tw.Closed == false && statususes.Contains(tw.Status) && tw.BoardId == id)
				: _applicationDbContext.Goals.Where((g) => g.Closed == false && statususes.Contains(g.Status) && g.BoardId == id && g.OwnerId == userId);

			var tasks = await source
					.Include(p => p.Comments)
					.Include(p => p.CreateBy)
					.Include(p => p.Owner)
					.Include(p => p.ModifyBy)
					.OrderBy(tw => tw.Priority)
					.ToListAsync();
			var isAllEditable = result.Access.CanWriteAllTasks;
			var isEditable = result.Access.CanWriteTask;

			result.Tasks = GoalConverter.ConvertToPreviewGoalViewModelList(tasks, isAllEditable, isEditable, userId);
			return Json(result);
		}


		[HttpPost]
		public async Task<IActionResult> GetBoardDetails(long id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var _repository = _applicationDbContext.Boards;
			var access = await _applicationDbContext.UserBoardAccesses
						.Where((t) => t.BoardId == id && t.UserId == userId)
						.FirstOrDefaultAsync();
			if (access == null)
			{
				return NotFound();
			}

			var board = await _applicationDbContext.Boards
						.Where((t) => t.BoardId == id)
							.Include(t => t.CreateBy)
							.Include(t => t.ModifyBy)
						.FirstOrDefaultAsync();
			if (board == null)
			{
				return NotFound();
			}

			BoardDetailsViewModel result = new BoardDetailsViewModel()
			{
				BoardId = board.BoardId,
				Title = board.Title,
				Description = board.Description,
				Publish = board.Publish,
				Priority = board.Priority,
				DateOfCreation = board.DateOfCreation,
				DateOfModify = board.DateOfModify,
				CreateBy = board.CreateBy.UserName,
				ModifyBy = board.ModifyBy.UserName,

				AllowTesting = board.AllowTesting,

				CanAcceptTask = access.CanAcceptTask,
				CanCloseTask = access.CanCloseTask,
				CanReadBacklog = access.CanReadBacklog,
				CanReadBoard = access.CanReadBoard,
				CanTestTask = access.CanTestTask,
				CanWriteAccess = access.CanWriteAccess,
				CanWriteBoard = access.CanWriteBoard,
				CanWriteComment = access.CanWriteComment,
				CanWriteTask = access.CanWriteAccess,
				CanСhangeBacklog = access.CanWriteAccess,
				CanСhangeBoard = access.CanСhangeBoard
			};
			return Json(result);
		}


		[HttpPost]
		public async Task<IActionResult> GetEditBoardDetails([FromBody]RequestSimpleModel<long> model)
		{
			var id = model.Item;
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var _repository = _applicationDbContext.Boards;
			var result = await _applicationDbContext.UserBoardAccesses
					.Where((t) => t.BoardId == id && t.UserId == userId && t.CanWriteBoard == true)
					.Include(b => b.Board)
					.FirstOrDefaultAsync();

			if (result == null)
			{
				return NotFound();
			}

			return Json(result.Board);
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> Manage([FromBody]Board model)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			DateTime date = DateTime.UtcNow;
			model.DateOfModify = date;
			model.ModifyById = userId;

			if (model.BoardId == 0)
			{
				model.DateOfCreation = date;
				model.CreateById = userId;
				_applicationDbContext.Boards.Add(model);
				await _applicationDbContext.SaveChangesAsync();
				var access = new UserBoardAccess
				{
					UserId = userId,
					BoardId = model.BoardId
				};
				_applicationDbContext.UserBoardAccesses.Add(access);
				await _applicationDbContext.SaveChangesAsync();
			}
			else
			{
				var userBoardAccesses = await _applicationDbContext.UserBoardAccesses
						.Where((t) => t.BoardId == model.BoardId && t.UserId == userId && t.CanWriteBoard == true)
						.Include(b => b.Board).FirstOrDefaultAsync();
				if (userBoardAccesses == null)
				{
					return NotFound();
				}
				var current = userBoardAccesses.Board;
				if (current == null)
				{
					return NotFound();
				}
				model.DateOfCreation = current.DateOfCreation;
				model.CreateById = current.CreateById;

				if (!model.AllowTesting)
				{
					var allowedStatus = new List<GoalStatusEnum> {
							GoalStatusEnum.InTesting,
							GoalStatusEnum.Invalid,
							GoalStatusEnum.Valid
						}.ToArray();

					var tasks = await _applicationDbContext.Goals.Where(g => g.BoardId == model.BoardId && allowedStatus.Contains(g.Status)).ToListAsync();
					if (tasks.Any())
					{
						tasks.ForEach(task =>
						{
							task.Status = GoalStatusEnum.Done;
							_applicationDbContext.Goals.Update(task);
						});
						await _applicationDbContext.SaveChangesAsync();
					}
				}
				_applicationDbContext.Entry(current).State = EntityState.Detached;
				current = null;

				_applicationDbContext.Boards.Update(model);
				await _applicationDbContext.SaveChangesAsync();
			}
			return Ok(new { Id = model.BoardId });
		}


		[HttpPost]
		public async Task<IActionResult> GetBoardUsers([FromBody]RequestPagingViewModel model)
		{

			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where((a) => a.BoardId == model.Id && a.UserId == userId && a.CanReadBoard == true)
					.FirstOrDefaultAsync();

			if (userBoardAccess == null)
			{
				return NotFound();
			}
			int pageSize = 10;
			var pageNumber = model.Page;
			var totalItems = await _applicationDbContext.UserBoardAccesses.Where(t => t.BoardId == model.Id).CountAsync();
			var totalPages = (int)Math.Ceiling((double)totalItems / (double)pageSize);
			if (totalPages == 0)
			{
				totalPages = 1;
			}

			if (pageNumber > totalPages)
			{
				pageNumber = totalPages;
			}
			var start = (pageNumber - 1) * pageSize;
			if (userBoardAccess.CanWriteAccess)
			{
				return Ok(new ResponsePagingViewModel<UserBoardAccessViewModel>
				{

					First = totalItems + 1,
					Items = await _applicationDbContext.UserBoardAccesses
									.Where((a) => a.BoardId == model.Id)
									.Join(_applicationDbContext.Users.DefaultIfEmpty(),
										a => a.UserId,
										u => u.Id,
										(a, u) => new UserBoardAccessViewModel
										{
											User = u.FullName,
											BoardId = a.BoardId,
											Id = a.Id,
											Avatar = u.Avatar,
											CanAcceptTask = a.CanAcceptTask,
											CanCloseTask = a.CanCloseTask,
											CanReadBacklog = a.CanReadBacklog,
											CanReadBoard = a.CanReadBoard,
											CanTestTask = a.CanTestTask,
											CanWriteAccess = a.CanWriteAccess,
											CanWriteBoard = a.CanWriteBoard,
											CanWriteComment = a.CanWriteComment,
											CanWriteTask = a.CanWriteTask,
											CanWriteAllTasks = a.CanWriteAllTasks,
											CanСhangeBacklog = a.CanСhangeBacklog,
											CanСhangeBoard = a.CanСhangeBoard
										}
									)
									.OrderBy(a => a.User)
									.Skip((pageNumber - 1) * pageSize).Take(pageSize)
									.ToListAsync(),
					Page = pageNumber,
					TotalItems = totalItems,
					TotalPages = totalPages
				});
			}


			return Ok(new ResponsePagingViewModel<UserViewModel>
			{
				First = totalItems + 1,
				Items = await _applicationDbContext.UserBoardAccesses
					.Where((a) => a.BoardId == model.Id)
					.Join(_applicationDbContext.Users.DefaultIfEmpty(),
						a => a.UserId,
						u => u.Id,
						(a, u) => new UserViewModel
						{
							Avatar = u.Avatar,
							User = u.UserName
						}
					)
					.OrderBy(a => a.User)
					.Skip((pageNumber - 1) * pageSize).Take(pageSize)
					.ToListAsync(),
				Page = pageNumber,
				TotalItems = totalItems,
				TotalPages = totalPages
			});

		}


		[HttpPost]
		public async Task<IActionResult> GetUserAccessData(long id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var model = await _applicationDbContext.UserBoardAccesses
					.Where((a) => a.Id == id)
					.Join(_applicationDbContext.Users.DefaultIfEmpty(),
									a => a.UserId,
									u => u.Id,
									(a, u) => new UserBoardAccessViewModel
									{
										Avatar = u.Avatar,
										User = u.UserName,
										BoardId = a.BoardId,
										Id = a.Id,
										CanAcceptTask = a.CanAcceptTask,
										CanCloseTask = a.CanCloseTask,
										CanReadBacklog = a.CanReadBacklog,
										CanReadBoard = a.CanReadBoard,
										CanTestTask = a.CanTestTask,
										CanWriteAccess = a.CanWriteAccess,
										CanWriteBoard = a.CanWriteBoard,
										CanWriteComment = a.CanWriteComment,
										CanWriteTask = a.CanWriteTask,
										CanСhangeBacklog = a.CanСhangeBacklog,
										CanСhangeBoard = a.CanСhangeBoard
									}
								)
					.FirstOrDefaultAsync();
			if (model == null)
			{
				return NotFound();
			}
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where((a) => a.BoardId == model.BoardId && a.UserId == userId && a.CanWriteAccess == true)
					.FirstOrDefaultAsync();
			if (userBoardAccess == null)
			{
				return NotFound();
			}

			return Ok(model);
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> SetUserAccess([FromBody]UserBoardAccessViewModel model)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var data = await _applicationDbContext.UserBoardAccesses
				.Where((a) => a.Id == model.Id)
				.FirstOrDefaultAsync();
			if (data == null)
			{
				return NotFound();
			}
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
				.Where((a) => a.BoardId == model.BoardId && a.UserId == userId && a.CanWriteAccess == true)
				.FirstOrDefaultAsync();
			if (userBoardAccess == null)
			{
				return NotFound();
			}

			if (!model.CanReadBoard)
			{
				model.CanAcceptTask = false;
				model.CanCloseTask = false;
				model.CanReadBacklog = false;
				model.CanReadBoard = false;
				model.CanTestTask = false;
				model.CanWriteAccess = false;
				model.CanWriteBoard = false;
				model.CanWriteComment = false;
				model.CanWriteTask = false;
				model.CanСhangeBacklog = false;
				model.CanСhangeBoard = false;
				model.CanWriteAllTasks = false;
			}

			if (!model.CanСhangeBoard)
			{
				model.CanWriteTask = false;
				model.CanWriteAllTasks = false;
				model.CanTestTask = false;
				model.CanAcceptTask = false;
				model.CanCloseTask = false;
			}

			if (!model.CanWriteAccess && data.CanWriteAccess)
			{
				var countBacklog = await _applicationDbContext.UserBoardAccesses
						.Where((a) => a.BoardId == data.BoardId && a.CanWriteAccess == true).CountAsync();
				if (countBacklog < 2)
				{
					return Ok(new
					{
						Validation = new[] {
								new InvalidItem {
									Field = "",
									Message = "At one user should have permission to change permission"
								}
							}
					});
				}
			}

			var isodified = false;
			if (data.CanWriteAccess != model.CanWriteAccess)
			{
				data.CanWriteAccess = model.CanWriteAccess;
				isodified = true;
			}
			if (data.CanReadBacklog != model.CanReadBacklog)
			{
				data.CanReadBacklog = model.CanReadBacklog;
				isodified = true;
			}
			if (data.CanСhangeBacklog != model.CanСhangeBacklog)
			{
				data.CanСhangeBacklog = model.CanСhangeBacklog;
				isodified = true;
			}
			if (data.CanReadBoard != model.CanReadBoard)
			{
				data.CanReadBoard = model.CanReadBoard;
				isodified = true;
			}
			if (data.CanWriteBoard != model.CanWriteBoard)
			{
				data.CanWriteBoard = model.CanWriteBoard;
				isodified = true;
			}
			if (data.CanСhangeBoard != model.CanСhangeBoard)
			{
				data.CanСhangeBoard = model.CanСhangeBoard;
				isodified = true;
			}
			if (data.CanWriteComment != model.CanWriteComment)
			{
				data.CanWriteComment = model.CanWriteComment;
				isodified = true;
			}
			if (data.CanAcceptTask != model.CanAcceptTask)
			{
				data.CanAcceptTask = model.CanAcceptTask;
				isodified = true;
			}
			if (data.CanCloseTask != model.CanCloseTask)
			{
				data.CanCloseTask = model.CanCloseTask;
				isodified = true;
			}
			if (data.CanTestTask != model.CanTestTask)
			{
				data.CanTestTask = model.CanTestTask;
				isodified = true;
			}
			if (data.CanWriteTask != model.CanWriteTask)
			{
				data.CanWriteTask = model.CanWriteTask;
				isodified = true;
			}
			if (data.CanWriteAllTasks != model.CanWriteAllTasks)
			{
				data.CanWriteAllTasks = model.CanWriteAllTasks;
				isodified = true;
			}
			if (isodified)
			{
				_applicationDbContext.UserBoardAccesses.Update(data);
				await _applicationDbContext.SaveChangesAsync();
			}
			return Ok(new { });
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> UserInvite([FromBody]RequestUserInviteViewModel model)
		{

			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where(t => t.BoardId == model.boardId && t.UserId == userId && t.CanWriteBoard == true)
					.FirstOrDefaultAsync();

			if (userBoardAccess == null)
			{
				return NotFound();
			}
			model.email = model.email.ToUpper();
			var user = await _applicationDbContext.Users.FirstOrDefaultAsync(p => p.NormalizedEmail == model.email);
			if (user != null)
			{
				if (user.Id != userId)
				{
					var exists = await _applicationDbContext.UserBoardAccesses
						.Where(t => t.BoardId == model.boardId && t.UserId == user.Id)
						.FirstOrDefaultAsync();
					if (exists == null)
					{
						var newUser = new UserBoardAccess
						{
							BoardId = model.boardId,
							UserId = user.Id,
							CanWriteAccess = false,
							CanReadBoard = true,
							CanWriteComment = true,
							CanWriteBoard = false,
							CanСhangeBoard = false,
							CanReadBacklog = false,
							CanСhangeBacklog = false,
							CanWriteTask = false,
						};
						_applicationDbContext.UserBoardAccesses.Add(newUser);
						await _applicationDbContext.SaveChangesAsync();
						return Ok(new { });
					}
				}
				return Ok(new
				{
					Validation = new[] {
						new InvalidItem {
							Field = "",
							Message = "User already exist"
						}
					}
				});
			}
			return Ok(new
			{
				Validation = new[] {
						new InvalidItem {
							Field = "",
							Message = "Not find user"
						}
					}
			});
		}


		[HttpPost]
		public async Task<IActionResult> SetBoardDisplaySettings([FromBody]RequesBoardDisplaySettingsViewModel model)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userBoardAccess = await _applicationDbContext.UserBoardAccesses
					.Where(t => t.BoardId == model.Id && t.UserId == userId)
					.FirstOrDefaultAsync();
			if (userBoardAccess == null)
			{
				return NotFound();
			}
			var isModified = false;
			if (userBoardAccess.OnlyEditableSection != model.OnlyEditableSection)
			{
				userBoardAccess.OnlyEditableSection = model.OnlyEditableSection;
				isModified = true;
			}
			if (userBoardAccess.OnlyMineTasks != model.OnlyMineTasks)
			{
				userBoardAccess.OnlyMineTasks = model.OnlyMineTasks;
				isModified = true;
			}
			if (isModified)
			{

				_applicationDbContext.UserBoardAccesses.Update(userBoardAccess);
				await _applicationDbContext.SaveChangesAsync();
			}
			return Ok(new { });
		}
	}
}