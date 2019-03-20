<template>
  <el-container class="container" id="work-container">
    <el-aside width="200px">
      <div class="box-card">
        <div class="header">Flowchart</div>
        <div class="card-body">

          <div class="item" v-for="(item) in list" :key="item" >
            
<form action="/action_page.php">
            <i class="chart-item" :class="item" :data-key="item" style="color:red;"> </i>
     <input type="text" name="lastname" value="Mouse">
     </form> 
          </div>
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="workplace" id="workplace">
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
      list: ["circle", "diamond", "ellipse", "rectangle"]
    };
  },
  mounted() {
    jsPlumb.ready(function() {
    
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
        stroke: "#61B7CF",
        joinstyle: "round",
        outlineStroke: "white",
        outlineWidth: 2
      };
     
      let connectorHoverStyle = {
        strokeWidth: 3,
        stroke: "#216477",
        outlineWidth: 5,
        outlineStroke: "white"
      };
      let endpointHoverStyle = {
        fill: "#216477",
        stroke: "#216477"
      };
      
      let sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
          stroke: "#7AB02C",
          fill: "transparent",
          radius: 7,
          strokeWidth: 1
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
        paintStyle: { fill: "#7AB02C", radius: 7 },
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
        // console.log(toId, sourceAnchors, targetAnchors);

        for (var i = 0; i < sourceAnchors.length; i++) {
          var sourceUUID = toId + sourceAnchors[i];
          instance.addEndpoint(toId, sourceEndpoint, {
            anchor: sourceAnchors[i],
            uuid: sourceUUID
            
          });
            var connections = [];
         $.each(instance.getAllConnections(), function (idx, connection) {
          connections.push({
              connectionId: connection.id,
              pageSourceId: connection.sourceId,
              pageTargetId: connection.targetId
          });
          });

        console.log(util.inspect(connections));

        }
        for (var j = 0; j < targetAnchors.length; j++) {
          var targetUUID = toId + targetAnchors[j];
          instance.addEndpoint(toId, targetEndpoint, {
            anchor: targetAnchors[j],
        
            uuid: targetUUID
          });
        }
      };
// console.log(conn.id);
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

        //this is the connection when i Dragged
        instance.bind("connectionDragStop", function(connection) {
          console.log("connection " + connection.id + " was dragged");
        });
        //this is the connection when i removed and create the new Connection 

        instance.bind("connectionMoved", function(params) {
          // console.log("connection " + params.connection.id + " was moved");
        });
                // console.log(util.inspect(connection))
 

      });
       
       let randomNumber=function(){
      return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }
    console.log(randomNumber);
      $(".box-card .chart-item").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container")
      });
      $("#workplace").droppable({
        scope: "plant",
        drop: function(ev, ui) {
     
          let id = "item" + new Date().getTime();

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
</style>


