Meteor.startup(function() {
	
	// number of channels
	var channel_max = 10; 
	audiochannels = new Array();
	// prepare the channels
	for (a=0;a<channel_max;a++) {
		audiochannels[a] = new Array();
		// create a new audio object
		audiochannels[a]['channel'] = new Audio();
		// expected end time for this channel
		audiochannels[a]['finished'] = -1;
	}
	function play_multi_sound(s) {
		for (a=0;a<audiochannels.length;a++) {
			thistime = new Date();
			// is this channel finished?
			if (audiochannels[a]['finished'] < thistime.getTime()) {
				audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
				audiochannels[a]['channel'].src = document.getElementById(s).src;
				audiochannels[a]['channel'].load();
				audiochannels[a]['channel'].play();
				break;
			}
		}
	}

	$('textarea').keydown(function(event) {
		switch(event.keyCode) {
		case 13:
			play_multi_sound('return');
			break;
		case 32:
			play_multi_sound('space');
			break;
		case 16:
			play_multi_sound('shiftup');
			break;
		case 17:
			break;
		case 18:
			break;
		case 91:
			break;
		default:
			play_multi_sound('key');

		}
        console.log("clicou");
	});
	
	$('textarea').keyup(function(event) {
		if(event.keyCode == 16) {
			play_multi_sound('shiftdown');
		}
        console.log("clicou");
	});
	
	$("textarea").focus();

    console.log("passei por aqui");
	
});

