using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace App.Filters
{
	public class CustomErrorFilter : ExceptionFilterAttribute
	{
		private bool _isDebug;

		public CustomErrorFilter(bool isDebug)
		{
			_isDebug = isDebug;
		}

		public override void OnException(ExceptionContext context)
		{
			if (_isDebug)
			{
				context.Result = new BadRequestObjectResult(context.Exception.ToString());
			}
			else
			{
				context.Result = new BadRequestResult();
			}
		}
	}
}
