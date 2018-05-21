// ========= GROUP =========

db.movies.aggregate([
	{
		$group: {
			"_id": "$year",
			"num_movies": {$sum: 1}
		}
	},
	{
		$sort: {"_id": 1}
	}
]);

db.movies.aggregate([
	{
		$group: {
			"_id": {
				"numDirectors": {
					$cond: [{$isArray: "$directors"}, {$size: "$directors"}, 0]
				}
			},
			"numFilms": {$sum: 1},
			"averageMetacritic": {$avg: "$metacritic"}
		}
	},
	{
		$sort: {"_id.numDirectors": -1}
	}
])

db.movies.aggregate([
	{
		$match: { "metacritic": {$gte: 0} }
	},
	{
		$group: {
			"_id": {
				"numDirectors": {
					$cond: [{$isArray: "$directors"}, {$size: "$directors"}, 0]
				}
			},
			"numFilms": {$sum: 1},
			"averageMetacritic": {$avg: "$metacritic"}
		}
	},
	{
		$sort: {"_id.numDirectors": -1}
	}
])


// Calcula a média de "metacritic" para todos os documentos que não sejam null ou 0
db.movies.aggregate([
	{
		$match: { "metacritic": {$gte: 0} }
	},
	{
		$group: {
			"_id": null,
			"averageMetacritic": {$avg: "$metacritic"}
		}
	}
])

// Encontra o valor máximo do campo "avg_high_tmp" dentro de um array ("trends")
db.icecream_data.aggregate([
	{
		$project: {
			"_id": 0,
			"max_high": { $max: "$trends.avg_high_tmp" },
			"max_low": { $min: "$trends.avg_low_tmp" }
		}
		
	}
])

// Calculando a média do campo "icecream_cpi" e o "deviation" do campo "icecream_cpi"
db.icecream_data.aggregate([
	{
		$project: {
			"_id": 0,
			"average_cpi": { $avg: "$trends.icecream_cpi" },
			"deviation_cpi": { $stdDevPop: "$trends.icecream_cpi" }
		}
		
	}
])

//ACCUMULATORS EXPRESSIONS: $MAX, $MIN, $AVG, $SUM, $STDEVPOP, $STDEVSAM

// $unwind
/*
	Explicação: o $group by funciona baseado em igualdade pura e não por equivalência, o que quer dizer que:
	
	{
		"title": "Star Wars",
		"genres": ["Adventure", "Action"]
	}
	
	É DIFERENTE DE:
	{
		"title": "Star Wars",
		"genres": ["Action", "Adventure"]
	}
	
*/

// ========= UNWIND =========

db.movies.aggregate([
	{
		$match: {
			"imdb.rating": {$gt: 0},
			"year": {$gte: 2010, $lte: 2015},
			"runtime": {$gte: 90}
		}
	}, 
	{
		$unwind: "$genres"
	},
	{
		$group: {
			"_id": {
				"year": "$year",
				"genre": "$genres"
			},
			"average_rating": {$avg: "$imdb.rating"}
		}
	},
	{
		$sort: {
			"_id.year": -1, "average_rating": -1
		}
	}
])

// Retorna todos os gêneros por ano e as médias "imdb.rating"
db.movies.aggregate([
	{
		$match: {
			"imdb.rating": {$gt: 0},
			"year": {$gte: 2010, $lte: 2015},
			"runtime": {$gte: 90}
		}
	}, 
	{
		$unwind: "$genres"
	},
	{
		$group: {
			"_id": {
				"year": "$year",
				"genre": "$genres"
			},
			"average_rating": {$avg: "$imdb.rating"}
		}
	},
	{
		$sort: {
			"_id.year": -1, "average_rating": -1
		}
	}
])

// Retorna os filmes mais populares por ano (média mais alta do "imdb.rating")
db.movies.aggregate([
	{
		$match: {
			"imdb.rating": {$gt: 0},
			"year": {$gte: 2010, $lte: 2015},
			"runtime": {$gte: 90}
		}
	}, 
	{
		$unwind: "$genres"
	},
	{
		$group: {
			"_id": {
				"year": "$year",
				"genre": "$genres"
			},
			"average_rating": {$avg: "$imdb.rating"}
		}
	},
	{
		$sort: {
			"_id.year": -1, "average_rating": -1
		}
	},
	{
		$group: {
			"_id": "$_id.year",
			"genre": {$first: "$_id.genre"},
			"average_rating": {$first: "$average_rating"}
		}
	},
	{
		$sort: {"_id": -1}
	}
])

// ========= LOOKUP =========

 db.air_airlines.aggregate([
	{
		$lookup: {
			from: "air_alliances",
			localField: "name",
			foreignField: "airlines",
			as: "alliances"
		}
	}
 ])

  db.air_alliances.aggregate([
	{
		$lookup: {
			from: "air_airlines",
			localField: "airlines",
			foreignField: "name",
			as: "airlines"
		}
	}
 ]).pretty()
 
 
JOIN 1 PRA 1
Dado uma linha aérea (airline), quais são as suas rotas?

db.air_airlines.aggregate([
	{
		$match: {"name": "Air Berlin"}
	},
	{
		$lookup: {
			from: "air_routes",
			localField: "name",
			foreignField: "airline.name",
			as: "routes"
		}
	}
]).pretty()

Exemplo: 

db.orders.aggregate([
   {
      $lookup: {
         from: "items",
         localField: "item",    // field in the orders collection
         foreignField: "item",  // field in the items collection
         as: "meusItens"
      }
   }
 ]).pretty()

 {
        "_id" : 1,
        "item" : "almonds",
        "price" : 12,
        "quantity" : 2,
        "meusItens" : [
                {
                        "_id" : 1,
                        "item" : "almonds",
                        "description" : "almond clusters",
                        "instock" : 120
                }
        ]
}
{
        "_id" : 2,
        "item" : "pecans",
        "price" : 20,
        "quantity" : 1,
        "meusItens" : [
                {
                        "_id" : 3,
                        "item" : "pecans",
                        "description" : "candied pecans",
                        "instock" : 60
                }
        ]
}

// ========= GRAPHLOOKUP =========

 //Encontra todos os níveis abaixo que respondem para o Eliot
 db.parent_reference.aggregate([
	{
		$match: {"name": "Eliot"}
	},
	{
		$graphLookup: {
			from: "parent_reference",
			startWith: "$_id",
			connectFromField: "_id",
			connectToField: "reports_to",
			as: "all_reports"
		}
	}
 ]).pretty();
 
 db.parent_reference.aggregate([
	{
		$match: {"name": "Shannon"}
	},
	{
		$graphLookup: {
			from: "parent_reference",
			startWith: "$reports_to",
			connectFromField: "reports_to",
			connectToField: "_id",
			as: "bosses"
		}
	}
 ]).pretty();
 
 // ========= FACETS =========

