let react = {
  name: "React",
  children: [{
    name: "Redux",
    children: [{
      name: "React",
      children: [{
        name: "Redux",
        children: [{
          name: "React",
          children: [{
            name: "Redux"
          }, {
            name: 'Style Components'
          }, {
            name: 'Style sheet'
          }, {
            name: 'Context api'
          }, {
            name: 'React and typescript'
          }]
        }]
      }, {
        name: 'Style Components'
      }, {
        name: 'Style sheet'
      }, {
        name: 'Context api'
      }, {
        name: 'React and typescript'
      }]
    }]
  }, {
    name: 'Style Components'
  }, {
    name: 'Style sheet'
  }, {
    name: 'Context api'
  }, {
    name: 'React and typescript'
  }]
};

const treeData = {
  name: "T",
  children: [{
      name: "Front-end",
      children: [{
          name: "Base",
          children: [
            { name: "Html" },
            { name: 'Css' },
            { name: 'Javascript' },
            { name: 'Sass' },
            { name: 'Less' },
            { name: 'Stylus' }
          ]
        },
        react,
        {
          name: "Vue",
          children: [
            { name: "Html" },
            { name: 'Css' },
            { name: 'Javascript' }
          ]
        },
        {
          name: "C",
          children: [
            { name: "C1" },
            {
              name: "D",
              children: [
                { name: "D1" },
                { name: "D2" }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Front-end",
      children: [{
          name: "Base",
          children: [
            { name: "Html" },
            { name: 'Css' },
            { name: 'Javascript' },
            { name: 'Sass' },
            { name: 'Less' },
            { name: 'Stylus' }
          ]
        },
        {
          name: "React",
          children: [{
            name: "Redux"
          }, {
            name: 'Style Components'
          }, {
            name: 'Style sheet'
          }, {
            name: 'Context api'
          }, {
            name: 'React and typescript'
          }]
        },
        {
          name: "Vue",
          children: [
            { name: "Html" },
            { name: 'Css' },
            { name: 'Javascript' }
          ]
        },
        {
          name: "C",
          children: [
            { name: "C1" },
            {
              name: "D",
              children: [
                { name: "D1" },
                { name: "D2" }
              ]
            }
          ]
        }
      ]
    },
  ]
};


function tree(){
  const layout = { top: 50, right: 20, bottom: 0, left: 20 };
  const width = document.querySelector('#graph').offsetWidth - layout.left - layout.right;
  const height = document.querySelector('#graph').offsetHeight - layout.top - layout.bottom;
  const nodeWidth = 120;
  const nodeHeight = 25;
  const depthDistance = 180;
  const textIndent = 10
  d3.select("#graph svg").remove('svg')

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width + layout.right + layout.left)
    .attr("height", height + layout.top + layout.bottom)
    .append("g")
    .attr("transform", "translate(" + layout.left + "," + layout.top + ")");

  const colors = {
    backgrounds: {
      main: "#2f2f2f",
      secondary: "#2f2f2f"
    },
    texts: {
      default: "#ffffff",
    },
    strokes: {
      primary: 'rgb(3, 192, 220)',
    }
  }
  let i = 0;
  const duration = 500
  var treemap = d3.tree().size([height, width]);
  const root = d3.hierarchy(treeData);
  root.x0 = height / 2;
  root.y0 = 0;
  root.children.forEach(collapse);

  update(root);

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function diagonal(s, d) {
    path = `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
    return path;
  }

  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

  function setDepth(d) {
    d.y = d.depth * depthDistance;
  }

  function updateLinks(source, links) {
    var link = svg.selectAll("path.link").data(links, function(d) {
      return d.id;
    });
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });
    const linkUpdate = linkEnter.merge(link);

    linkUpdate
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        return diagonal(d, d.parent);
      });

    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();
  }

  function updateNodes(source, nodes) {
    var node = svg
      .selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);

    nodeEnter
      .attr("class", "node")
      .attr("r", 1e-6)
      .style("fill", colors.backgrounds.main);

    nodeEnter
      .append("rect")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("stroke-width", 1)
      .attr("stroke", colors.strokes.primary)
      .attr("x", 0)
      .attr("y", -4)
      .attr("width", function(d) { return d.widthSize || nodeWidth })
      .attr("height", function(d) { return d.heightSize || nodeHeight });

    nodeEnter
      .append("text")
      .style("fill", function(d) { return d.textColor || colors.texts.default })
      .attr("x", textIndent)
      .attr("y", function(d) { return nodeHeight / 2 })
      .text(function(d) { return d.data.name });

    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", function(d) { return `translate(${d.y}, ${d.x})` });

    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();
    nodeExit.select("rect").style("opacity", 1e-6);
    nodeExit.select("rect").attr("stroke-opacity", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);
  }

  function update(source) {
    var treeData = treemap(root);
    var nodes = treeData.descendants();
    var links = treeData.descendants().slice(1);
    nodes.forEach(setDepth);
    updateLinks(source, links)
    updateNodes(source, nodes)
    let xUp = 0
    let yUp = 0
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
      yUp = (d.y + nodeWidth + layout.left > yUp) ? d.y + nodeWidth + layout.left : yUp 
      xUp = (d.x + nodeWidth + layout.left > xUp) ? d.x + nodeWidth + layout.left : xUp 
      d3.select("#graph svg")
      .attr("width", yUp)
      .attr("height", xUp)
    });
  }
}

tree()
window.addEventListener('resize', function() { tree() })
