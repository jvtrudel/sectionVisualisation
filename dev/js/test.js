function chart(data) {
  var width = 720, // default width
      height = 80; // default height
  var data=data;


  function my() {
    // generate chart here, using `width` and `height`
  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };
  my.data=function(value){
	  if(!arguments.length) return data;
	  data=value;
	  return my
  }
  my.init = function(){
	  console.log(data);
	  return my;
  }


  return my;
}
