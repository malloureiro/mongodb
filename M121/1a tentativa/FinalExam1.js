// ======= EXERCISE 1 =======

db.coll.aggregate([
  {"$match": {"field_a": {"$gt": 1983}}}, -> OK
  {"$project": { "field_a": "$field_a.1", "field_b": 1, "field_c": 1  }}, -> OK
  {"$replaceRoot":{"newRoot": {"_id": "$field_c", "field_b": "$field_b"}}}, -> NOK
  {"$out": "coll2"}, -> LAST STAGE IN THE PIPELINE
  {"$match": {"_id.field_f": {"$gt": 1}}}, -> nok
  {"$replaceRoot":{"newRoot": {"_id": "$field_b", "field_c": "$_id"}}} -> nok
])


db.coll.aggregate([
  {"$match": {"field_a": {"$gt": 111}}}, -> OK
  {"$geoNear": { -> ERRADO, SÓ PODE SER USADO NO PRIMEIRO STAGE DO PIPELINE
    "near": { "type": "Point", "coordinates": [ -73.99279 , 40.719296 ] },
    "distanceField": "distance"}},
  {"$project": { "distance": "$distance", "name": 1, "_id": 0  }} -> OK
])


db.coll.aggregate([
  {
    "$facet": {
      "averageCount": [
        {"$unwind": "$array_field"},
        {"$group": {"_id": "$array_field", "count": {"$sum": 1}}}
      ],
      "categorized": [{"$sortByCount": "$arrayField"}]
    },
  },
  {
    "$facet": { -> precisa ser o primeiro stage do pipeline
      "new_shape": [{"$project": {"range": "$categorized._id"}}],
      "stats": [{"$match": {"range": 1}}, {"$indexStats": {}}] -> $indexStats não pode estar presente no $facet
    }
  }
])

// ======= EXERCISE 2 =======

Collection:

{
  "a": [1, 34, 13]
}

db.coll.aggregate([
  {"$match": { "a" : {"$sum": 1}  }}, -> $sum só pode ser usado no $group ou $project stages
  {"$project": { "_id" : {"$addToSet": "$a"}  }},
  {"$group": { "_id" : "", "max_a": {"$max": "$_id"}  }}
])

db.coll.aggregate([
    {"$project": { "a_divided" : {"$divide": ["$a", 1]}  }}
])

db.coll.aggregate([
    {"$project": {"a": {"$max": "$a"}}},
    {"$group": {"_id": "$$ROOT._id", "all_as": {"$sum": "$a"}}}
])


// ======= EXERCISE 3 =======
db.people.insertMany([
{ "_id" : 0, "name" : "Bernice Pope", "age" : 69, "date" : ISODate("2017-10-04T18:35:44.011Z") },
{ "_id" : 1, "name" : "Eric Malone", "age" : 57, "date" : ISODate("2017-10-04T18:35:44.014Z") },
{ "_id" : 2, "name" : "Blanche Miller", "age" : 35, "date" : ISODate("2017-10-04T18:35:44.015Z") },
{ "_id" : 3, "name" : "Sue Perez", "age" : 64, "date" : ISODate("2017-10-04T18:35:44.016Z") },
{ "_id" : 4, "name" : "Ryan White", "age" : 39, "date" : ISODate("2017-10-04T18:35:44.019Z") },
{ "_id" : 5, "name" : "Grace Payne", "age" : 56, "date" : ISODate("2017-10-04T18:35:44.020Z") },
{ "_id" : 6, "name" : "Jessie Yates", "age" : 53, "date" : ISODate("2017-10-04T18:35:44.020Z") },
{ "_id" : 7, "name" : "Herbert Mason", "age" : 37, "date" : ISODate("2017-10-04T18:35:44.020Z") },
{ "_id" : 8, "name" : "Jesse Jordan", "age" : 47, "date" : ISODate("2017-10-04T18:35:44.020Z") },
{ "_id" : 9, "name" : "Hulda Fuller", "age" : 25, "date" : ISODate("2017-10-04T18:35:44.020Z") }
])

 db.people.aggregate(
 [{
    "$project": {
      "surname_capital": { "$substr": [{"$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]}, 0, 1 ] },
      "name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]},
      "name": 1
    }
  },
  {
    "$group": {
      "_id": "$name_size",
      "word": { "$push": "$surname_capital" },
      "names": {"$push": "$name"}
    }
  },
  {
    "$project": {
      "word": {
        "$reduce": {
          "input": "$word",
          "initialValue": "",
          "in": { "$concat": ["$$value", "$$this"] }
        }
      },
      "names": 1
    }
  },
  {
    "$sort": { "_id": 1}
  }
]
 ).pretty()
 
 // ======= EXERCISE 4 =======
 - a $multiply expression takes a document as input, not an array. -> $multiply evaluates an array with values
 - $sortByCount cannot be used within $facet stage. -> pode ser usado sim
 - a $type expression does not take a string as its value; only the BSON numeric values can be specified to identify the types. -> false
 
 
 // ======= EXERCISE 6 =======
 db.people2.insertMany([
	{ "_id" : 0, "name" : "Iva Estrada", "age" : 95, "state" : "WA", "phone" : "(739) 557-2576", "ssn" : "901-34-4492" },
	{ "_id" : 1, "name" : "Roger Walton", "age" : 92, "state" : "ID", "phone" : "(948) 527-2370", "ssn" : "498-61-9106" },
	{ "_id" : 2, "name" : "Isaiah Norton", "age" : 26, "state" : "FL", "phone" : "(344) 479-5646", "ssn" : "052-49-6049" },
	{ "_id" : 3, "name" : "Tillie Salazar", "age" : 88, "state" : "ND", "phone" : "(216) 414-5981", "ssn" : "708-26-3486" },
	{ "_id" : 4, "name" : "Cecelia Wells", "age" : 16, "state" : "SD", "phone" : "(669) 809-9128", "ssn" : "977-00-7372" }
 ])