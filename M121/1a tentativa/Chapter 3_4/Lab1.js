Calcule o padrão de desvio ($stdDevSamp), a média, o valor mais alto e mais baixo do "imdb.rating"
*Utilizar o padrão de desvio de amostra

db.movies.aggregate([
	{
		$match: {
			$and: [
				{"awards": { $regex: /^Won */}},
				{"awards": { $regex: /Oscar */}},
			]
			
		}
	},
	{
		$group: {
			"_id": null,
			"highest_rating": {$max: "$imdb.rating"},
			"lowest_rating": {$min: "$imdb.rating"},
			"average_rating": {$avg: "$imdb.rating"},
			"deviation": {$stdDevSamp: "$imdb.rating"}
		}
	}
]).pretty();
