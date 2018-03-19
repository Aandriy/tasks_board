using App.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App.Helpers
{
	public class ValidationHelper
	{
		public static List<InvalidItem> GetErrorsList(ModelStateDictionary modelState)
		{
			var errors = modelState.Select(x => x)
					.Where(y => y.Value.Errors.Count > 0)
					.SelectMany(p => p.Value.Errors.Select(t => new InvalidItem
					{
						Field = StrHelper.ToCamelCase(p.Key),
						Message = t.ErrorMessage
					}))
					.ToList();
			return errors;
		}
		private bool IsDebug()
		{
			#if DEBUG
			return true;
			#else
				return false;
			#endif
		}
	}
}
