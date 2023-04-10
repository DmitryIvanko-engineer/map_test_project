export default class MapService {
    private coords: google.maps.LatLng;
    private isSupported: boolean;
    private mapZoom = 15;

    constructor(isSupported: boolean) {
        this.coords = new google.maps.LatLng(0);
        this.isSupported = isSupported;   
    }

    getUserDefaultLocation(): number | undefined {
        if (this.isSupported) {
            const coords = new google.maps.LatLng(0);
            const watcher = navigator.geolocation.watchPosition(
                function (position: any) {
                    coords.lat = position.coords.latitude; 
                    coords.lng = position.coords.longitude;
                }
            );
            this.coords = coords;
            return watcher;
        }
        return undefined;
    }

    async GetMap(address: string, place: string, radius: number, mapDiv: HTMLElement): Promise<void> {
        const addressCoords = await this.getAddressCoordinates(address);
        const coords: google.maps.LatLng = addressCoords === null ? this.coords : addressCoords;

        console.log(this.coords);
        
        const mapOptions = { center: coords, zoom: this.mapZoom }
        const map = new google.maps.Map(mapDiv, mapOptions);
        const request = {
          location: coords,
          radius: radius,
          keyword: place
        };
        const service = new google.maps.places.PlacesService(map);
    
        const createMarker = this.createMarker;
        service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
                for (let i = 0; i < results.length; i++) {
                    
                  createMarker(results[i], map)
                }    
            }
        } );
    }

    private async getAddressCoordinates(address: string): Promise<google.maps.LatLng | null>{
        if(address !== '' && address !== null) {
            const requestOptions = {
                method: 'GET'
              };
          
              const response = await fetch(process.env.VUE_APP_GOOGLE_MAPS_API_ADDRESS_PATH + 'address=' + address.replace(' ', '+') + '&key=' + process.env.VUE_APP_GOOGLE_MAPS_API_KEY, requestOptions);
              const json = await response.json();
              const location: google.maps.LatLng = json.results[0].geometry.location;
              return location;
        }
        else {
            return null;
        }
    }

    private createMarker(place: google.maps.places.PlaceResult, map: google.maps.Map): void {
        if (!place.geometry || !place.geometry.location) return;
  
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
        });

        const infowindow = new google.maps.InfoWindow();
  
        google.maps.event.addListener(marker, "click", () => {
          infowindow.setContent(place.name || "");
          infowindow.open(map);
        });
    }
}