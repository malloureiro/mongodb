db.movieScratch.updateOne(
	{"title":"Rocky"},
	{
		$pop: {
			"reviews": -1
		}
	}
);
