/*
 * this is all global objects and funcs, not good. Need to clean up for sure!!!!!
 */

/*
 * IDEAS
 * 
 * Create a separate service for Ajax
 * 
 * Create a separate Object to handle the Ajax calls and responses
 */


// Userlist data array for filling in info box
var messagesData = {};

// Dom Ready =================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable();
		    
	// Message link click
    $('#messageList table tbody').on('click', 'td a.linkshowmessage', showMessageInfo);
    
	// Delete Message link click
    $('#messageList table tbody').on('click', 'td a.linkdeletemessage', deleteMessage);
    
    // Listen to the add message button click
	$('#btnAddMessage').on('click', addMessage);

});

// Functions ==============
// Fill table with data
function populateTable() {
	// Empty content string 
	var tableContent = '';
	// jQuery AJAX call for JSON
	$.getJSON('/users/messagelist', function( data ) {
		// For each item in our JSON, add a table row and cells to the contentstring
		$.each(data, function() {
			// Considering we have a small amount of data for this simple app lets store the data locally
			messagesData[this._id] = this;
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowmessage" rel="' + this._id + '">' + this.message + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeletemessage" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
		});
		
		// Inject the whole content string into our existing HTML table
        $('#messageList table tbody').html(tableContent);
	});
	
};

function _isAPalindrome(message) {
	return message == message.split('').reverse().join('');
};

// Show User Info
function showMessageInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get our User Object
    var thisMessageObject = messagesData[thisId];

    //Populate Info Box
    $('#messageContents').text(thisMessageObject.message);
    var isAPalindrome = _isAPalindrome(thisMessageObject.message) ? 'YES' : 'NO';
    $('#messageIsAPalindrome').text(isAPalindrome);
};

function _buildAjaxParamsForDeleteMessageCall(_id) {
	return {
        type: 'DELETE',
        url: '/users/deletemessage/' + _id
   };
};

function _handleAjaxResponseForDeleteMessage(response) {
	            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
};

// Delete User Info
function deleteMessage(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this message?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax(_buildAjaxParamsForDeleteMessageCall($(this).attr('rel'))).done(function( response ) {
			_handleAjaxResponseForDeleteMessage(response);
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};


function _isFormInputValid() {
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addMessage input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
	return errorCount === 0;	
};

function _getNewMessageObject() {
    return {
        'message': $('#addMessage fieldset input#inputMessage').val()
    };
		
};

function _handleAjaxResponseForAddMessage(response) {
    // Check for successful (blank) response
    if (response.msg === '') {

        // Clear the form inputs
        $('#addMessage fieldset input').val('');

        // Update the table
        populateTable();

    }
    else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

    }

};

function _buildAjaxParamsForAddMessageCall(newMessage) {
	return {
            type: 'POST',
            data: newMessage,
            url: '/users/addmessage',
            dataType: 'JSON'
       };
};

// Add Message
function addMessage(event) {
    event.preventDefault();

    // Check and make sure errorCount's still at zero
    if(_isFormInputValid()) {

		var newMessage = _getNewMessageObject();
        // Use AJAX to post the object to our adduser service
        $.ajax(_buildAjaxParamsForAddMessageCall(newMessage)).done(function( response ) {
			_handleAjaxResponseForAddMessage(response);
        });
    }
    else {
        // Form Fields filled out incorrectly
        alert('Please fill in all fields');
        return false;
    }
};
