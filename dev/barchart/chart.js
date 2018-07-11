
// Déclare le namespace
var sections={};

sections.resultManager = function module(){
	// Gestionaire des résultats d'élection pour une circonscription
	var exports = {},
	dispatch=d3.dispatch('dataReady', 'dataLoading'),
	data;

	d3.rebind(exports,dispatch,'on');
	return exports;
}
