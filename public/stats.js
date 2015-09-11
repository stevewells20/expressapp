// var PouchDB = '/pouchdb-4.0.1.min.js';
// PouchDB.plugin('/pouchdb-upsert.min.js');
var Percentage;
//establish remote db
var remoteDB = new PouchDB(
	'http://stevewells20.ddns.net:5984/perc_db', 
	function(err){
		if (err) {console.log('db: \n\t' + err);}	
});

// //establish local db
var localDB = new PouchDB(
	'perc_local', 
	function(err){
		if (err) {console.log('db: \n\t' + err);}	
});


// Helper function for upsert plugin (incrememnts the _rev)
function myDeltaFunction(doc) {
	doc.counter = doc.counter || 0;
	doc.counter++;
	return doc;
}

function show(obj){
	return JSON.stringify(obj,null,4);
}


// Set live sync between dbs
localDB.sync(remoteDB, {
  live: true,
  retry: true, //Keep retrying until connection reestablished
}).on('change', function (change) {
	console.log('Change occurred, N-SYNC is harmonizing:\n\t'+show(change));
	localDB.allDocs({
		include_docs: true,
	}).then(function (result) {
		Data = result;
		console.log(result);
	}).then(function (result) {
		// for (var el of Data.rows) {
		// 	console.log('el.doc.percentage = '+el.doc.percentage);
		// 	Percentage += el.doc.percentage;
		// };
		// console.log('Percentage before div'+Percentage);
		// console.log('Data.total_rows = '+Data.total_rows);
		// Percentage = Percentage / Data.total_rows;
		// console.log('Percentage after div'+Percentage);
		// return Percentage;

	});

}).on('complete', function (info) {
	console.log('N-SYNC is complete:\n\t'+show(info));
}).on('denied', function (info) {	
	console.log('N-SYNC was denied, didn\'t have permission:\n\t'+show(info))
}).on('paused', function (info) {
	console.log('N-SYNC paused, which is often due to lost connection:\n\t'+show(info));
}).on('active', function (info) {
	console.log('N-SYNC active ;):\n\t'+show(info));
}).on('error', function (err) {
	console.log('!!!N-SYNC error: \n\t'+show(err));
});

var Data = {};