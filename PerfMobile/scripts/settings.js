(function($, console, doc) {settingsModel

settingsModel = kendo.data.ObservableObject.extend({
		cardNumber: null,
         
		init: function() {
			kendo.data.ObservableObject.fn.init.apply(this, [this]);
			var that = this;
			that.set("cardNumber", null);
		},
        
        resetView: function() {
            var that = this;
            
            that._reset(); 
            
            $("#cardNumberField").keyup(function(e) {
                if(that._checkIsValid(e.target.value)) {
                    $("#buttonAddNewCardView").removeClass("isCardValid");
                } else {
                    $("#buttonAddNewCardView").addClass("isCardValid");
                }
            });
        },

		addNewCard: function() {
			var that = this,
    			cardNumberValue = $('#cardNumberField').val(),
    			newCard = that._generateRandomCard(cardNumberValue),
                positionAdded = cardsViewModel.cards.push(newCard) - 1;
			
			cardsViewModel.cardNumbers()[cardNumberValue] = positionAdded;
                
			app.navigate("views/cardsView.html");	
		},

		cardIdChanged: function(e) {

			var that = this, 
    			cardForAddId = e.currentTarget.value,
    			isValidCardNumber = that._checkIsValid(cardForAddId);
                
			that.set("canAddCard", isValidCardNumber);
		},

		_generateRandomCard: function(cardNumberValue) {
			    var currentAmount = Math.floor((Math.random() * 100) + 10),
        			bonusPoints = Math.floor(Math.random() * 100),
        			currentDate = new Date(),    
                    expireDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2)),
                    cardToAdd;

			cardToAdd = {
				cardNumber : cardNumberValue,
				amount: currentAmount,
				bonusPoints: bonusPoints,
				expireDate: kendo.toString(expireDate, "yyyy/MM/dd")
			};
                
			return cardToAdd;
		},

		_checkIsValid: function(typedCardId) {
			var that = this;
                
			return that._validateCardNumber(typedCardId) && !that._isDublicateNumber(typedCardId);
		},

		_validateCardNumber: function(cardNumberValue) {
			var validateNumberRegex = /^[0-9]{9}$/,
			    isValidCardNumber = validateNumberRegex.test(cardNumberValue);
                
			return isValidCardNumber;
		},

		_isDublicateNumber: function (cardNumberValue) {
			var isDublicate = cardsViewModel.cardNumbers().hasOwnProperty(cardNumberValue);
			
            return isDublicate;
		},
        
        _reset: function() {
            var $cardNumberFild = $('#cardNumberField'),
            $buttonAddNewCard = $('#buttonAddNewCardView');
            
            $cardNumberFild.focus();
            $cardNumberFild.val("");
            $($buttonAddNewCard).addClass("isCardValid");
        }
	});



var AppData = function() {
	var endpoints,
    	initialSettings,
    	_announcements,
        details;

	endpoints = {
		starbucksTest: {path:"scripts/starbucksTest.json", verb:"GET"}
	};
    
	initialSettings = [
		{
			var servername = "plli03.qad.com";
			var tomcatPort = "40011";
			var webapp = "qad-central";
			var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
			var apiName = "Login";
			outputCSV = "";
			requestType = "POST";
			recordSize = "100";
		}
		{
			"cardNumber":"461253932",
			"amount":20,
			"bonusPoints":60,
			"expireDate":"2013/12/06"
		},{
			"cardNumber":"723128745",
			"amount":76,
			"bonusPoints":22,
			"expireDate":"2014/10/16"
		},{
			"cardNumber":"912472185",
			"amount":104,
			"bonusPoints":56,
			"expireDate":"2014/11/24"
		}
	];
    
	_announcements = [
		{ title: "Holiday Drinks Are Here", description: "Enjoy your favorite holiday drinks, like Pumpkin Spice Lattes.", url: "images/holiday.png" },
		{ title: "Register & Get Free Drinks", description: "Register any Jitterz card and start earning rewards like free drinks. Sign-up now.", url: "images/rewards.png" },
		{ title: "Cheers to Another Year", description: "Raise a cup of bold and spicy Jitterz Anniversary Blend.", url: "images/cheers.png" },
		{ title: "Hot Drinks Anytime", description: "Find and enjoy our, hot drinks anytime.", url: "images/hot-drink.png" },
		{ title: "Friend and Love", description: "Get more for your friends.Get Love.", url: "images/love-friend.png" },
		{ title: "Wide range of choice", description: "Raise a cup of bold and spicy Jitterz Anniversary Blend.", url: "images/best-coffee.png" }
	];
    
	details = {
		load: function(route, options) {
			var path = route.path,
    			verb = route.verb,
    			dfd = new $.Deferred();

			console.log("GETTING", path, verb, options);

			//Return cached data if available (and fresh)
			if (verb === "GET" && details.checkCache(path) === true) {
				//Return cached data
				dfd.resolve(details.getCache(path));
			}
			else {
				//Get fresh data
				$.ajax({
					type: verb,
					url: path,
					data: options,
					dataType: "json"
				}).success(function (data, code, xhr) {
					details.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
			}

			return dfd.promise();
		},
        
		checkCache: function(path) {
			var data,
			path = JSON.stringify(path);

			try {
				data = JSON.parse(localStorage.getItem(path));
                
				if (data === null || data.expires <= new Date().getTime()) {
					console.log("CACHE EMPTY", path);
					return false;
				}
			}
			catch (err) {
				console.log("CACHE CHECK ERROR", err);
				return false;
			}

			console.log("CACHE CHECK", true, path);
			return true;
		},
        
		setCache: function(path, data, expires) {
			var cache = {
				data: data,
				expires: expires
			},
			path = JSON.stringify(path);

			//TODO: Serialize JSON object to string
			localStorage.setItem(path, JSON.stringify(cache));

			console.log("CACHE SET", cache, new Date(expires), path);
		},
        
		getCache: function(path) {
			var path = JSON.stringify(path),
			cache = JSON.parse(localStorage.getItem(path));

			console.log("LOADING FROM CACHE", cache, path);

			//TODO: Deserialize JSON string
			return cache.data.data;
		}
	};

	return {
		getStarbucksLocations: function(lat, lng, max) {
            return $.getJSON("data/starbucksTest.json");
		},
        
		getInitialCards: function() {
			return JSON.stringify(initialSettings);
		},
        
		getAnnouncements: function() {
			return _announcements;
		}
	};
}