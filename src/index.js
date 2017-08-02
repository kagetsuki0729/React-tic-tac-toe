import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
function Square(props) {
  if(props.colored){
    return (
      <button className="square" onClick={()=>props.onClick()} style={{background:"red",color:'yellow'}}>
        {props.value}
      </button>
    );
  }
  return (
      <button className="square" onClick={()=>props.onClick()}>
        {props.value}
      </button>
    );
}

const constBoardSize=3;

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} colored={this.props.squaresColored[i]} onClick={()=> this.props.onClick(i)} />;
  }

  render() {
    var board=[],cell=[];
    for(var i=0;i<constBoardSize;i++){
      for(var j=0;j<constBoardSize;j++)
          cell.push(this.renderSquare(i*constBoardSize+j));
      board.push(<div className="board-row">{cell}</div>);
      cell=[];
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state={
      boardSize:constBoardSize,
      history:[{
        squares:Array(constBoardSize*constBoardSize).fill(null),
        squaresColored:Array(constBoardSize*constBoardSize).fill(false),
        xCoor:null,
        yCoor:null,
      }],
      xIsNext:true,
      stepNumber:0,
      moveListAscend:true,      
    };
    this.handleClick=this.handleClick.bind(this);
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const squaresColored=current.squaresColored.slice();
    if (calculateWinner(squares,squaresColored) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squaresColored:squaresColored,
        xCoor:i%3+1,
        yCoor:Math.floor(i/3)+1,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber:history.length,    
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  restart(){
    this.setState({
      history:[{
        squares:Array(constBoardSize*constBoardSize).fill(null),
        squaresColored:Array(constBoardSize*constBoardSize).fill(false),
        xCoor:null,
        yCoor:null,
      }],
      xIsNext:true,
      stepNumber:0,
    });
  }
  sortToggle(){
    this.setState({
      moveListAscend:!this.state.moveListAscend,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares,current.squaresColored);
    const moves = history.map((step, move) => {
      const desc = move ? 'Move (' + history[move].xCoor+','+history[move].yCoor+')' : 'Game start';
      return (
        <li key={move}>
          <a href={'#'+move} onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board            
            squares={current.squares}
            squaresColored={current.squaresColored}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button style={{height:20,width:70}} onClick={()=>this.restart()}>Restart</button><br />
          <button style={{height:20,width:80}} onClick={()=>this.sortToggle()}>List Order</button>
          {
            this.state.moveListAscend?<ol>{moves}</ol>:<ol>{moves.reverse()}</ol>
          }
        </div>                
      </div>
    );
  }
}

function calculateWinner(squares,squaresColored) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {        
        for(var j=0;j<lines[0].length;j++)
          squaresColored[lines[i][j]]=true;
        return squares[a];
      }
    }
    return null;
  }
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
