var   w = 400,
      h = 400;

var circleWidth = 5;

var palette = {
      "lightgray": "#819090",
      "gray": "#708284",
      "mediumgray": "#536870",
      "darkgray": "#475B62",

      "darkblue": "#0A2933",
      "darkerblue": "#042029",

      "paleryellow": "#FCF4DC",
      "paleyellow": "#EAE3CB",
      "yellow": "#A57706",
      "orange": "#BD3613",
      "red": "#D11C24",
      "pink": "#C61C6F",
      "purple": "#595AB7",
      "blue": "#2176C7",
      "green": "#259286",
      "yellowgreen": "#738A05"
  };

// nodes is an object with the people
// and who they are connected to type: "farther", gender: "male", 
var nodes = [
      { "name": "moh", "type": "parent1", "gender": "mal"},
      { "name": "maa", "type": "parent2", "gender": "fem", target:[0]},
      { "name": "nad",  "type": "child", "gender": "fem", target: [0]},
      { "name": "naz",  "type": "child", "gender": "fem", target: [0]},
      { "name": "nay",  "type": "child", "gender": "fem", target: [0]},
      { "name": "imr",  "type": "child", "gender": "fem", target: [0]}
];

// an empty array to hold the links
// as they are generated
var links = [];

for (var i = 0; i< nodes.length; i++) {
	// check the target object is defined
      if (nodes[i].target !== undefined) {
      	// then for each target item
            for (var x = 0; x< nodes[i].target.length; x++ ) {
                  links.push({
                        source: nodes[i],
                        target: nodes[nodes[i].target[x]]
                  })
            }
      }
}

// add an svg element
var myChart = d3.select('#chart')
		.append('svg')
		.attr('width', w)
		.attr('height', h);

// add arrow markers to the svg element
var svg = d3.select('svg')
		.append('marker')
		.attr('id', "triangle")
		.attr('markerWidth', 13)
		.attr('markerHeight', 13)
		.attr('refx', 2)
		.attr('refy', 6)
		.attr('orient', "auto")
		.append('path')
		.attr('d', "M 0 0 L 10 5 L 0 10 z");

// create a force layout
var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([w, h]);

console.log('1');
force.linkDistance(function(link) {
  console.log(link.source.type, link.target.type)
  if(link.source.type.indexOf('parent') > -1 && link.target.type.indexOf ('parent') > -1){
    return circleWidth*2;
  }else{
    console.log('out');
    return 100;
  };
});
console.log('2');

// join the data to the selection
// and bind to element in .enter 
var link = myChart.selectAll('line')
	.data(links).enter().append('line')
	.attr('stroke', palette.gray)
	.attr('marker-start', "url(#triangle)");

// created a join for 'data' and the
// new selection
var node = myChart.selectAll('circle')
	.data(nodes).enter()
	.append('g')
	.call(force.drag);

// applies to all nodes
node.append('circle')
	.attr('cx', function(d) { return d.x; })
	.attr('cy', function(d) { return d.y; })
	.attr('r', circleWidth )
	.attr('fill', function(d, i) {
		if (i>0) { return palette.pink }
		else { return palette.blue }
	});

// applies to all nodes
node.append('text')
	.text(function(d) { return d.name})
	.attr('font-family', 'Roboto Slab')
	.attr('fill', function(d, i) {
		if (i>0) { return palette.mediumgray}
		else { return palette.yellowgreen}
	})
	.attr('x', function(d, i) {
		if (i>0) { return circleWidth + 4 }
		else { return circleWidth -15 }
	})
	.attr('y', function(d, i) {
		if (i>0) { return circleWidth }
		else { return 8 }
	})
	.attr('text-anchor', function(d, i) {
		if (i>0) { return 'beginning' }
		else { return 'end'}
	})
	.attr('font-size',  function(d, i) {
		if (i>0) { return '1em' }
		else { return '1.8em'}
	});

parentsMidpoint = function(){
      // calculate the middpoint of two nodes
      // takes of average of the x & y
      // return and array
      var p1x, p1y, p2x, p2y;

      nodes = force.nodes()
      nodes.forEach(function(value, index, list){
            if(value.type === 'parent1'){
                  p1x = value.x;
                  p1y = value.y;
            };
            if(value.type === 'parent2'){
                  p2x = value.x;
                  p2y = value.y;
            };
      });
      // average of two points
      return [((p1x+p2x)/2), ((p1y+p2y)/2)];

};


force.on('tick', function(e) {
      // 'e' is the tick object with 'type', 'alpha'
      
      node.attr('transform', function(d, i) {
            // d is each node object
            return 'translate('+ d.x +', '+ d.y +')';
      });

      var midpoint = parentsMidpoint();

      link.attr('x1', function(d) { return d.source.x })
          .attr('y1', function(d) { return d.source.y })
          .attr('x2', function(d){
                  if(d.source.type === 'child'){
                        return midpoint[0];            
                  }else{
                        return d.target.x;
                  };
          })
          .attr('y2', function(d){
                  if(d.source.type === 'child'){
                        return midpoint[1];            
                  }else{
                        return d.target.y;
                  };
          //.attr('y2', midpoint[1]);
          //.attr('x2', function(d) { return d.target.x })
          //.attr('y2', function(d) { return d.target.y });

})});

force.start();