import React,{Component} from 'react';
import './Node.css';

export default class Node extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    
    render(){
        const {
            isStart,
            isFinish,
            isVisited,
            row,
            col,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            // onClick
        }=this.props;
        const extractClassName=isFinish?'node-finish'
                                :isStart?'node-start'
                                :isWall?'node-wall':'';
        return <div 
        id={`node-${row}-${col}`}
        className={`node ${extractClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        // onClick={()=>onClick(row,col)}
        ></div>
    }
    
}