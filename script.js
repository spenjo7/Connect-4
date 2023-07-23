const canvas = document.querySelector('canvas')

const { width, height } = canvas.getBoundingClientRect()

canvas.width = width
canvas.height = height

const ctx = canvas.getContext('2d')

const cols = 7
const rows = 6
const size = [
 Math.floor(width/cols),
 Math.floor(height/rows)
].sort()[1]



// const size = 75
// const cols = Math.floor(width/size)
// const rows = Math.floor(height/size)

let grid = []

for ( row = 0; row < rows; row++){
  for( col = 0; col < cols; col++ ){
  
    grid.push({ 
       col, 
       row, 
       x: col*size,
       y: row * size,
       color: 'white'
    })
  }
}


const paint = ( arr ) =>{
   ctx.clearRect(0,0, width, height)
   const rad = size/2
   arr.forEach( el =>{
    
   // console.log(el)
   
   ctx.beginPath()
   
   ctx.fillStyle = el.color
   ctx.arc( el.x+rad, el.y+rad, rad, 0, 2 * Math.PI )
   ctx.fill()
   ctx.rect( el.x, el.y, size, size)
   ctx.stroke()
   
   })
}


paint(grid)


let turn = 0


const checkCol = ( col, arr ) => {
   const cells = arr.filter( el => el.col === col )

   return cells

}


const availableRow = ( col, arr ) => {
  const avail = checkCol( col, arr ) 
    .filter( el => el.color != 'white')

  return (rows - avail.length -1)
}



const checkColWin = ( arr, color, col, pattern) => {
   return arr
    .filter( el => el.col === col )
    .map( el => el.color)
    .join('')
    .includes(pattern)
}


const checkRowWin = ( arr, color, row, pattern) => {
   return arr
    .filter( el => el.row === row )
    .map( el => el.color)
    .join('')
    .includes(pattern)
}

const find = ( arr, col, row) => { 
  return arr.find( el => el.col === col && el.row === row )
}


const checkDiagWin = ( arr, color, col, row, pattern, cols, rows) => {

   const sameColor = arr.filter( el => el.color === color)

  const dRight = [
     find( sameColor, col +1, row +1),
     find( sameColor, col +2, row +2),
     find( sameColor, col +3, row +3)
  ].filter( el => el )


  if (dRight.length === 3) return true

  const dLeft = [
     find( sameColor, col -1, row +1),
     find( sameColor, col -2, row +2),
     find( sameColor, col -3, row +3)
  ].filter( el => el )


   if (dLeft.length === 3) return true

   return false
}



const checkWin = ( arr, color, col, row) => {
   const pattern = [ color, color, color, color ].join('')
   
   if( checkColWin(arr, color, col, pattern) ) return true

   if( checkRowWin(arr, color, row, pattern) ) return true


  if( checkDiagWin( grid, color, col, row, pattern) ) return true

   return false
}


let gameOver = false


const winMsg = (color = null) => { 
  setTimeout( ()=> {
    if(color){
      alert( `${color} won!` )
    } else { 
      alert( 'StaleMate!' )

    }
  }, 200)
}



canvas.addEventListener('click', e => {
   if (gameOver) return null



   const { clientX, clientY } = e

   const col = Math.floor(clientX / size)
   // const row = Math.floor(clientY / size)

    const row = availableRow(col,grid)
    if( row < 0 ) return null

    let match = grid.find( el => el.col === col && el.row === row )
    if(!match) return null 

    const color = turn%2? 'red' : 'black'

   // const color = 'black' // test

   match.color = color
   paint(grid)
   turn++


   if( checkWin( grid, color, col, row )){
     gameOver = true
     winMsg( color) 
   }

   if( !grid.find( el => el.color === 'white') ){
   gameOver = true
   winMsg()
  }
})

