using System;
using System.Collections.Generic;
using System.Linq;
using App.Models;
using App.ViewModels.Goal;

namespace App.Helpers.Converters
{
	public class GoalConverter
	{
		public static PreviewGoalViewModel ConvertToPreviewGoalViewModel(Goal goal, bool isAllEditable, bool isEditable, string userId)
		{
			PreviewGoalViewModel model = new PreviewGoalViewModel
			{
				BoardId = goal.BoardId,
				Closed = goal.Closed,
				CreateBy = goal.CreateBy.UserName,
				DateOfCreation = goal.DateOfCreation,
				DateOfModify = goal.DateOfModify,
				Purpose = goal.Purpose,
				GoalId = goal.GoalId,
				ModifyBy = goal.ModifyBy.UserName,
				Owner = goal.Owner.FullName,
				OwnerImg = goal.Owner.Avatar,
				Priority = goal.Priority,
				Setting = goal.Setting,
				Status = goal.Status,
				TimeBound = goal.TimeBound,
				Title = goal.Title,
				CountComments = goal.Comments.Count,
				IsEditable = (isAllEditable || (isEditable && goal.CreateById == userId))
			};
			return model;
		}

		public static List<PreviewGoalViewModel> ConvertToPreviewGoalViewModelList(List<Goal> goals, bool isAllEditable, bool isEditable, string userId) {
			return goals.Select(goal =>
				ConvertToPreviewGoalViewModel(goal, isAllEditable, isEditable, userId)
			).ToList();
		}
	}
}
