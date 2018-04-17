

db.movies.aggregate([
	{
		$match: {
			"countries": "USA",
			"tomatoes.viewer.rating": {$gte: 3},
			"cast": {$in: ["Sandra Bullock", "Tom Hanks", "Julia Roberts", "Kevin Spacey", "George Clooney"]}
		}
	},
	{
		$project: {
			"_id": 0,
			"title": 1,
			"countries": 1,
			"cast": 1,
			"num_fav": {$size: { $filter: {"input": "$cast", "as": "item", "cond": {$in: ["$$item", "Sandra Bullock", "Tom Hanks", "Julia Roberts", "Kevin Spacey", "George Clooney"] } } }}
		}
	},
	{
		$sort: {"tomatoes.viewer.rating": -1, "title": -1}
	},
	{
		$count: "resultado"
	}
]).pretty();