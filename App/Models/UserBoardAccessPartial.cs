using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace App.Models
{
	public class UserBoardAccessPartial
	{
		public bool CanWriteAccess { get; set; }
		public bool CanReadBacklog { get; set; }
		public bool CanСhangeBacklog { get; set; }
		public bool CanReadBoard { get; set; }
		public bool CanWriteBoard { get; set; }
		public bool CanСhangeBoard { get; set; }
		public bool CanWriteComment { get; set; }
		public bool CanAcceptTask { get; set; }
		public bool CanCloseTask { get; set; }
		public bool CanTestTask { get; set; }
		public bool CanWriteTask { get; set; }
		public bool CanWriteAllTasks { get; set; }
	}
}
