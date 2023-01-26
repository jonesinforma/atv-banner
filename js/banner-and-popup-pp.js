/* jshint browser: true, devel: true */
/* global $, console, f, g */

var bannerExists = true,
	popupExists = false,
	bannerEdition = "2022-30-09-01";

var $setCookieButtons, $slides, $dots, $dotContainer, $firstSlide, $playPause, $bannerBox, bannerTimer, dotTimer, numBanners, $parentBody, $popupIframe, $parentBanner, $informaButton;
var bannerHeight = 130,
	slideIndex = 0,
	slideSpeed = 1200,
	slideInterval = 6200,
	iterations = 0,
	finishAfter = 6,
	animRunning = false,
	animComplete = true,
	titlesBannerAdded = false,
	docReady = false;

// var links = {
// 	'rtLatin': 'https://primalpictures.com/freetrial.aspx?utm_source=ATV%20Banner&utm_campaign=RT%20Latin',
// 	'librarian': 'https://informa.co1.qualtrics.com/jfe/form/SV_d6zdqnIXUNm0qHz?utm_source=ATV%20Banner&utm_campaign=Librarian%20Survey',
// 	'primalNow': 'https://attendee.gotowebinar.com/register/6882976170319037954?source=Website',
// 	'ev': 'https://pages.pharmaintelligence.informa.com/primal-pictures-trial-request',
// 	'ar': 'https://pages.pharmaintelligence.informa.com/primal-pictures-trial-request',
// 	'audiology': '/html5uihelp/gettingstarted/pdfs/transition_guide_audiology.pdf'
// };


$(document).ready(function () {

	if (!docReady) {
		console.log('DR - PL banner-and-popup.js');

		$parentBody = window.parent.$("body");
		$parentBanner = window.parent.$(".bannerBox");
		var $informaButton = window.parent.$("#iribbon-title");
		$bannerContents = $('.banner');
		$bannerAnchors = $bannerContents.find('a');
		$bannerButtons = $bannerContents.find('buttons');
		$bannerShowHide = $bannerContents.find('.showHide');

		$popupIframe = $parentBody.find('.popup-iframe');

		$('<style>').text(".bannerBox.shown{height: 262px}").appendTo(window.parent.document.head);

		// HIDE BANNER WHEN LOGGED IN AS CHILD:
		//$('<style>').text("body.loggedIn.personalProfile .bannerBox{display:none}").appendTo(window.parent.document.head);

		if (bannerExists) {

			//HIDE BANNER IF NO ACCESS TO PPROFILES:

			// var hasAccessToPProfiles = $.cookie("hasAccessToPersonalProfiles");
			// if (hasAccessToPProfiles === "false") {
			// 	$parentBody.find('#bannerBox').hide();

			// } else {
			//

			// Stow banner in menuBar, no transition.
			if ($.cookie("bannerHidden" + bannerEdition)) {
				console.log('Banner exists and is hidden');

				$parentBanner.queue(function () {
					$parentBanner
						.removeClass('initial')
						.removeClass('shown')
						.addClass('hidden');
					$parentBanner.dequeue();
				});
				setTimeout(function () {
					$parentBanner.css('transition', 'all 0.8s');
				}, 2000);


				$bannerContents.queue(function () {
					$bannerContents
						.css('transition', 'all 0s')
						.removeClass('shown')
						.addClass('hidden')
					$bannerContents.dequeue();
				});

				$bannerAnchors.attr('tabindex', -1);
				$bannerButtons.attr('tabindex', -1);
				$bannerShowHide.attr('tabindex', 0);

				setTimeout(function () {
					$bannerContents.css('transition', 'all 0.8s');
				}, 2000);

			} else {

				// Slide banner down;
				$parentBanner.css('transition', 'all 0.8s');
				setTimeout(function () {
					// if (window.parent.$("body").hasClass('personalProfile')) {
					$parentBanner.removeClass('initial');
					$informaButton.attr('tabindex', -1);
					// }
				}, 2000);
			}

			// }

		}


		if (popupExists) {
			if (!$.cookie('hidePopup')) {
				// console.log('SHOW');
				showPopup();
			} else {
				console.log("DON'T SHOW");
				// console.log($.cookie('hidePopup'));
			}
		}

		// checkForCookiesRelatingToButtons();

		// addOnClickToCookieButtons();

		initialiseIframeRotatingBanner();
		setIframeBodyClassAccordingTo_LoginStatus();
		setIframeBodyClassAccordingTo_ScreenSize();
	}

	docReady = true;
});

function showHideBanner(elem) {
	var $elem = $(elem);

	//style within iframe
	$bannerContents = $elem.closest('.banner');
	$bannerContents.toggleClass('hidden').toggleClass('shown');
	$bannerAnchors = $bannerContents.find('a');
	$bannerButtons = $bannerContents.find('buttons');

	// style of iframe container
	var $bannerBox = window.parent.$("#bannerBox");
	var $bannerIframe = $bannerBox.find('iframe');
	var $informaButton = window.parent.$("#iribbon-title");
	$bannerIframe.css('height', '262px');
	if ($bannerBox.hasClass('shown')) {
		$bannerBox.removeClass('shown').addClass('hidden');
		$bannerIframe.attr('tabindex', -1);
		$informaButton.attr('tabindex', 0);
	} else {
		$bannerBox.removeClass('hidden').addClass('shown');
		$bannerIframe.attr('tabindex', 0);
		$bannerAnchors.attr('tabindex', 0);
		$bannerButtons.attr('tabindex', 0);
		$informaButton.attr('tabindex', -1);
	}

	// add or delete bannerHidden cookie
	if ($elem.hasClass('gotIt-button')) {
		if ($bannerBox.hasClass('shown')) {
			$.removeCookie("bannerHidden" + bannerEdition);
		} else {
			$.cookie("bannerHidden" + bannerEdition, "true", {
				expires: 90
			});
		}
	}

	// if ($elem.hasClass('survey')) {
	// 	setTimeout(function () {
	// 		window.open("https://informa.co1.qualtrics.com/jfe/form/SV_00uR3Q8rgwoZl6S", "_blank");
	// 	}, 1000);


	// 	if ($bannerBox.hasClass('shown')) {
	// 		$.removeCookie("bannerHidden" + bannerEdition);
	// 	} else {
	// 		$.cookie("bannerHidden" + bannerEdition, "true");
	// 	}

	// }
}

function setIframeBodyClassAccordingTo_LoginStatus() {
	// console.log('setIframeBodyClassAccordingToLoginStatus');

	if ($.cookie("atvCookie")) {
		$('body').addClass('logged-in');
		$('.announcementBanner.leftRight .button-text').removeClass('displayIsNone');
	} else {
		$('body').addClass('logged-out');
		$('.announcementBanner.leftRight .button-text').removeClass('displayIsNone');
	}
}

function setIframeBodyClassAccordingTo_ScreenSize() {
	// console.log('setIframeBodyClassAccordingTo_ScreenSize');
	console.log($parentBody.innerHeight(), $parentBody.innerWidth())
	if ($parentBody.innerHeight() < 600 && $parentBody.innerHeight() < $parentBody.innerWidth()) {
		$('body').addClass('mobile-landscape');
	}
};

function initialiseIframeRotatingBanner() {
	// console.log('initialiseIframeRotatingBanner');

	$bannerBox = $('.bannerInnerBox');
	$slides = $bannerBox.children(".announcementBanner");
	$dotContainer = $bannerBox.children('.dotContainer');
	$playPause = $bannerBox.children('.playPause');
	numBanners = $slides.length;

	if (numBanners > 1) {
		$slides.each(function (i, slide) {
			var $slide = $(slide);
			$slide.attr('data-order', i);
			var $newDot = $("<div class='dot'>" + i + "</div>");
			$newDot.attr('data-order', i);
			if (i === 0) {
				$newDot.addClass('active');
				$firstSlide = $slide;
			}
			$newDot.on('click', bannerDotClicked);
			$newDot.appendTo($dotContainer);
		});
		$dots = $dotContainer.children();
		$dotContainer.removeClass('displayIsNone');

		bannerTimer = setTimeout(showSlides, slideInterval);
		// showSlides();

		$playPause.removeClass('displayIsNone');
		$playPause.on('click', playPauseClicked);
	} else {
		$bannerBox.addClass('singleBanner');
	}
}

function showSlides() {
	// console.log('showSlides');
	animRunning = true;
	animComplete = false;
	$playPause.removeClass('paused');
	$slides = $(".announcementBanner");
	$firstSlide = $('.announcementBanner').first();
	var nextOrder = $firstSlide.next('.announcementBanner').attr('data-order');
	// console.log('nextOrder is ' + nextOrder);
	var $nextDot = $('.dot[data-order="' + nextOrder + '"]');
	// console.log('$nextDot order is ' + $nextDot.attr('data-order'));
	slideIndex++;
	if (slideIndex > $slides.length - 1) {
		slideIndex = 0;
		checkIfFinished();
	}
	//    console.log('INDEX ' + slideIndex);
	//    console.log('showSlides ' + slideIndex + ', iterations is ' + iterations + ', slides.length is ' + $slides.length);


	if (window.innerWidth < 768 && window.innerWidth < window.innerHeight) {

		$firstSlide.animate({
			marginLeft: -window.innerWidth
		}, slideSpeed, function () {
			$firstSlide.css('margin-left', '0');
			$firstSlide.parent().append($firstSlide);
			animComplete = true;
		});
	} else {
		$firstSlide.animate({
			marginTop: -bannerHeight
		}, slideSpeed, function () {
			$firstSlide.css('margin-top', '0');
			$firstSlide.parent().append($firstSlide);
			animComplete = true;
		});
	}


	bannerTimer = setTimeout(showSlides, slideInterval);

	dotTimer = setTimeout(function () {
		$dots.removeClass('active');
		$nextDot.addClass('active');
	}, 1000);

}

function bannerDotClicked() {
	// console.log('bannerDotClicked');

	var $this = $(this);
	if ($this.hasClass('active') && !animRunning) {
		iterations = 0;
		showSlides();
	} else {
		animComplete = true;
		stopAnim();
		var dotOrder = $this.attr('data-order');
		$dots.removeClass('active');
		$this.addClass('active');

		//		console.log(dotOrder);
		var $bannerToShow = $(".announcementBanner[data-order='" + dotOrder + "']");
		$bannerToShow.css('margin-top', '0');
		$('.continueBtn').after($bannerToShow);
	}
}

function playPauseClicked() {
	// console.log('playPauseClicked');

	if ($playPause.hasClass('paused')) {
		showSlides();
		iterations = 0;
	} else {
		stopAnim();
	}
}

function checkIfFinished() {
	// console.log('checkIfFinished');

	if (iterations == finishAfter - 1) {
		stopAnim();
	}
	iterations++;
}

function stopAnim() {
	// console.log('STOPANIM ' + animComplete);
	var checkSlideComplete = setInterval(function () {
		if (animComplete) {
			$bannerBox.children('.announcementBanner').each(function () {
				$(this).css('margin-top', '0');
				$(this).stop(true, true);
			});
			clearTimeout(bannerTimer);
			clearTimeout(dotTimer);
			animRunning = false;
			$playPause.addClass('paused');
			clearInterval(checkSlideComplete);
			// if ($bannerBox.children('.announcementBanner').length === 1) {
			// 	$('.playPause').hide();
			// 	$('.dotContainer').hide();
			// }
		}
	}, 10);
}

function checkForCookiesRelatingToButtons() {
	// console.log('checkForCookiesRelatingToButtons');

	$setCookieButtons = $('.bannerBox').find('.setCookie');
	$setCookieButtons.each(function (i, cookieButton) {
		console.log(i);
		var $cookieButton = $(cookieButton);
		var cookieId = $cookieButton.attr('id');
		if ($.cookie(cookieId + "Clicked") === 'true') {
			$cookieButton.closest('.announcementBanner').remove();
		}
	});
}

function addOnClickToCookieButtons() {
	// console.log('addOnClickToCookieButtons');

	$setCookieButtons.on('click', function (event) {
		var $thisButton = $(event.currentTarget);
		var buttonOrder = $thisButton.parent().attr('data-order');
		var buttonId = $thisButton.attr('id');
		if (!$thisButton.hasClass('persistant')) {
			var $buttonParent = $thisButton.parent();
			$buttonParent.remove();
			$dotContainer.children('[data-order = "' + buttonOrder + '"]').remove();
			var $otherBanners = $bannerBox.children('.announcementBanner');
			var leadingBannerOrder = $otherBanners.first().attr('data-order');
			$dotContainer.children().removeClass('active');
			$dotContainer.children('[data-order = "' + leadingBannerOrder + '"]').addClass('active');
			if ($otherBanners.first().hasClass('librarian')) {
				$playPause.removeClass('dark');
			} else {
				$playPause.addClass('dark');
			}
			if ($otherBanners.length === 1) {
				stopAnim();
			}
			$.cookie(buttonId + "Clicked", 'true', {
				expires: 28
			});
		}
		var buttonLink = links[buttonId];
		window.open(buttonLink, '_blank');
	});
}

var setOrDeletePopupCookie = function (elem) {
	console.log('setOrDeletePopupCookie');

	// SET OR DELETE POPUP COOKIE
	var $this = $(elem);
	$this.toggleClass('clicked');
	if ($this.hasClass('clicked')) {
		$.cookie('hidePopup', 'true', {
			expires: 3650
		});
		console.log('ADD-COOKIE');
	} else {
		$.removeCookie('hidePopup');
		console.log('REMOVE-COOKIE');
	}
	console.log($.cookie());
};

// HIDE WELCOME MODAL
var hidePopup = function () {
	$popupIframe.fadeOut(300);
};


// SHOW WELCOME MODAL
var showPopup = function () {
	$popupIframe.fadeIn(300);
};