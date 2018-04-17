

db.movies.aggregate([ 
	{
		$project: {
			"_id": 0,
			"title_splitted": { $size: {$split : [ "$title", " "]}}
		}
	},
	{
		$match: {
			"title_splitted": {$eq: 1}
		}
	}
]).itcount();
