import '../plugins/marker_cluser/leaflet.markercluster-src'
import '../plugins/marker_cluser/MarkerCluster.Default.css'

export default {
    defaultClusterOpt: {
        maxClusterRadius: 80,
        iconCreateFunction: null,
        clusterPane: L.Marker.prototype.options.pane,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: false,
        singleMarkerMode: false,
        disableClusteringAtZoom: null,
        removeOutsideVisibleBounds: true,
        animate: true,
        animateAddingMarkers: false,
        spiderfyDistanceMultiplier: 1,
        spiderLegPolylineOptions: {weight: 1.5, color: '#222', opacity: 0.5},
        chunkedLoading: false,
        chunkInterval: 200,
        chunkDelay: 50,//load marker delay
        chunkProgress: null,//Callback function that is called at the end of each chunkInterval.
        polygonOptions: {}
    },
    markerCluster: function (features, opt) {
        let _options = this.defaultClusterOpt;
        if (opt) {
            _options = Object.assign(this.defaultHeatOpt, opt);
        }
        _options.draw = 'cluster'
        let data = [];
        features.map((feat) => {
            data.push(L.marker(L.latLng(feat.geometry.coordinates[1], feat.geometry.coordinates[0])))
        })
        let clusterLayer = L.markerClusterGroup(_options);
        clusterLayer.addLayers(data);
        return clusterLayer;
    },
}
