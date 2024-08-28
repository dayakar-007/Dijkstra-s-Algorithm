import React, { useState, useRef, useEffect } from 'react';
import './Cricle.css';

const Cricle = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isAddingEdges, setIsAddingEdges] = useState(false);
  const [tempEdgeNodes, setTempEdgeNodes] = useState([]);
  const [dist, setDist] = useState([]);
  const drawingAreaRef = useRef(null);
  const [msg,setMsg]=useState("Click to create a node ")

  useEffect(() => {
    // Reset distance matrix whenever nodes change
    if (nodes.length > 1) {
      const newDist = Array(nodes.length).fill(-1).map(() => Array(nodes.length).fill(-1));
      setDist(newDist);
    }
  }, [nodes]);

  const handleAddEdges = () => {
    if (nodes.length < 2) {
      alert("Create at least two nodes to add an edge");
      return;
    }
    setIsAddingEdges(true);
    setMsg("Edges can be added by clicking one node and then other node")
  };

  const handleDrawingAreaClick = (e) => {
    if (isAddingEdges) return;
    const rect = drawingAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (nodes.length >= 12) {
      alert("Cannot add more than 12 vertices");
      return;
    }

    setNodes([...nodes, { x, y, id: nodes.length }]);
  };

  const handleNodeClick = (node) => {
    if (!isAddingEdges) return;
    
    
    setTempEdgeNodes([...tempEdgeNodes, node]);
    console.log(tempEdgeNodes.length);

    if (tempEdgeNodes.length === 1) {
      const startNode = tempEdgeNodes[0];
    
      drawEdge(startNode,node);
      setTempEdgeNodes([]);
    }
    console.log("click two nodes")
   
  };

  const drawEdge = (startNode, endNode) => {
    if (startNode.id === endNode.id) return; // Prevent drawing edges between the same node
    
    const len = Math.sqrt((startNode.x - endNode.x) ** 2 + (startNode.y - endNode.y) ** 2);
    const newEdge = { startNode, endNode, length: Math.round(len / 10) };

    setEdges([...edges, newEdge]);
    const updatedDist = [...dist];
    updatedDist[startNode.id][endNode.id] = Math.round(len / 10);
    updatedDist[endNode.id][startNode.id] = Math.round(len / 10);
    
    setDist(updatedDist);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setDist([]);
    setIsAddingEdges(false);
    setMsg("Click to create a node ")
  };
  const shortestPath=(x)=>
  {
    let disit=x;
    let dis=[];
    let visit=[];
    let parent=[];
    let len=disit.length;
    for(let i=0;i<len;i++)
    {
      dis[i]=Infinity;
      visit[i]=false;
      parent[i]=-1;
    }
    //By default 0 is source node
    dis[0]=0;
    for(let i=0;i<len-1;i++)
    {
    let u=minDist(dis,visit);
    visit[u]=true;
    for(let v=0;v<len;v++)
    {
      if(!visit[v] && disit[u][v]!==-1 && dis[u]!==Infinity && dis[u]+disit[u][v]<dis[v])
      {
        dis[v]=dis[u] +parseInt((dist[u][v]));
        parent[v]=u;
      }
    }
    }
    console.log(dis);
    console.log(parent);
    highlightShortestPath(parent,dist);
    
  }
  const minDist=(dis,visit)=>
  {
    let idx=-1;
    let val=Infinity;
    for(let i=0;i<visit.length;i++)
    {
      if(!visit[i] && dis[i]<=val)
      {
        val=dis[i];
        idx=i;
      }

    }
    
    return idx;
  }
  const highlightShortestPath = (parent,dist) => {
    let pathEdges = [];
    for (let i = 1; i < parent.length; i++) {
      if (parent[i] !== -1) {
        const startNode = nodes[parent[i]];
        const endNode = nodes[i];
        pathEdges.push({startNode,endNode, length:dist[startNode.id][endNode.id]});
      }
    }
    
    setEdges(pathEdges);
  }

  return (
    <div className="graph-drawing-container">
      <div className="controls">
        <button onClick={handleAddEdges} disabled={isAddingEdges || nodes.length < 2}>Add Edges</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={()=>shortestPath(dist)}>Run</button>
      </div>
      <div className="drawing-area" ref={drawingAreaRef} onClick={handleDrawingAreaClick}>
        <p>{msg}</p>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="node"
            style={{ top: node.y, left: node.x }}
            onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
          >
            {node.id}
          </div>
        ))}
        {edges.map((edge, index) => (
          <Line key={index} startNode={edge.startNode} endNode={edge.endNode} length={edge.length} dist={dist} setDist={setDist}/>
        ))}
      </div>
      
    </div>
  );
};

const Line = ({ startNode, endNode, length,dist,setDist}) => {
  const [weight,setWeight]=useState(length);
  const x1 = startNode.x;
  const y1 = startNode.y;
  const x2 = endNode.x;
  const y2 = endNode.y;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const transform = `rotate(${angle}rad)`;
  const handleWeight=(e)=>
  {
    const updatedDist = [...dist];
    updatedDist[startNode.id][endNode.id]=e.target.value;
    updatedDist[endNode.id][startNode.id]=e.target.value;
    setDist(updatedDist);
    setWeight(e.target.value);
    console.log(dist)
  }

  return (
    <div
      className="line"
      style={{
        width: length * 10,
        top: y1,
        left: x1,
        transform,
        transformOrigin: '0 0',
      }}
    >
    <div className="edge-weight">
      <input  className="weight"type="number" value={weight} onChange={handleWeight}></input>
    </div>
    </div>
  );
};

export default Cricle;
