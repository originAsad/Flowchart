<template>
  <el-container class="container" id="drawingArea">
    <el-aside width="200px">
      <div class="box-card">
        <div class="header">Flowchart</div>
        <div class="card-body">
 
    
          <!-- <div class="item" v-for="(item,index) in list" :key="item" style=""> -->
            <div class="item">
            <!-- <i class="chart-item" :class="item" :data-key="item" style="color:red;" plumb-item resizeable >{{index}} </i> -->
     <div class="chart-item node" style="left: 120px; top:300px; background-color:#000;" data-nodetype="task" id="taskcontainer0">
        <div class="ctrl_container">
            <div class="button_remove">x</div>
        </div>
        <div class="details_container">
            <label class="detail_label">Name</label>
            <input value="" class="detail_text"/>
        </div>
    </div>

        <div class="chart-item node" style="left:250px; top:500px;background-color:#000;" data-nodetype="decision" id="decisioncontainer0">
        <div class="ctrl_container">
            <div class="button_remove">x</div>
        
        </div>
            
    </div>
          </div>
                <md-button id="saveButton" class="md-dense md-primary">Save</md-button>
      <md-button id="loadButton" class="md-dense md-raised md-primary">Load</md-button>
     </div>
      </div>
    </el-aside>
    <el-main>
      <div class="workplace" id="workplace">
          <!-- <div class="startpoint point window node" style="left: 90px; top:20px; width:15%;" data-nodetype="startpoint" id="startpoint">Start</div> -->
            <!-- <div class="endpoint point window node" style="left: 150px; top:400px" data-nodetype="endpoint" id="endpoint">End</div> -->
</div>
     <textarea id="jsonOutput" style="width:100%;height:100px;"></textarea>
      </div>
    </el-main>
  </el-container>
</template>

<script>

var util = require('util');
export default {
  name: "DragToWorkplace",
  data() {
    return {
      list: [ "diamond", "rectangle"],
    };
  },
  mounted() {
    var numberOfElements = 0;
    var htmlBase = 'drawingArea';
    jsPlumb.ready(function() {
   	//FIX DOM:
	$(("#taskcontainer0"))[0].innerHTML = $(("#taskcontainer0"))[0].innerHTML;
	$(("#decisioncontainer0"))[0].innerHTML = $(("#decisioncontainer0"))[0].innerHTML;

  	jsPlumb.draggable($(".window"));
      let instance = jsPlumb.getInstance({
          
        DragOptions: { cursor: "pointer", zIndex: 2000 },
    
        ConnectionOverlays: [
          [
            "Arrow",
            {
              location: 1,
              visible: true,
              width: 11,
              height: 11,
              id: "Arrow"
            }
        ],
          [
            "Label",
            {
              location: 0.1,
              id: "Label",
              cssClass: "arrow-label",
              events: {
                tap() {
                  console.log("Label");
                }
              }
            }
          ]
        ],
        Container: "workplace"
      });

      let connectorPaintStyle = {
        strokeWidth: 2,
        stroke: "purple",
        joinstyle: "round",
        outlineStroke: "white",
        outlineWidth: 2
      };
     
      let connectorHoverStyle = {
        strokeWidth: 2,
        stroke: "purple",
        outlineWidth: 5,
        outlineStroke: "white"
      };
      let endpointHoverStyle = {
        fill: "#216477",
        stroke: "blue"
      };
      
      let sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
          stroke: "purple",
          fill: "transparent",
          radius: 7,
          strokeWidth: 0.5
        },
        isSource: true,
        connector: [
          "Flowchart",
          {
            stub: [40, 60],
            gap: 10,
            cornerRadius: 5,
            alwaysRespectStubs: true
          }
        ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        overlays: [
          [
            "Label",
            {
              location: [0.5, 1.5],
              label: "Drag",
              cssClass: "endpointSourceLabel",
              visible: false
            }
          ]
        ]
      };

      let targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: "purple", radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        overlays: [
          [
            "Label",
            {
              location: [0.5, -0.5],
              label: "Drop",
              cssClass: "endpointTargetLabel",
              visible: false
            }
          ]
        ]
      };
     
      let init = function(connection) {

        connection.getOverlay("label").setLabel("123");
      };
      let addEndpoints = function(toId, sourceAnchors, targetAnchors) {

        for (var i = 0; i < sourceAnchors.length; i++) {
          var sourceUUID = toId + sourceAnchors[i];
          instance.addEndpoint(toId, sourceEndpoint, {
            anchor: sourceAnchors[i],
            uuid: sourceUUID
            
          });
  }
        for (var j = 0; j < targetAnchors.length; j++) {
          var targetUUID = toId + targetAnchors[j];
          instance.addEndpoint(toId, targetEndpoint, {
            anchor: targetAnchors[j],
        
            uuid: targetUUID
          });
        }
      };
      instance.batch(function() {
        
        instance.bind("connection", function(connInfo, originalEvent) {
          init(connInfo.connection);

        });

        instance.bind("click", function(conn, originalEvent) {
      
        });

        instance.bind("connectionDrag", function(connection) {
          console.log(
            "connection " +
              connection.id +
              " is being dragged. suspendedElement is ",
            connection.suspendedElement,
            " of type ",
            connection.suspendedElementType
          );
           
              
  });
        instance.bind("connectionDragStop", function(connection) {
          console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function(params) {
          console.log("connection " + params.connection.id + " was moved");
        });
      });
       
      $(".box-card .chart-item").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container")
      });
 
 
 $('#'+htmlBase).on("click", ".button_remove", function () {
		var parentnode = $(this)[0].parentNode.parentNode;
		instance.detachAllConnections(parentnode);
		jsPlumb.removeAllEndpoints(parentnode);
		$(parentnode).remove(); 
  });

      $("#workplace").droppable({
        scope: "plant",
        drop: function(ev, ui) {
          		numberOfElements++;
          // let id = "item" + new Date().getTime();
          let id = "item" + numberOfElements;

          let html = `<div id="${id}" class="chart-item ${ui.helper.attr(
            "data-key"
          )}">${ui.helper.html()}</div>`;
  
          $(this).append(html);
          $("#" + id).css({
            top: ui.position.top - 60 + "px",
            left: ui.position.left - 200 + "px"
       
          });
     
          addEndpoints(
            id,
            ["RightMiddle", "BottomCenter"],
            ["LeftMiddle", "TopCenter"]
          );
      
          instance.draggable(id, {
            grid: [1, 1]

          });
 
        }
      });

      jsPlumb.fire("jsPlumbDemoLoaded", instance);
  
    $('#saveButton').click(function(){
      saveFlowchart();
    });
    
    $('#loadButton').click(function(){
      loadFlowchart();
    });
    function addTask(id){
	if(typeof id === "undefined"){
		numberOfElements++;
		id = "taskcontainer" + numberOfElements;
	}
	
	$('<div class="window task node" id="' + id + '" data-nodetype="task" style="left:30px; top:30px;">').appendTo('#'+htmlBase).html($(("#taskcontainer0"))[0].innerHTML);
						
     let connectorPaintStyle = {
        strokeWidth: 2,
        stroke: "purple",
        joinstyle: "round",
        outlineStroke: "white",
        outlineWidth: 2
      };
     
      let connectorHoverStyle = {
        strokeWidth: 2,
        stroke: "purple",
        outlineWidth: 5,
        outlineStroke: "white"
      };
      let endpointHoverStyle = {
        fill: "#216477",
        stroke: "blue"
      };
      
      let sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
          stroke: "purple",
          fill: "transparent",
          radius: 7,
          strokeWidth: 0.5
        },
        isSource: true,
        connector: [
          "Flowchart",
          {
            stub: [40, 60],
            gap: 10,
            cornerRadius: 5,
            alwaysRespectStubs: true
          }
        ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        overlays: [
          [
            "Label",
            {
              location: [0.5, 1.5],
              label: "Drag",
              cssClass: "endpointSourceLabel",
              visible: false
            }
          ]
        ]
      };

      let targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: "purple", radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        overlays: [
          [
            "Label",
            {
              location: [0.5, -0.5],
              label: "Drop",
              cssClass: "endpointTargetLabel",
              visible: false
            }
          ]
        ]
      };
     
 
	
	jsPlumb.addEndpoint(
		$('#'+id),
		sourceEndpoint
	);
	
	jsPlumb.addEndpoint(
		$('#'+id),
		targetEndpoint
	);
	
	jsPlumb.draggable($('#' + id));
	return id;
}
function addDecision(id){
	if(typeof id === "undefined"){
		numberOfElements++;
		id = "decisioncontainer" + numberOfElements;
	}
	$('<div class="window decision node" id="' + id + '" data-nodetype="decision" style="left:30px; top:30px;">').appendTo('#'+htmlBase).html($(("#decisioncontainer0"))[0].innerHTML);
					
	     let connectorPaintStyle = {
        strokeWidth: 2,
        stroke: "purple",
        joinstyle: "round",
        outlineStroke: "white",
        outlineWidth: 2
      };
     
      let connectorHoverStyle = {
        strokeWidth: 2,
        stroke: "purple",
        outlineWidth: 5,
        outlineStroke: "white"
      };
      let endpointHoverStyle = {
        fill: "#216477",
        stroke: "blue"
      };
      
      let sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
          stroke: "purple",
          fill: "transparent",
          radius: 7,
          strokeWidth: 0.5
        },
        isSource: true,
        connector: [
          "Flowchart",
          {
            stub: [40, 60],
            gap: 10,
            cornerRadius: 5,
            alwaysRespectStubs: true
          }
        ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        overlays: [
          [
            "Label",
            {
              location: [0.5, 1.5],
              label: "Drag",
              cssClass: "endpointSourceLabel",
              visible: false
            }
          ]
        ]
      };

      let targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: "purple", radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        overlays: [
          [
            "Label",
            {
              location: [0.5, -0.5],
              label: "Drop",
              cssClass: "endpointTargetLabel",
              visible: false
            }
          ]
        ]
      };
     
 
	jsPlumb.addEndpoint(
		$('#'+id),
		sourceEndpoint
	);
	
	jsPlumb.addEndpoint(
		$('#'+id),
		targetEndpoint
	);

	
	jsPlumb.draggable($('#' + id));
	return id;
}
  function saveFlowchart(){
    var nodes = []
    $(".node").each(function (idx, elem) {
    var $elem = $(elem);
    var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
    console.log('endpoints of '+$elem.attr('id'));
    console.log(endpoints);
    console.log($elem.attr('data-nodetype'))
      nodes.push({
        blockId: $elem.attr('id'),
        nodetype: $elem.attr('data-nodetype'),
        positionX: parseInt($elem.css("left"), 10),
        positionY: parseInt($elem.css("top"), 10)
      });
    });
    var connections = [];
    $.each(instance.getConnections(), function (idx, connection) {
      connections.push({
        connectionId: connection.id,
        pageSourceId: connection.sourceId,
        pageTargetId: connection.targetId
      });
    });
    
    var flowChart = {};
    flowChart.nodes = nodes;
    flowChart.connections = connections;
    flowChart.numberOfElements = numberOfElements;
    
    var flowChartJson = JSON.stringify(flowChart);

          console.log(util.inspect(flowChartJson));
    
    $('#jsonOutput').val(flowChartJson);
  }
  function loadFlowchart(){
    // console.log('I am here');
    var flowChartJson = $('#jsonOutput').val();
    var flowChart = JSON.parse(flowChartJson);
    console.log(flowChart)
    var nodes = flowChart.nodes;
    $.each(nodes, function( index, elem ) {
    if(elem.nodetype === 'task'){
        var id = addTask(elem.blockId);
        repositionElement(id, elem.positionX, elem.positionY);
      }else if(elem.nodetype === 'decision'){
        var id = addDecision(elem.blockId);
        repositionElement(id, elem.positionX, elem.positionY);
      }
      else{
        
      }
    });
                
    var connections = flowChart.connections;
    $.each(connections, function( index, elem ) {
      var connection1 = jsPlumb.connect({
        source: elem.pageSourceId,
        target: elem.pageTargetId,
        anchors: ["BottomCenter", [0.5, 0, 0, 1]]
        
      });
    });
    
    numberOfElements = flowChart.numberOfElements;
  }
  function repositionElement(id, posX, posY){
    $('#'+id).css('left', posX);
    $('#'+id).css('top', posY);
    jsPlumb.repaint(id);
  }
      });

    
    },
  methods: {}
};
</script>
<style lang="scss">
.workplace {
  width: 100%;
  height: 100%;
  position: relative;
}
  small {
    display: block;
  }
  .window { 
    
}

.window:hover{ 
    cursor: pointer;
}

.menu { 
    background-color: #EFEFEF;
    border: 1px solid #346789;
    box-shadow: 2px 2px 5px #AAAAAA;
    color: black;
    min-height: 3em;
    position: absolute;
    min-width: 5em;
}

.task { 
    background-color: #EEEEEF;
    border: 1px solid #346789;
    border-radius: 0.5em;
    box-shadow: 2px 2px 5px #AAAAAA;
    color: black;
    min-height: 3em;
    position: absolute;
    min-width: 5em;
}

.point{ 
    background-color: #333333;
    border: 1px solid #AAAAAA;
    border-radius: 50%;
    box-shadow: 2px 2px 5px #AAAAAA;
    color: white;
    min-width: 50px;
    min-height: 30px;
    font-size:11pt;
    padding:10px;
    position: absolute;
    text-align: center;
}

.point:hover { 
    box-shadow: 2px 2px 19px #AAAAAA;
}

.decision{
    transform:rotate(-45deg);
    overflow:hidden;
    border: 1px solid #346789;
    border-radius: 0.3em;
    color: black;
    backface-visibility: hidden;
    background: none repeat scroll 0 0 #F4F4F4;
    box-shadow: 0 0 0 1px #CCCCCC;
    color: #000000;
    display: block;
    height: 80px;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    width: 80px;
}

.decision .ctrl_container{
    display: table-cell;
    height: 80px;
    padding: 0 10px;
    text-align: center;
    transform: rotate(45deg);
    vertical-align: middle;
    width: 80px;
}

.button {
    text-align: center;
    border: 1px solid;
    margin: 5px;
}

.button:hover {
    cursor: pointer;
}

.menu_button{
    padding:5px;
}

.menu_button:hover{
    background-color:#AAAAAA;
    color:black;
}

.button_add{
    background-color: #00CC00;
    float:left;
    border-radius: 50%;
    box-shadow: 0px 3px 8px #aaa, inset 0px 2px 3px #fff;
    padding:2px;
    height:25px;
    width:25px;
    color:grey;
}

.button_add:hover{
    background-color: #00AA00;
    color:black;
}

.button_remove{
    font-size:9pt;
    color:darkgrey;
    border-radius: 30%;
    box-shadow: 0px 3px 8px #aaa, inset 0px 2px 3px #fff;
    padding:5px;
    min-width:10px;
    max-width:15px;
    text-align:center;
}

.task .button_remove{
    float:right;
}

.decision .button_remove{
    margin: auto auto;
}

.button_remove:hover{
    background-color: darkred;
    color:white;
}

.menu_button_container {
    margin: 5px;
}

.ctrl_container{
    margin:5px;
    height:40px;
}

.details_container{
    margin:5px;
    min-height:40px;
}

.detail_label{
    font-size: 9pt;
    color:grey;
}

.detail_text{
    width:80px;
    font-size: 10pt;
}

._jsPlumb_connector, ._jsPlumb_startpoint{
    cursor: pointer;
}
</style>


