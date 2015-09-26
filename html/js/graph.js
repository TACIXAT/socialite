var Socialite = Socialite || {};
Socialite.Graph = {};
Socialite.Graph.Search = {};
Socialite.Graph.Connect = {};

Socialite.Graph['init'] = function() {
    Socialite.Graph.Connect.init();
}

Socialite.Graph.Connect['init'] = function() {
    var SGC = Socialite.Graph.Connect;
    var height = $("#connect_div").innerHeight(),
        width = $("#connect_div").innerWidth();

    console.log("HW:", height, width);

    SGC['force'] = d3.layout.force()
        .size([width, height])
        .nodes([]) // initialize with a single node
        .linkDistance(150)
        .charge(-1000)
        .on("tick", SGC.tick);

    var svg = d3.select("#connect_div").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    SGC['nodes'] = SGC['force'].nodes();
    SGC['links'] = SGC['force'].links();
    SGC['node'] = svg.selectAll(".node");
    SGC['link'] = svg.selectAll(".link");
    SGC['label'] = svg.selectAll("text.label"); 
    SGC.update();
}

Socialite.Graph.Connect['tick'] = function(e) {
    var SGC = Socialite.Graph.Connect;
    SGC['link'].attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    SGC['node'].attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
      //.attr("r", function(d) { return 25;});

    SGC['label'].attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
}

Socialite.Graph.Connect['update'] = function() {
    var SGC = Socialite.Graph.Connect;
    SGC.link = SGC.link.data(SGC.links, function(d) { return d.source.id + "-" + d.target.id; });

    SGC.link.enter().insert("line", ".node")
        .style("stroke", function(d) { 
            return "linear-gradient(" + getStrokeColor(d.source) + ", " + getStrokeColor(d.target) + ")"; })
        .attr("class", "link");

    SGC.link.exit().remove();

    SGC.node = SGC.node.data(SGC.nodes, function(d) { return d.id; });

    SGC.node.enter().insert("circle", ".cursor")
        .attr("class", "node")
        .attr("r", 25)
        .style("fill", SGC.getNodeColor)
        .style("stroke", SGC.getStrokeColor)
        // .on("click", SGC.nodeClick)
        // .on("dblclick", SGC.nodeDoubleClick)
        // .on("contextmenu", SGC.nodeRightClick)
        .call(SGC.force.drag);

    SGC.node.exit().remove();

    SGC.label = SGC.label.data(SGC.nodes, function(d) { return d.id; });
    SGC.label.enter()
        .append("text")
        .attr("class", "label")
        .attr("fill", "black")
        .text(function(d) {  return d.properties.name });

    SGC.label.exit().remove();
    
    SGC.force
        .nodes(SGC.nodes)
        .links(SGC.links)
        .start();
}

Socialite.Graph.Connect['getNodeColor'] = function(d) {
    switch(d.properties.type) {
        case "event":
            //return "#FFC45B";
            return "#5480CA";
        case "person":
            return "#FF675B";
        case "location":
            return "#4EDA66";
    }
}

Socialite.Graph.Connect['getStrokeColor'] = function(d) {
    switch(d.properties.type) {
        case "event":
            //return "#FFC45B";
            return "#799EDD";
        case "person":
            return "#FF8980";
        case "location":
            return "#74E788";
    }
}

Socialite.Graph.Connect['addNode'] = function(vertex) {
    var SGC = Socialite.Graph.Connect;
    var id = vertex["id"];
    if(SGC.findNode(id) !== undefined)
        return;

    SGC.nodes.push(vertex);
    SGC.update();
    SGC.linkNeighbors(vertex);
}

Socialite.Graph.Connect['linkNeighbors'] = function(vertex) {
    var SGC = Socialite.Graph.Connect;
    var id = vertex._id;
    var type = vertex.properties.type;
    var neighbors = vertex.neighbors;
    for(var idx in neighbors){
        var neighbor = neighbors[idx];
        var neighborType = neighbor.split('_')[0];
        var neighborId = neighbor.split('_')[1];

        if(type == 'person') {
            SGC.addLink(id, neighborId);
        } else if(type == 'event') {
            if(neighborId == 'person') 
                SGC.addLink(neighborId, id);
            else
                SGC.addLink(id, neighborId);
        } else if(type == 'location') {
            SGC.addLink(neighborId, id);
        }
    }
}

Socialite.Graph.Connect['findNode'] = function(id) {
    var SGC = Socialite.Graph.Connect;
    for (var i=0; i < SGC.nodes.length; i++) {
        if (SGC.nodes[i].id == id)
            return SGC.nodes[i]
    }
}

Socialite.Graph.Connect['addLink'] = function(srcId, dstId) {
    var SGC = Socialite.Graph.Connect;
    var src = SGC.findNode(srcId);
    var dst = SGC.findNode(dstId);
    if((src !== undefined) && (dst !== undefined)) {
        SGC.links.push({"source": src, "target": dst});
        SGC.update();
    } 
}