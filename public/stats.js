// var PouchDB = '/pouchdb-4.0.1.min.js';
// PouchDB.plugin('/pouchdb-upsert.min.js');

//establish remote db
var remoteDB = PouchDB(
	'http://stevewells20.ddns.net:5984/perc_db', 
	function(err){
		if (err) {console.log('db: \n\t' + err);}	
});

//establish local db
var localDB = new PouchDB(
	'mylocaldb', 
	function(err){
		if (err) {console.log('db: \n\t' + err);}	
});

// Helper function for upsert plugin (incrememnts the _rev)
function myDeltaFunction(doc) {
  doc.counter = doc.counter || 0;
  doc.counter++;
  return doc;
}

// Set live sync between dbs
localDB.sync(remoteDB, {
  live: true,
  retry: true, //Keep retrying until connection reestablished
}).on('change', function (change) {
	console.log('Change occurred, N-SYNC is harmonizing:\n\t'+change);
}).on('complete', function (info) {
	console.log('N-SYNC is complete:\n\t'+info);
}).on('denied', function (info) {	
	console.log('N-SYNC was denied, didn\'t have permission:\n\t'+info)
}).on('paused', function (info) {
	console.log('N-SYNC paused, often due to lost connection:\n\t'+info);
}).on('active', function (info) {
	console.log('N-SYNC active ;):\n\t'+info);
}).on('error', function (err) {
	console.log('!!!N-SYNC error: \n\t'+err);
});

// var doc = {
//   "_id": "mittens",
//   "name": "Mittens",
//   "occupation": "kitten",
//   "age": 3,
//   "hobbies": [
//     "playing with balls of yarn",
//     "chasing laser pointers",
//     "lookin' hella cute"
//   ]
// };


// localDB.upsert('my_id', myDeltaFunction).then(function () {
// 	console.log('Success! \n\t'+doc.name+' was N-SYNCed')
// }).catch(function (err) {
// 	if (err.status === 409) {
//     	console.log('Conflict in upsert: 409')}
// 	else {
// 		console.log('Some other error! \n\t'+err)
// 	}

// });

localDB.put(doc).then(function () {
	console.log('Success! \n\t'+doc.name+' was N-SYNCed')
}).catch(function (err) {
  if (err.status === 409) {
    // conflict!
  } else {
    // some other error
  }
});

// db.get('HOC', function(err, doc) { 
// 		if (err) {console.log('db.get: \n\t' + err);}
// 		else {console.log('db.get: \n\t' + JSON.stringify(doc,null,4));}
// });


// db.get('HOC', function(err, doc) { 
// 		if (err) {console.log('db.get: \n\t' + err);}
// 		else {console.log('db.get: \n\t' + doc);}}
// 	).then(function (doc) {
// 		return db.remove(doc);
// });





//db.sync('perc_db');