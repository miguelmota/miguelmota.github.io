//nneed namespace
var svg = d3.select("body").append("svg")
    .attr({
              xmlns: "http://www.w3.org/2000/svg",
                      xlink: "http://www.w3.org/1999/xlink",
                              width: 100,
                                      height: 300
                                          })
        .selectAll("a")
            .data(data)
                .enter().append("a")
                    .attr({"xlink:href": "#"})
                        .on("mouseover", function(d, i){
                                  d3.select(this)
                                              .attr({"xlink:href": "http://example.com/" + d});
                                                  })
