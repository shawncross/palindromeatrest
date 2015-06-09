var express = require('express');
var router = express.Router();


/**
 * Get our message List. 
 * 
 * Note, again, this is a simple app
 * so we aren't going to implement paging or anything. We'll 
 * assume the number of messages are small and just grab all 
 * of them. Certainly an enhancement we can make later.
 */

router.get('/messagelist', function(req, res) {
	// We've appended our db to our request so lets grab it
	var db = req.db;
	/*
	 * hmmm, probably need to initialize the table, no?
	 */
	var messages = db.get('messagelist');
	messages.find({}, {}, function(e, docs) {
		// Got all the messages, lets add them to the response.
		res.json(docs);
	});
});

/*
 * POST to addmessage.
 */
router.post('/addmessage', function(req, res) {
    var db = req.db;
    var messages = db.get('messagelist');
    messages.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deletemessage.
 */
router.delete('/deletemessage/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('messagelist');
    var messageToDelete = req.params.id;
    collection.remove({ '_id' : messageToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
