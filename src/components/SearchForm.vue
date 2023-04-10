<template>
  <div>
    <div style="width: 40%; margin-left: 30%; margin-right: 30%;">
      <h1>Find the places!</h1>
      <div style="display: flex; margin-top: 6px; margin-bottom: 6px;">
        <label style="width: 50%; display: flex;">Enter your address</label>
        <input type="text" v-model="address" style="width: 50%; display: flex;"/>
      </div>
      <div style="display: flex; margin-top: 6px; margin-bottom: 6px;">
        <label style="width: 50%; display: flex;">Enter the places you want to search for</label>
        <input type="text" v-model="place" style="width: 50%; display: flex;"/>
      </div>
      <div style="display: flex; margin-top: 6px; margin-bottom: 6px;">
        <label style="width: 50%; display: flex;">Enter the radius</label>
        <input type="number" v-model="radius" style="width: 50%; display: flex;"/>
      </div>
      <button v-on:click="getMap">
        Push
      </button>
    </div>
    <div id="map" ref="mapDiv" style="width: 100%; height: 80vh" />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { Options, Vue } from 'vue-class-component';
import { Loader } from '@googlemaps/js-api-loader';
import MapService, {} from '../services/mapService'

@Options({
  components: {
  },
})
export default class SearchForm extends Vue {
  mapService: any;
  isSupported = 'navigator' in window && 'geolocation' in navigator;
  watcher: number | undefined = undefined;
  address = '';
  place = '';
  radius = 0;

  getMap() {
    this.mapService.GetMap(this.address, this.place, this.radius, this.$refs.mapDiv as HTMLElement);
  }

  async mounted() {
    let loader = new Loader({ 
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      libraries: ["places"] 
    })
    await loader.load();
    this.mapService = new MapService('navigator' in window && 'geolocation' in navigator);
    this.watcher = this.mapService.getUserDefaultLocation();
  }

  unmounted(): void {
    if (this.watcher) navigator.geolocation.clearWatch(this.watcher);
  }

}
</script>