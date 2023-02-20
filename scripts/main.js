function main()
{
    //check if game is being played
    let chessboard = document.querySelector("chess-board");
    if(chessboard == null || !chessboard){
        return {status:"false",error:"Cannot start chess cheat service. Please ensure you are in a game before attempting to start the service."}
    }
    //if game is being played, continue execution.
    //attempt to get color user is playing as.
    var isWhite = prompt("Are you playing as white?, answer yes or no?")
    if(isWhite.toLowerCase() == "yes"){
        player_side = "white"
    }
    else{
        player_side = "black"
    }
    const engine = new Worker("https://www.chess.com/bundles/app/js/engine/stockfish-single.830cf9cc.js")
    console.log(engine.postMessage('ucinewgame'));
    engine.onmessage = function(event){
        console.log(event)
    }
    return {status:true,"player_side":player_side}
    
}
function startHack(element)
{
    element.innerHTML = "Please Wait.."
    element.disabled = true
        //wait until chessboard content is probably loaded
        let hack = main()
        if(hack.status == true){
            element.innerHTML = `Hack running... Playing as ${hack.player_side}....`
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