/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
           Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
 Ejemplo:
         [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/
describe("pruebas de niveles",function(){
	var canvas, ctx;
	var gameboard;
	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
		gameBoard = new GameBoard();
		oldGame = Game;
	});

	afterEach(function(){
		
	        Game = oldGame;
	});

	it("crear nivel",function(){
		var level1 = [
  			//  Comienzo, Fin,   Frecuencia,  Tipo,       Override
 			   [ 0,        4000,  500,         'mienemigo'                 ],
   			   [ 6000,     13000, 800,         'ltr'                  ],
    			   [ 22000,    25000, 400,         'wiggle',   { x: 100 } ]
		];
		var nivel = new Level(level1, winGame);
		expect(nivel.levelData.length).toEqual(3);
		expect(nivel.callback).toBe(winGame);
	});

	it("step y pasar de nivel",function(){
		var gameBoard= new GameBoard();
		SpriteSheet = {
			map: { enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
			       enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 }}
			//solo añado enemy_bee(sprite de mienemigo) y enemy_purple(sprite ltr) porque step(7) solo da tiempo 
			//a crear enemigos del tipo mienemigo y ltr
		}
		var level1 = [
  			//  Comienzo, Fin,   Frecuencia,  Tipo,       Override
 			   [ 0,        4000,  500,         'mienemigo'            ],
   			   [ 6000,     13000, 800,         'ltr'                  ],
    			   [ 22000,    25000, 400,         'wiggle',   { x: 100 } ]
		];
		
		var nivel = new Level(level1, winGame);

		gameBoard.add(nivel);

		expect(nivel.levelData.length).toEqual(3);
		expect(nivel.callback).toBe(winGame);
		spyOn(nivel.board,"add");
		spyOn(nivel,"callback");
		nivel.step(7);
		expect(nivel.levelData.length).toEqual(2); //como el tiempo es mayor que 4000 los "mienemigo" se borran de leveldata
		expect(nivel.board.add).toHaveBeenCalled();//llama a add con el enemigo "ltr"
		
		nivel.board.cnt[OBJECT_ENEMY] = 0;
		nivel.step(26);
		
		expect(nivel.callback).toHaveBeenCalled();
	});



	it("después de nivel 1 aparece el 2",function(){
		//SpriteSheet.load(sprites,startGame);
	});

});
