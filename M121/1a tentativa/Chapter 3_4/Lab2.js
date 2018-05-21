db.movies.aggregate([
	{
		$match: {
			"languages": {$in: ["English"]}
		}
	},
	{
		$unwind: "$cast"
	},
	{
		$group: {
			"_id": "$cast",
			"numFilms": {$sum: 1},
			"average": {$avg: "$imdb.rating"}
		}
	},
	{
		$sort: {"numFilms": -1}
	}
]).pretty();

//{ "_id" : "John Wayne", "numFilms" : 107, "average" : 6.4 }

db.movies.aggregate([
  {
    $match: {
      languages: "English"
    }
  },
  {
    $project: { _id: 0, cast: 1, "imdb.rating": 1 }
  },
  {
    $unwind: "$cast"
  },
  {
    $group: {
      _id: "$cast",
      numFilms: { $sum: 1 },
      average: { $avg: "$imdb.rating" }
    }
  },
  {
    $project: {
      numFilms: 1,
      average: {
        $divide: [{ $trunc: { $multiply: ["$average", 10] } }, 10]
      }
    }
  },
  {
    $sort: { numFilms: -1 }
  },
  {
    $limit: 1
  }
])