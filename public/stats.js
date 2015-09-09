// var PouchDB = '/pouchdb-4.0.1.min.js';
// PouchDB.plugin('/pouchdb-upsert.min.js');

//establish remote db
var remoteDB = PouchDB(
	'http://stevewells20.ddns.net:5984/perc_db', 
	function(err){
		if (err) {console.log('db: \n\t' + err);}	
});

// //establish local db
// var localDB = new PouchDB(
// 	'mylocaldb', 
// 	function(err){
// 		if (err) {console.log('db: \n\t' + err);}	
// });

// Helper function for upsert plugin (incrememnts the _rev)
function myDeltaFunction(doc) {
	doc.counter = doc.counter || 0;
	doc.counter++;
	return doc;
}
//console.log(show(localDB.allDocs({include_docs: true})));
function averageDB(type){
	var total;
	var result = 0;	
	remoteDB.allDocs({include_docs: true}, function (err,res){
		if (err) {
			console.log("Error in obtaining localDB.allDocs:\n\t" +err);
		} else {
			console.log(show(res));
			total = res.total_rows;
			res.rows.forEach( function (entry) {
            	result += entry.doc[type];
            	//console.log((entry.doc[type]));
         	})
        }
    })
    //console.log(result);
	result = result / total;
	return result;
}

// Set live sync between dbs
	// localDB.sync(remoteDB, {
	//   live: true,
	//   retry: true, //Keep retrying until connection reestablished
	// }).on('change', function (change) {
	// 	console.log('Change occurred, N-SYNC is harmonizing:\n\t'+show(change));
	// }).on('complete', function (info) {
	// 	console.log('N-SYNC is complete:\n\t'+show(info));
	// }).on('denied', function (info) {	
	// 	console.log('N-SYNC was denied, didn\'t have permission:\n\t'+show(info))
	// }).on('paused', function (info) {
	// 	console.log('N-SYNC paused, often due to lost connection:\n\t'+show(info));
	// }).on('active', function (info) {
	// 	console.log('N-SYNC active ;):\n\t'+show(info));
	// }).on('error', function (err) {
	// 	console.log('!!!N-SYNC error: \n\t'+show(err));
	// });

function show(obj){
	return JSON.stringify(obj,null,4);
};

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

// localDB.put(doc).then(function () {
// 	console.log('Success! \n\t'+doc.name+' was N-SYNCed')
// }).catch(function (err) {
//   if (err.status === 409) {
//     // conflict!
//   } else {
//     // some other error
//   }
// });

// db.get('HOC', function(err, doc) { 
// 		if (err) {console.log('db.get: \n\t' + err);}
// 		else {console.log('db.get: \n\t' + show(doc,null,4));}
// });


// db.get('HOC', function(err, doc) { 
// 		if (err) {console.log('db.get: \n\t' + err);}
// 		else {console.log('db.get: \n\t' + doc);}}
// 	).then(function (doc) {
// 		return db.remove(doc);
// });





//db.sync('perc_db');