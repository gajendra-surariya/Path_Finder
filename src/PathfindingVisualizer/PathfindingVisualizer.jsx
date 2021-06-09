import React, { Component } from 'react';
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import {dijkstra,getShortestPathOrder} from "../algorithms/dijkstra";

let startNode_row=-1;
let startNode_col=-1;
let finishNode_row=-1;
let finishNode_col=-1;

let maxCol,maxRow;
if(window.screen.width>500){
    maxCol=50;
}else maxCol=14;
maxRow=15;


export default class PathfindingVisualizer extends Component{
    constructor(props){
        super(props);
        this.state={
            grid:[],
            mouseIsPressed:false,
            startNode:-1,
            finishNode:-1,
            message:"",
            running:false
        }
    }

    componentDidMount(){
        // let maxCol=window.screen.width,maxRow=window.screen.height;
        
        if(window.screen.width>500){
            maxCol=50;
        }else maxCol=14;
        maxRow=15;
        // if(window.screen.height>)
        console.log("row",maxRow);
        console.log("col",maxCol);
        const grid=this.initializeGrid(maxRow,maxCol);
        this.setState({grid:grid});
    }

    
    handleMouseDown(row,col){
        let {startNode,finishNode}=this.state;
        if(startNode===-1){
            this.setState({startNode:1});
            startNode_row=row;
            startNode_col=col;
            document.getElementById(`node-${startNode_row}-${startNode_col}`).className='node node-start';
        }else if(finishNode===-1 && startNode_row!==row && startNode_col!==col){
            this.setState({finishNode:1});
            finishNode_row=row;
            finishNode_col=col;
            document.getElementById(`node-${finishNode_row}-${finishNode_col}`).className='node node-finish';
        }else if(!(startNode_row===row && startNode_col===col) && !(finishNode_row===row && finishNode_col===col)) {
            
            const newGrid=this.state.grid.slice();
            const node=newGrid[row][col];
            const newNode={
                ...node,
                isWall:!node.isWall
            }
            newGrid[row][col]=newNode;
            this.setState({grid:newGrid,mouseIsPressed:true});
        }
        
    }

    handleMouseUp(){
        this.setState({mouseIsPressed:false});
    }

    handleMouseEnter(row,col){
        if(!this.state.mouseIsPressed) return;
        else if(!(startNode_row===row && startNode_col===col) && !(finishNode_row===row && finishNode_col===col)) {
            
            const newGrid=this.state.grid.slice();
            const node=newGrid[row][col];
            const newNode={
                ...node,
                isWall:!node.isWall
            }
            newGrid[row][col]=newNode;
            this.setState({grid:newGrid});
        }
    }

    animateShortestPath=(nodesInShortestPath)=>{

        for(let i=0;i<=nodesInShortestPath.length;i++){
            if(i===nodesInShortestPath.length){
                setTimeout(() => {
                    document.getElementById(`node-${startNode_row}-${startNode_col}`).className='node node-start';
                    
                }, i*50);
            }else{
                setTimeout(() => {
                    const node=nodesInShortestPath[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                      'node node-shortest-path';
                      
                }, i*50);
            }
            
        }
        // setTimeout(() => {
             
        // }, nodesInShortestPath.length*(nodesInShortestPath.length-1)*50/2);
        
        document.getElementById(`node-${finishNode_row}-${finishNode_col}`).className='node node-finish';
    }

    animateDijkstra=(visitedNodesInOrder,nodesInShortestPath)=>{
        for(let i=0;i<=visitedNodesInOrder.length;i++){
            // if(i===visitedNodesInOrder.length){
            //     setTimeout(()=>{
            //         this.animateShortestPath()
            //     })
            // }
            if(i===visitedNodesInOrder.length){

                if(nodesInShortestPath.length===0){
                    this.setState({message:"Sorry, There is no way to reach destination..."});
                    setTimeout(() => {
                        this.setState({message:""});    
                    }, 1000);
                }else{
                    setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPath);
                    }, 10*i);
                }

                
            }else{
                setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                      'node node-visited';
                  }, 10 * i);    
            }
            
            }
    }

    initializeGrid(maxRow,maxCol){
        const grid=[];
        for(let row=0;row<maxRow;row++){
            const currentRow=[];
            for(let col=0;col<maxCol;col++){
                let currentNode={
                    row,    // row number
                    col,    // column number
                    isStart:row===startNode_row && col===startNode_col,
                    isFinish:row===finishNode_row && col===finishNode_col,
                    distance:Infinity,
                    isWall:false,
                    previouNode:null,
                    isVisited:false
                }
                currentRow.push(currentNode);
            }
            grid.push(currentRow);
        }
        console.log("sunny");
        return grid;
    }
    // onClick(row,col){

    // }


    clear=()=>{
        if(!this.state.running){
            // visitedNodesInOrder,nodesInShortestPath=getShortestPathOrder;
            if(window.screen.width>500){
                maxCol=50;
            }else maxCol=14;
            for(let row=0;row<15;row++){
                for(let col=0;col<maxCol;col++){
                    document.getElementById(`node-${row}-${col}`).className='node';
                }
            }

            startNode_row=-1;
            startNode_col=-1;
            // document.getElementById(`node-${finishNode_row}-${finishNode_col}`).className='node';
            finishNode_row=-1;
            finishNode_col=-1;
            const newGrid=this.initializeGrid(maxRow,maxCol);
            console.log("grids",newGrid);
            // document.getElementById(`node-${startNode_row}-${startNode_col}`).className='node';
            
            this.setState({grid:newGrid,startNode:-1,finishNode:-1,message:""});    
        }else{
            // let msg=;
            this.setState({message:"Algo is running, please wait ..."});
            setTimeout(() => {
                this.setState({message:"",running:false});
            }, 2000);
        }
        
    }

    visualiseDijkstra=()=>{
        this.setState({running:true});
        let {startNode,finishNode}=this.state;
        if(startNode!==-1 && finishNode!==-1){
            const {grid}=this.state;
            const startNode=grid[startNode_row][startNode_col];
            const finishNode=grid[finishNode_row][finishNode_col];
            const visitedNodesInOrder=dijkstra(grid,startNode,finishNode);
            const nodesInShortestPath=getShortestPathOrder(finishNode);
            
            // console.log("s",nodesInShortestPath);
            this.animateDijkstra(visitedNodesInOrder,nodesInShortestPath);
        }else{
            this.setState({message:"please select starting and final point both..."});
            setTimeout(() => {
                this.setState({message:""});    
            }, 2000);
        }
        
    }

    render(){
        const {grid}=this.state;
        console.log("grid",this.state.grid);
        return(
            <div>
                <div className="header">
                    PathFinder
                </div>
                <div className="message">
                    <span >by Gajendra Surariya</span>
                    {this.state.message}
                </div>
                <div className="instruction">
                    1) First select the initial and final destination.<br/><br/>
                    2) Then select the walls (optional).<br/><br/>
                    3) Start being the "Doraa the Explorer".<br/><br/>
                </div>
                <div className="buttons">
                    <button onClick={()=>this.visualiseDijkstra()} style={{margin:"5px"}}>find route</button>
                    <button onClick={()=>this.clear()} style={{margin:"5px"}}>clear</button>
                </div>
                {/* <div className="header">
                    {this.state.message}
                </div> */}
                <div className='grid'>
                    {grid.map((row,rowIndx)=>{
                        return(
                            <div key={rowIndx}>
                                {
                                    row.map((node,nodeIndx)=>{
                                        const {isStart,isFinish,isVisited,row,col,isWall}=node
                                        return<Node 
                                                key={nodeIndx}
                                                isStart={isStart}
                                                isFinish={isFinish}
                                                test={'foo'}
                                                col={col}
                                                isWall={isWall}
                                                mouseIsPressed={this.state.mouseIsPressed}
                                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                onMouseEnter={(row, col) =>
                                                    this.handleMouseEnter(row, col)
                                                }
                                                onMouseUp={() => this.handleMouseUp()}
                                                row={row}
                                                isVisited={isVisited}
                                            ></Node>
                                    })
                                }
                            </div>
                        );
                    
                    })}
                </div>
            </div>
        )
    }
}