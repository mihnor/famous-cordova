if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
	
	function Acelerometer(normalizeFactor) {

		this.normalizeFactor = normalizeFactor || 1;

    this.tiltLR = []; //gamma is the left-to-right tilt in degrees, where right is positive
		this.tiltFB = []; // beta is the front-to-back tilt in degrees, where front is positive
		this.dir = []; // alpha is the compass direction the device is facing in degrees

		this.accelerationX = [];
		this.accelerationY = [];
		this.accelerationZ = [];

		this.setAcelerometerData = function(data, value) {
			if( this.hasOwnProperty(data) ) {
				if( this[data].length < normalizeFactor ) {
					this[data].push(value);
				} else {
					this[data][this[data].length] = value;
				}
			}
		};

		this.getcelerometerData = function(data) {
			if( this.hasOwnProperty(data) ) {
				var total = 0;
				for(var i=0; i<this[data].length; i++) {
					total += this[data][i];
				}
				return total / this[data].length;
			}
			return 0;
		};

		this.handleDeviceOrientation = function(eventData) {
			this.setAcelerometerData('tiltLR', eventData.gamma);
    		this.setAcelerometerData('tiltFB', eventData.beta);
    		this.setAcelerometerData('dir', eventData.alpha);
		};

		this.handleDeviceMotion = function(eventData) {
			this.setAcelerometerData('accelerationX', eventData.accelerationIncludingGravity.x);  
			this.setAcelerometerData('accelerationY', eventData.accelerationIncludingGravity.y);  
			this.setAcelerometerData('accelerationZ', eventData.accelerationIncludingGravity.z);
		};

		window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this), false);
		window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
	}

	var acelerometer = new Acelerometer(10);

}