export default function (totalPages, currentPage, end) {
	if (!currentPage) {
		currentPage = 1;
	}
	if (typeof (end) !== "number") {
		if (typeof (end) === "function") {
			end = end(currentPage, totalPages);
		} else {
			end = (currentPage < 100 ? 9 : (currentPage < 10000 ? 7 : 5));
		}
	}
	var total = totalPages || 1,
		pagination = [],
		start = 1,
		item,
		max = (total - currentPage),
		de = 0,
		shift = Math.floor(end / 2),
		ds = 0;

	if (!currentPage) {
		currentPage = 1;
	}

	if (total > end) {
		if (max < shift) {
			de = shift - max;
		}
		max = currentPage - 1;
		if (max < 0) {
			max = 0;
		}
		if (max < shift) {
			ds = shift - max;
		}
		start = currentPage - de - shift;
		if (start < 1) {
			start = 1;
		}
		end = currentPage + ds + shift;
		if (end > total) {
			end = total;
		}
	} else {
		end = total;
	}

	while (1) {
		if (start > end) {
			break;
		}
		pagination.push({
			page: start,
			link: true,
			isActive: currentPage === start
		});
		start++;
	}

	if (end !== total) {
		item = pagination[pagination.length - 1];
		if (item && item.page !== currentPage) {
			pagination[pagination.length - 1] = {
				page: total,
				link: true,
				isActive: currentPage === total
			};
			item = pagination[pagination.length - 2];
			if (item && item.page !== currentPage) {
				if (item && item.page !== currentPage) {
					pagination[pagination.length - 2] = {
						page: '...',
						link: false,
						isActive: false
					};
				}
			}
		}
	}
	item = pagination[0];
	if (item && item.page !== 1) {
		pagination[0] = {
			page: 1,
			link: true,
			isActive: false
		};
		item = pagination[1];
		if (item && item.page !== currentPage && item.page !== 2) {
			pagination[1] = {
				page: '...',
				link: false,
				isActive: false
			};
		}
	}
	return pagination;
};

