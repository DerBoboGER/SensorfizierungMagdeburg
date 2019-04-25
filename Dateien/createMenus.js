function createMenu(von, menuetype){
  for (var i = 0; i < von.length; i++) {
    var id = von[i];
    var link = document.createElement('a');

    link.href = '#';
    link.textContent = id;
    if(map.getLayoutProperty(id, 'visibility') === 'visible')
    {
     link.className = 'active';
   } else {
     link.className = '';
   }

    link.onclick = function (e) {
      var clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      var visibilityClick = map.getLayoutProperty(clickedLayer, 'visibility');
  	 
      if (visibilityClick === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        this.className = 'active';
      }
    };

    var layers = document.getElementById(menuetype);
    layers.appendChild(link);
  }
}
