Question:

Determine the approach that satisfies the following question in the most efficient manner:

Find the list of all possible distinct destinations, with at most one layover, departing from the base airports of airlines that make part of the "OneWorld" alliance. The airlines should be national carriers from Germany, Spain or Canada only. Include both the destination and which airline services that location. As a small hint, you should find 158 destinations.


db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" }
  },
  {
    $graphLookup: {
      from: "air_airlines", // target collection (join)
	  startWith: "$airlines",
      connectFromField: "name", //match value with connectToField
      connectToField: "name", // match value with connectFromField
      as: "airlines",
      maxDepth: 0,
      restrictSearchWithMatch: {
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      from: "air_routes",
      startWith: "$airlines.base",
	  connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1
    }
  },
  { $unwind: "$connections" },
  {
    $project: {
      isValid: {
        $in: ["$connections.airline.name", "$validAirlines"]
      },
      "connections.dst_airport": 1
    }
  },
  { $match: { isValid: true } },
  {
    $group: {
      _id: "$connections.dst_airport"
    }
  }
])