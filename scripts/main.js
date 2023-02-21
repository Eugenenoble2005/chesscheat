function main()
{
    //check if game is being played
    let chessboard = document.querySelector("chess-board");
    if(chessboard == null || !chessboard){
        return {status:"false",error:"Cannot start chess cheat service. Please ensure you are in a game before attempting to start the service."}
    }
    //if game is being played, continue execution.
    //generate FEN string from board,
    let fen_string = ""
    for(var i =8;i>=1;i--){
        for(var j=1;j<=8;j++){
            let position = `${j}${i}`
            if(j == 1 && i != 8){
                fen_string+= "/"
            }
            let piece_in_position = document.querySelectorAll(`.square-${position}`)[0]?.classList[1] ?? null
            if(piece_in_position == null){
                fen_string+="1"
            }
            else if(piece_in_position?.split("")[0] == "b"){
                fen_string+=piece_in_position.split("")[1]
            }
            else if(piece_in_position?.split("")[0] == "w"){
                fen_string+=piece_in_position.split("")[1].toUpperCase()
            }
        }
    }
    console.log(fen_string)
    // const engine = new Worker("/bundles/app/js/vendor/jschessengine/stockfish.asm.1abfa10c.js")
    // engine.postMessage('ucinewgame');
    // engine.postMessage('go movetime 1000');
    // engine.onmessage = function(event){
    //     const message = event.data;
    //     if (message.startsWith('bestmove')) {
    //         const bestMove = message.split(' ')[1];
    //         console.log(`The next best move is ${bestMove}`);
    //     }
    // }
    return {status:true}
    
}
function startHack(element)
{
    element.innerHTML = "Please Wait.."
    element.disabled = true
        //wait until chessboard content is probably loaded
        let hack = main()
        if(hack.status == true){
            element.innerHTML = `Hack running`
        }
        else{
            element.innerHTML = "Start Hack"
            element.disabled = false
            alert(hack.error)
        }
}
var button = document.createElement("button");
button.className = "ui_v5-button-component ui_v5-button-primary ui_v5-button-large ui_v5-button-full"
button.innerHTML = "Start Hack"
//start hack when button is clicked
button.onclick = ()=>{startHack(button)}
let main_body = document.querySelector(".board-layout-main")
main_body.prepend(button)