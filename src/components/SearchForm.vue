<template>
  <div>
    <h1>Find the places!</h1>
    <div>
      <label>Enter your address</label>
      <input type="text" v-model="address" />
    </div>
    <div>
      <label>Enter the places you want to search for</label>
      <input type="text" v-model="place" />
    </div>
    <div>
      <label>Enter the radius</label>
      <input type="number" v-model="radius" />
    </div>
    <button v-on:click="GetMap">
      Push
    </button>
    <div id="map" ref="mapDiv" style="width: 100%; height: 80vh" />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { Options, Vue } from 'vue-class-component';
import { Loader } from '@googlemaps/js-api-loader';
//import {googlemaps} from 'googlemaps';

@Options({
  components: {
  },
})
export default class SearchForm extends Vue {
  GOOGLE_MAPS_API_KEY = 'AIzaSyDpyyrjTnWIBVUs14Ebvuvo1Z4xgp44Obw'

  loader = new Loader({ apiKey: this.GOOGLE_MAPS_API_KEY,
    libraries: ["places"] 
  })
  mapDiv: any;
  map: any;

  coords = {lat: 0, lng: 0} //: google.maps.LatLng = new google.maps.LatLng(0, 0);
  isSupported = 'navigator' in window && 'geolocation' in navigator;
  watcher: any = null;

  address = '';
  place = '';
  radius = 0;

  getLocation(position: any) {
    this.coords.lat = position.coords.latitude; 
    this.coords.lng = position.coords.longitude;
  }

  mounted() {
    if (this.isSupported)
    this.watcher = navigator.geolocation.watchPosition(
      this.getLocation
    );
    this.getCoordinates();
  }

  async GetMap(): Promise<void> {
    let address = await this.getCoordinates();
    this.coords = address === null ? this.coords : address;
    await this.loader.load();
    console.log(this.coords);
    let mapOptions = { center: this.coords, zoom: 15 }
    let mapDiv: HTMLElement = this.$refs.mapDiv as HTMLElement;
    let map = new google.maps.Map(mapDiv, mapOptions);
    const request = {
      location: this.coords,
      radius: this.radius,
      keyword: this.place
    };
    var service = new google.maps.places.PlacesService(map);

    function createMarker(place: google.maps.places.PlaceResult, map: google.maps.Map) {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      //google.maps.event.addListener(marker, "click", () => {
        //infowindow.setContent(place.name || "");
        //infowindow.open(map);
      //});
    }

    service.nearbySearch(request, function(results, status) {
      console.log(status);
      console.log(results);
      if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i], map)
        }    
      }
    });
  }

  async getCoordinates() {
    var requestOptions = {
      method: 'GET'
    };

    let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.address.replace(' ', '+') + '&key=' + this.GOOGLE_MAPS_API_KEY, requestOptions);
    let json = await response.json();
    let location = json.results[0].geometry.location;
    return location;
  }

  unmounted(): void {
    if (this.watcher) navigator.geolocation.clearWatch(this.watcher)
  }

}
</script>