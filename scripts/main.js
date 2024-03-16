function main()
{
    //check if game is being played
    const boardElement = document.querySelector('.board');
    //i dont really know why i chose to lookup the board using the tagName instead of the classname when they are probably always going to be the same.
    const elementName = boardElement.tagName;
    let chessboard = document.querySelector(elementName);
    if(chessboard == null || !chessboard){
        return {status:"false",error:"Cannot start chess cheat service. Please ensure you are in a game before attempting to start the service."}
    }
    var player_colour = prompt("Are you playing as white or black?")
    while(player_colour != "white" && player_colour !="black"){
        player_colour = prompt("Are you playing as white or black?")
    }
    player_colour = player_colour.split("")[0]
    //generate FEN string from board,
    function getFenString()
    {
        let fen_string = ""
        for(var i =8;i>=1;i--){
            for(var j=1;j<=8;j++){
                let position = `${j}${i}`
                //for every new row on the chessboard
                if(j == 1 && i != 8){
                    fen_string+= "/"
                }
                let piece_in_position = document.querySelectorAll(`.piece.square-${position}`)[0]?.classList ?? null
                //get piece name by shortest class
                if(piece_in_position != null){
                    for(var item of piece_in_position.values()){
                        if(item.length == 2){
                            piece_in_position = item
                        }
                    }
                }
                //if position is empty
                if(piece_in_position == null){
                    //if previous position is empty, sum up numbers
                    let previous_char = fen_string.split("").pop()
                    if(!isNaN(Number(previous_char))){
                        fen_string = fen_string.substring(0,fen_string.length-1)
                        fen_string += Number(previous_char)+1
                    }
                    else{
                        fen_string+="1"
                    }
                }
                else if(piece_in_position?.split("")[0] == "b"){
                    fen_string+=piece_in_position.split("")[1]
                }
                else if(piece_in_position?.split("")[0] == "w"){
                    fen_string+=piece_in_position.split("")[1].toUpperCase()
                }
            
            }
        }
        return fen_string
    }
    let fen_string = getFenString()
    fen_string += ` ${player_colour}`
    console.log(fen_string)
    const engine = new Worker("/bundles/app/js/vendor/jschessengine/stockfish.asm.1abfa10c.js")
    engine.postMessage(`position fen ${fen_string}`)
    engine.postMessage('go wtime 300000 btime 300000 winc 2000 binc 2000');
    engine.postMessage("go debth 99")
    //listen for when moves are made 
    setInterval(()=>{
        let new_fen_string = getFenString()
        new_fen_string += ` ${player_colour}`
        if(new_fen_string != fen_string){
            fen_string = new_fen_string
            engine.postMessage(`position fen ${fen_string}`)
            engine.postMessage('go wtime 300000 btime 300000 winc 2000 binc 2000');
            engine.postMessage("go debth 99")
        }
    })
    engine.onmessage = function(event){
        if (event.data.startsWith('bestmove')) {
            const bestMove = event.data.split(' ')[1];
            // Use the best move in your application
            char_map = {"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8}
            console.log('Best move:', bestMove);
            document.getElementById("best-move").innerHTML = ` Bestmove is ${bestMove}`
            //create cheat squares on the board
            previous_cheat_squares = document.querySelectorAll(".cheat-highlight").forEach((element)=>{
                //remove all previous cheat squares
                element.remove()
            })
            bestMove_array = bestMove.split("")
            initial_position = `${char_map[bestMove_array[0]]}${bestMove_array[1]}`
            final_position = `${char_map[bestMove_array[2]]}${bestMove_array[3]}`
            
            initial_highlight = document.createElement("div");
            initial_highlight.className = `highlight cheat-highlight square-${initial_position}`
            initial_highlight.style = "background:red;opacity:0.5"

            final_highlight = document.createElement("div");
            final_highlight.className = `highlight cheat-highlight square-${final_position}`
            final_highlight.style = "background:red;opacity:0.5"
            document.querySelector("wc-chess-board").appendChild(initial_highlight)
            document.querySelector("wc-chess-board").appendChild(final_highlight)
          }
    }
    //listen for new moves
    return {status:true}
    
}
function startHack(element)
{
    element.innerHTML = "Please Wait.."
    element.disabled = true
        //wait until chessboard content is probably loaded
        let hack = main()
        if(hack.status == true){
            element.innerHTML = `Hack running. <span id = 'best-move'>Calculating Best move..</span>`
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