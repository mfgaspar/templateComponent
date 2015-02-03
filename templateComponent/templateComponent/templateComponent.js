
var simpleCustomComponent = UnmanagedComponent.extend({

  init: function() {
    $.extend(this.options, this);
    this.ph = $("#"+this.htmlObject).empty(); 
  },
  
  update: function() {
    _.bindAll(this, 'redraw', 'init');
    this.init();
    this.triggerQuery(this.chartDefinition, this.redraw);
  },

  redraw: function(data) {
    $("#"+this.htmlObject).append('<div>'+this.customProperty+'</div>');
  }  
}); 

