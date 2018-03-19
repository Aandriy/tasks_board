using App.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace App.Filters
{
	public class ModelStateValidationAttribute : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext context)
		{
			if (!context.ModelState.IsValid)
			{
				var errors = ValidationHelper.GetErrorsList(context.ModelState);
				context.Result = new OkObjectResult(new
				{
					Validation = errors
				});
			}
		}
	}
}
