
/* -----------------------------------------------------
Client: Feref
Client's Website: http://www.feref.com
--------------------------------------------------------
Developer: Carl Johnston
Developer's Email: carl@carljohnston.co.uk
Developer's Website: http://www.carljohnston.co.uk
Developer's Github: https://github.com/carljohnstonuk
----------------------------------------------------- */

(function() {

	// hasClass helper
	var hasClass = function(el, cls) {
		return el.classList.contains(cls);
	};

	// Element position helper
	function getPosition(el) {
		var xPos = 0;
		var yPos = 0;
		while (el) {
			if (el.tagName == "BODY") {
				// deal with browser quirks with body/window/document and page scroll
				var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
				xPos += (el.offsetLeft - xScroll + el.clientLeft);
			} else {
				// for all other non-BODY elements
				xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			}
			el = el.offsetParent;
		}
		return xPos;
	}

	var player = {
		render: function() {
				
			// Global elements
			var playerElement = document.getElementsByTagName('j-video');

			// jVideo attributes
			var vidId = playerElement[i].getAttribute('video-id');
			var src = playerElement[i].getAttribute('video-src');
			var type1 = playerElement[i].getAttribute('video-type-1');
			var type2 = playerElement[i].getAttribute('video-type-2');
			var autoplay = playerElement[i].getAttribute('video-autoplay');
			var videoMute = playerElement[i].getAttribute('video-muted');
			var loop = playerElement[i].getAttribute('video-loop');
			var color = playerElement[i].getAttribute('color');
			var poster = playerElement[i].getAttribute('poster');
			var controls = playerElement[i].getAttribute('video-controls');

			// Inject Video HTML and Controls
			playerElement[i].innerHTML =
				'<div class="poster" id="poster-' + i + '"></div>' +
				'<div class="click-play" id="click-play-' + i + '"></div>' +
				'<video id=' + vidId + '>' +
					'<source src="' + src + '.' + type1 + '" type="video/' + type1 + '">' +
					'<source src="' + src + '.' + type2 + '" type="video/' + type2 + '">' +
				'</video>' +
				'<ul class="controls" id="controls-' + i + '">' +
					'<li class="play-pause" id="play-pause-' + i + '">' +
						'<img src="img/j-video/control_play.svg" />' +
					'</li>' +
					'<li class="progress-click" id="pbar-click-' + i + '">' +
						'<div class="progress-container" id="pbar-container-' + i + '">' +
							'<div class="progress" id="pbar-' + i + '"></div>' +
						'</div>' +
					'</li>' +
					'<li class="expand native" id="fullscreen-' + i + '">' +
						'<img src="img/j-video/control_fullscreen.svg" />' +
					'</li>' +
					'<li class="mute-unmute" id="mute-unmute-' + i + '">' +
						'<img src="img/j-video/control_volume_high.svg" />' +
					'</li>' +
				'</ul>'
			;

			// Video elements
			var videoElement = document.getElementById(vidId);
			var playPauseControl = document.getElementById('play-pause-' + i);
			var clickPlay = document.getElementById('click-play-' + i);
			var muteUnmuteControl = document.getElementById('mute-unmute-' + i);
			var fullscreenControl = document.getElementById('fullscreen-' + i);
			var videoStill = document.getElementById('poster-' + i);
			var controlVideo = document.getElementById('controls-' + i);
			var pBarClick = document.getElementById('pbar-click-' + i);
			var pBarContainer = document.getElementById('pbar-container-' + i);
			var pBar = document.getElementById('pbar-' + i);
			var update;

			// Global fullscreen functions
			function exitFullscreenListener() {
				document.addEventListener('fullscreenchange', exitFullscreenVideo);
				document.addEventListener('webkitfullscreenchange', exitFullscreenVideo);
				document.addEventListener('mozfullscreenchange', exitFullscreenVideo);
				document.addEventListener('MSFullscreenChange', msExitFullscreenVideo);

				function msExitFullscreenVideo() {
					videoElement.removeAttribute('controls');
					exitFullscreenVideo();
				}

				function exitFullscreenVideo() {
					controlVideo.style.zIndex = 999999;
					controlVideo.classList.remove('fullscreen');
					controlVideo.parentElement.removeAttribute('style');
					fullscreenControl.className = "expand native";
					fullscreenControl.innerHTML = '<img src="img/j-video/control_fullscreen.svg" />';
				}
			}

			// Request fullscreen
			function fullscreenFunction(el) {
				function enterFullscreenListener() {
					document.addEventListener('fullscreenchange', codeBlock);
					document.addEventListener('webkitfullscreenchange', codeBlock);
					document.addEventListener('mozfullscreenchange', codeBlock);
					document.addEventListener('MSFullscreenChange', msCodeBlock);

					function msCodeBlock() {
						videoElement.setAttribute('controls');
						codeBlock();
					}

					function codeBlock() {
						controlVideo.classList.add('fullscreen');
						controlVideo.style.zIndex = 2147483647;
						controlVideo.parentElement.style.width = 'initial';
						controlVideo.parentElement.style.maxWidth = 'initial';
						controlVideo.parentElement.style.margin = 'initial';
						fullscreenControl.className = "expand fullscreen";
						fullscreenControl.innerHTML = '<img src="img/j-video/control_fullscreen_exit.svg" />';
						exitFullscreenListener()
					}
				}

				if ( el.requestFullscreen ) {
					enterFullscreenListener();
					el.requestFullscreen();
				}
				else if ( el.msRequestFullscreen ) {
					enterFullscreenListener();
					el.msRequestFullscreen();
				}
				else if ( el.mozRequestFullScreen ) {
					enterFullscreenListener();
					el.mozRequestFullScreen();
				}
				else if ( el.webkitRequestFullscreen ) {
					enterFullscreenListener();
					el.webkitRequestFullscreen();
				}
			}

			// Exit fullscreen
			function exitFullscreenFunction() {

				if ( document.exitFullscreen ) {
					exitFullscreenListener();
					document.exitFullscreen();
				}
				else if ( document.webkitExitFullscreen) {
					exitFullscreenListener();
					document.webkitExitFullscreen();
				}
				else if ( document.mozCancelFullScreen ) {
					exitFullscreenListener();
					document.mozCancelFullScreen();
				}
				else if ( document.msExitFullscreen ) {
					exitFullscreenListener();
					document.msExitFullscreen();
				}
			}

			// Progress Bar
			function videoProgress() {
				var percentage = (videoElement.currentTime / videoElement.duration) * 100;
				
				pBar.style.width = percentage + '%';
				pBar.style.background = color;
			}

			// Skip Video
			pBarClick.addEventListener('click', function(ev) {
				var videoPosition = getPosition(videoElement);
				var mouseX = ev.pageX - (videoPosition + pBarClick.offsetLeft);
				var width = window.getComputedStyle(pBarClick).getPropertyValue('width');
				width = parseFloat(width.substr(0, width.length - 2));

				videoElement.currentTime = (mouseX / width) * videoElement.duration;
			});

			// AutoPlay
			switch(autoplay) {
				case "true":
					videoElement.play();
					playPauseControl.className = 'play-pause playing';
					playPauseControl.innerHTML = '<img src="img/j-video/control_pause.svg" />';
					videoStill.style.opacity = 0;
					update = setInterval(videoProgress, 30);
					break;

				default:
					playPauseControl.className = 'play-pause paused';
					playPauseControl.innerHTML = '<img src="img/j-video/control_play.svg" />';
					videoStill.style.opacity = 1;
					window.clearInterval(update);
					break;
			};

			// Loop video
			switch(loop) {
				case "true":
					videoElement.loop = true;
					break;

				default:
					videoElement.loop = false;
					break;
			}

			// AutoMute
			switch(videoMute) {
				case "true":
					videoElement.muted = true;
					muteUnmuteControl.className = 'mute-unmute muted';
					muteUnmuteControl.innerHTML = '<img src="img/j-video/control_volume_mute.svg" />';
					break;

				default:
					videoElement.muted = false;
					muteUnmuteControl.className = 'mute-unmute unmuted';
					muteUnmuteControl.innerHTML = '<img src="img/j-video/control_volume_high.svg" />';
					break;
			}

			// Play / pause function
			function playPause() {
				var cls = playPauseControl.className.split(" ")[1];

				switch(cls) {
					case 'playing':
						videoElement.pause();
						playPauseControl.className = 'play-pause paused';
						playPauseControl.innerHTML = '<img src="img/j-video/control_play.svg" />';
						window.clearInterval(update);
						break;

					case 'paused':
						videoElement.play();
						videoStill.style.opacity = 0;
						pBarContainer.style.opacity = 1;
						playPauseControl.className = 'play-pause playing';
						playPauseControl.innerHTML = '<img src="img/j-video/control_pause.svg" />';
						update = setInterval(videoProgress, 30);
						break;
				}
			}
			playPauseControl.addEventListener('click', playPause);
			clickPlay.addEventListener('click', playPause);

			// Replay
			videoElement.addEventListener('ended', function() {
				playPauseControl.className = 'play-pause paused';
				playPauseControl.innerHTML = '<img src="img/j-video/control_replay.svg" />';
				pBarContainer.style.opacity = 0;
				videoStill.style.opacity = 1;
			});		

			// Mute / unmute function
			muteUnmuteControl.addEventListener('click', function() {
				if (hasClass(muteUnmuteControl, 'muted')) {
					videoElement.muted = false;
					muteUnmuteControl.className = 'mute-unmute unmuted';
					muteUnmuteControl.innerHTML = '<img src="img/j-video/control_volume_high.svg" />';
				}
				else {
					videoElement.muted = true;
					muteUnmuteControl.className = 'mute-unmute muted';
					muteUnmuteControl.innerHTML = '<img src="img/j-video/control_volume_mute.svg" />';
				}
			});

			// Full screen
			fullscreenControl.innerHTML = '<img src="img/j-video/control_fullscreen.svg" />';
			fullscreenControl.addEventListener('click', function() {
				var cls = fullscreenControl.className.split(" ")[1];

				switch(cls) {
					case 'native':
						fullscreenFunction(videoElement);
						break;

					case 'fullscreen':
						exitFullscreenFunction();
						break;

					default:
						break;
				}
			});

			// Show / hide controls
			var dataControls = controls;
			switch(dataControls) {
				case 'show':
					controlVideo.className = 'controls show';
					break;

				case 'hide':
					controlVideo.className = 'controls hide';
					break;

				case 'autohide':
					controlVideo.className = 'controls autohide';
					break;

				default:
					controlVideo.className = 'controls show';
					break;
			}

			// Poster URL
			const posterExists = jVideoElement[i].hasAttribute('poster');

			switch(posterExists) {
				case true:
					videoStill.style.backgroundImage = "url(" + poster + ")";
					break;

				default:
					break;
			}
		}
	}

	// Loop through <j-video> elements to create new instances automatically
	var jVideoElement = document.getElementsByTagName('j-video');
	for (var i = 0; i <= jVideoElement.length - 1; i++) {
		player.render();
	}
})();