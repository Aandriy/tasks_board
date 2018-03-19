using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Filters;
using App.Models;
using App.ViewModels;
using App.ViewModels.Common;
using App.ViewModels.Component;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Controllers
{
	[Authorize]
	public class CommentController : Controller
	{
		private readonly ApplicationDbContext _applicationDbContext;
		public CommentController(
			ApplicationDbContext applicationDbContext)
		{
			_applicationDbContext = applicationDbContext;
		}
		[HttpPost]
		public async Task<IActionResult> GetCommentList([FromBody]CommentsRequestViewModel model)
		{
			int pageSize = 10;
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			long id = model.Id;
			Goal goal = await _applicationDbContext.Goals
					.Where((t) => t.GoalId == id).FirstOrDefaultAsync();
			if (goal == null)
			{
				return NotFound();
			}

			UserBoardAccess access = await _applicationDbContext
				.UserBoardAccesses
				.Where((t) => t.BoardId == goal.BoardId && t.UserId == userId && t.CanReadBoard == true)
				.FirstOrDefaultAsync();
			if (access == null)
			{
				return NotFound();
			}

			var totalItems = await _applicationDbContext.Comments.Where(t => t.GoalId == id).CountAsync();
			var totalPages = (int)Math.Ceiling((double)totalItems / (double)pageSize);
			var pageNumber = model.Page;
			if (totalPages == 0)
			{
				totalPages = 1;
			}

			if (pageNumber > totalPages)
			{
				pageNumber = totalPages;
			}
			var start = (pageNumber - 1) * pageSize;

			var comments = await _applicationDbContext.Comments
					.Where(t => t.GoalId == id)
					.Include(t => t.Owner)
					.OrderByDescending(t => t.DateOfCreation)
					.Skip(start).Take(pageSize)
					.Select(t => new CommentResponseViewModel
					{
						Avatar = t.Owner.Avatar,
						Body = t.Body,
						CommentId = t.CommentId,
						DateOfModify = t.DateOfModify,
						UserName = t.Owner.UserName
					}).ToListAsync();


			var result = new ResponsePagingViewModel<CommentResponseViewModel>
			{

				First = totalItems - start - comments.Count() + 1,
				Items = comments,
				Page = pageNumber,
				TotalItems = totalItems,
				TotalPages = totalPages
			};

			return Ok(result);
		}


		[HttpPost]
		[ModelStateValidation]
		public async Task<IActionResult> Manage([FromBody]Comment model)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			DateTime date = DateTime.UtcNow;
			model.DateOfModify = date;
			var task = await _applicationDbContext.Goals.Where((t) => t.GoalId == model.GoalId).FirstOrDefaultAsync();
			if (task == null)
			{
				return NotFound();
			}

			var access = await _applicationDbContext.UserBoardAccesses.Where((t) => t.BoardId == task.BoardId && t.UserId == userId && t.CanWriteComment == true).FirstOrDefaultAsync();
			if (access == null)
			{
				return NotFound();
			}

			if (model.CommentId == 0)
			{
				model.DateOfCreation = date;
				model.OwnerId = userId;
				_applicationDbContext.Comments.Add(model);
				await _applicationDbContext.SaveChangesAsync();
			}
			else
			{
				var current = await _applicationDbContext.Comments.Where((t) => t.CommentId == model.CommentId).FirstOrDefaultAsync();
				if (current == null)
				{
					return NotFound();
				}
				model.DateOfCreation = current.DateOfCreation;
				model.OwnerId = current.OwnerId;

				_applicationDbContext.Entry(current).State = EntityState.Detached;
				current = null;

				_applicationDbContext.Comments.Update(model);
				await _applicationDbContext.SaveChangesAsync();
			}
			return Ok(new { Id = model.CommentId });
		}

	}
}