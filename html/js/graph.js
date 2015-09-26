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

    SGC['force'] = d3.layout.force()
        .size([width, height])
        .nodes([]) // initialize with a single node
        .linkDistance(150)
        .charge(-1000)
        .on("tick", tick);

    var svg = d3.select("#graphDiv").append("svg")
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
}