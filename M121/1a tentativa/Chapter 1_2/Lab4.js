
var favorites = ["Sandra Bullock", "Tom Hanks", "Julia Roberts", "Kevin Spacey", "George Clooney"];

db.movies.aggregate([
	{
		$match: {
			"countries": "USA",
			"tomatoes.viewer.rating": {$gte: 3},
			"cast": {$in: favorites}
		}
	},
	{
		$project: {
			"_id": 0,
			"title": 1,
			"countries": 1,
			"cast": 1,
			"num_favs": {
				$size: { $setIntersection: ["$cast", favorites] }
			}
		}
	},
	{
		$sort: {"num_favs":-1 , "tomatoes.viewer.rating": -1, "title": -1}
	}
]).pretty();

	