//Buid knockout view model
function NeighborhoodViewModel() {
    // Data
    var self = this;
    self.filters = ['default', 'atm', 'cafe', 'parking', 'pharmacy', 'restaurant', 'gas_station', 'gym', 'store'];


    self.chosenType = ko.observable("");
    self.locations = ko.observableArray();
    //var highlightedIcon = makeMarkerIcon('FFFF24');
    self.highlightMarker = ko.observable();

    //self.chosenFilterData=ko.observable();
    //behavior

};
var myViewModel = new NeighborhoodViewModel();

ko.applyBindings(myViewModel);


var map;

// Create a new blank array for all the listing markers.
var markers = [];
var service;
var myType;
var locations = []; //é€šè¿‡ç­›é€‰æœç´¢å‡ºçš„åœ°å€åˆ—è¡¨



function initMap() {
    // Create a styles array to use with the map.
    /*
    var styles = [
      {
        featureType: 'water',
        stylers: [
          { color: '#19a0d8' }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
          { color: '#ffffff' },
          { weight: 6 }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
          { color: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -40 }
        ]
      },{
        featureType: 'transit.station',
        stylers: [
          { weight: 9 },
          { hue: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          { lightness: 100 }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          { lightness: -100 }
        ]
      },{
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          { visibility: 'on' },
          { color: '#f0e4d3' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -25 }
        ]
      }

    ];*/

    // Constructor creates a new map - only center and zoom are required.
    var myAddress = {
        lat: 40.7413549,
        lng: -73.9980244
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: myAddress,
        zoom: 13,
        //styles: styles,
        mapTypeControl: false
    });
    service = new google.maps.places.PlacesService(map);

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.


    var largeInfowindow = new google.maps.InfoWindow();


    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');


    //var markers=[];

    //create the marks in default mode
    if (myViewModel.chosenType() == "default") {
        service.nearbySearch({
            location: myAddress,
            radius: 500,
        }, callback);
    }



    ///ç­›é€‰å‘ç”Ÿæ”¹å˜è§¦å‘searchNearByPlacesï¼ˆï¼‰

    document.getElementById('filters').addEventListener('change', searchNearByPlaces);
    //click the button of places show the infowindow
    document.getElementById('spots').addEventListener("click", function () {
        var m = myViewModel.highlightMarker();
        m.setIcon(highlightedIcon);

        populateInfoWindow(m, largeInfowindow);
        m.setIcon(defaultIcon);
        console.log(m.title);
    });
    //æ›´æ–°åˆ—è¡¨
    function searchNearByPlaces() {

        myType = myViewModel.chosenType(); //update the type

        service.nearbySearch({
            location: myAddress,
            radius: 500,
            type: [myType]
        }, callback);
    }

    function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //locations=results;


                /// draw the markers on the map
                hideListings(); //clear markers on the map
                createMarker(results);

                showListings(); //draw marker
                //refresh the list on the panel

                refreshList(results);


            }
        }
        //the following group uses the results to update the list of places

    function refreshList() {
        //clear the array in ViewModel
        myViewModel.locations.removeAll();
        for (var i = 0; i < markers.length; i++) {

            //var ratings="Ratings: "+location[i].raing
            myViewModel.locations.push(markers[i]);
            /*document.getElementById(i).addEventListener('click',function(){
      markers[i].setIcon(highlightedIcon);
    })*/

        }
        console.log(myViewModel.locations());

    }
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    function createMarker(results) {
        //myViewModel.locations().removeAll();//cear the array
        markers = [];

        for (var i = 0; i < results.length; i++) {
            // Get the position from the location array.
            var position = results[i].geometry.location;
            var title = results[i].name;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                id: i
            });
            //push locations  to array of  position list


            // Push the marker to our array of markers.
            markers.push(marker);


            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function () {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function () {
                this.setIcon(defaultIcon);
            });

        }

        //document.getElementById('show-listings').addEventListener('click', showListings);
        //document.getElementById('hide-listings').addEventListener('click', hideListings);

    }


    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');


            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
            var latlng = marker.getPosition();
            map.setCenter(latlng); //set center of the map

            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // this function is to use NYtimes API to get info
            var nyNews; //to store the news
            getNYInfo(); //to get the news from Newyork timesAPI
            // this function is defined to get the news from NEW york times API
            function getNYInfo() {
                //NY timesAPI

                var loc = infowindow.marker.title;
                var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + loc + '&sort=newest&api-key=4eb556c803c1437a9cf825e50eaac64f';

                $.getJSON(url, function (data) {
                    if (data.status === "OK"&&data.response.docs.length>0) {
                        var article = data.response.docs[0];
                        //console.log(article);
                        nyNews = '<div><a href=' + article.web_url + '>' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p></div>'; //return the first news about the place
                        // Use streetview service to get the closest streetview image within
                        // 50 meters of the markers position
                        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                    } else {
                        nyNews = "<div>no News</div>";
                        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                    }


                }).error(function () {
                    infowindow.setContent("<div>' + marker.title + '</div>' + '<div>No Street View Found</div>'+'<hr>'<div>the NEW YORK TIMES API service is not good...</div>");
                });

            }

            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    //var nynews=getNYInfo();//newyork times news
                    //getNYInfo();
                    //console.log(nyNews);
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>' +
                        '<hr>' + nyNews);
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Found</div>' + '<hr>' + nyNews);
                }
            }

            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }


    // This function will loop through the markers array and display them all.
    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    // This function will loop through the listings and hide them all.
    function hideListings() {
        for (var i = markers.length - 1; i > -1; i--) {
            markers[i].setMap(null);

        }
    }

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }
}
