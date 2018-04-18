
db.shipwrecks.find({ "watlev": "always dry", {$and:[{"depth": 0}, {"depth": {$type: "number"}} ]} }).count()

{"sections": {$all: ["AG1", "MD1", "OA1"] }}

{"results": {$elemMatch: {"product": "abc", "score": 7} }}

-- Challenge
{"results": { $elemMatch: {$gte: 70, $lt: 80} } }


-- Final Exam 4
db.trips.find({ "tripduration": {$exists: true}, "tripduration": {$type: "null"} }).pretty()
db.trips.find({ $and: [ { "tripduration": { $type: "null" } }, { "tripduration": { $exists: true } } ] }).count()

--Final Exam 6
db.movies.find({ "cast": {$in: ["Jack Nicholson", "John Huston"]}, "viewerRating": {$gt: 7}, "mpaaRating": "R"  });