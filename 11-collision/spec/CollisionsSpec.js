/*

  Requisitos:

  El objetivo de este prototipo es que se detecten colisiones entre
  varios tipos de sprites:
  
  - Los misiles tienen ahora una nueva propiedad: el da�o (damage) que
    infligen a una nave enemiga cuando colisionan con ella. Cuando un
    misil colisione con una nave enemiga le infligir� un da�o de
    cierta cuant�a (damage) a la nave enemiga con la que impacta, y
    desaparecer�.

  - Las naves enemigas tienen ahora una nueva propiedad: su salud
    (health).  El da�o ocasionado a una nave enemiga por un misil har�
    que disminuya la salud de la nave enemiga, y cuando llegue a cero,
    la nave enemiga desaparecer�.

  - cuando una nave enemiga colisione con la nave del jugador, deber�
    desaparecer tanto la nave enemiga como la nave del jugador.



  Especificaci�n:

  En el prototipo 07-gameboard se a�adi� el constructor GameBoard. El
  m�todo overlap() de los objetos creados con GameBoard() ofrece
  funcionalidad para comprobar si los rect�ngulos que circunscriben a
  los sprites que se le pasan como par�metros tienen intersecci�n no
  nula. El m�todo collide() de GameBoard utiliza overlap() para
  detectar si el objeto que se le pasa como primer par�metro ha
  colisionado con alg�n objeto del tipo que se le pasa como segundo
  par�metro.

  En este prototipo se utilizar� el m�todo collide() para detectar los
  siguientes tipos de colisiones:

    a) detectar si un misil disparado por la nave del jugador
       colisiona con una nave enemiga

    b) detectar si una nave enemiga colisiona con la nave del jugador


  En el m�todo step() de los objetos creados con PlayerMissile() y
  Enemy(), tras "moverse" a su nueva posici�n calculada, se comprobar�
  si han colisionado con alg�n objeto del tipo correspondiente. 

  No interesa comprobar si se colisiona con cualquier otro objeto,
  sino s�lo con los de ciertos tipos. El misil tiene que comprobar si
  colisiona con naves enemigas. Por otro lado, tras moverse una nave
  enemiga, �sta tiene que comprobar si colisiona con la nave del
  jugador. Para ello cada sprite tiene un tipo y cuando se comprueba
  si un sprite ha colisionado con otros, se pasa como segundo
  argumento a collide() el tipo de sprites con los que se quiere ver
  si ha colisionado el objeto que se pasa como primer argumento.

  Cuando un objeto detecta que ha colisionado con otro, llama al
  m�todo hit() del objeto con el que ha colisionado. 


  Efectos de las colisiones de un misil con una nave enemiga:

    Cuando el misil llama al m�todo hit() de una nave enemiga, pasa
    como par�metro el da�o que provoca para que la nave enemiga pueda
    calcular la reducci�n de salud que conlleva la colisi�n. Cuando
    una nave enemiga recibe una llamada a su m�todo .hit() realizada
    por un misil que ha detectado la colisi�n, la nave enemiga
    recalcula su salud reduci�ndola en tantas unidades como el da�o
    del misil indique, y si su salud llega a 0 desaparece del tablero
    de juegos, produci�ndose en su lugar la animaci�n de una
    explosi�n.

    El misil, tras informar llamando al m�tod hit() de la nave enemiga
    con la que ha detectado colisi�n, desaparece.


  Efectos de las colisiones de una nave enemiga con la nave del jugador:

    Cuando la nave del jugador recibe la llamada .hit() realizada por
    una nave enemiga que ha detectado la colisi�n, la nave del jugador
    desaparece del tablero.

    La nave enemiga, tras informar llamando a hit() de la nave del
    jugador, desaparece tambi�n.

*/

describe("Pruebas de colisiones", function(){

	var canvas, ctx;
	
	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();

		oldGame = Game;
	});

	afterEach(function(){
	        Game = oldGame;
	});

	it("misil destruye nave", function(){
		SpriteSheet = {
			map: { missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
			       enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
			       explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		}
		Game = {width: 320, height: 480};
		var enemies = {
			 basic: { x: 100, y: -50, sprite: 'enemy_ship' , health: 5 }
		};
		var gameBoard = new GameBoard();
		var missile = new PlayerMissile(100, 200);
		var enemy = new Enemy(enemies.basic,{x: 99 , y: 120});
		gameBoard.add(missile);
		gameBoard.add(enemy);
		expect(gameBoard.objects.length).toEqual(2);
		gameBoard.step(0.1);
		expect(gameBoard.removed.length).toEqual(2);//al chocar el missile se a�ade a objetos a 
		expect(gameBoard.objects.length).toEqual(1);//1 objeto queda(la explosion que se genera), el misil al chocar se borra junto al enemigo que tambi�n es eliminado
		expect(enemy.health).toEqual(-5);//le resta a 20-10(da�o del misil) = 10 (vida del enemigo restante)*
	});

	it("misil no destruye nave y desaparece", function(){
		SpriteSheet ={
			map: { enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
			       missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }}
		};
		Game = {width: 320, height: 480};
		
		var enemies = {
			 basic: { x: 100, y: -50, sprite: 'enemy_ship' , health: 60 }
		};
		OBJECT_ENEMY =  4;
		var gameBoard = new GameBoard();
		var missile = new PlayerMissile(100, 200);
		var enemy = new Enemy(enemies.basic,{x: 99 , y: 120});//enemigo que no se mueve creado en x,y de impacto 
		gameBoard.add(missile);                               //cuando pasen los 0.1 segundos
		gameBoard.add(enemy);

		gameBoard.step(0.1);
		expect(gameBoard.removed.length).toEqual(1);//al chocar el missile se a�ade a objetos a borrar
		expect(gameBoard.objects.length).toEqual(1);//1 objeto queda(enemy), el misil al chocar se borra
		expect(enemy.health).toEqual(50);//le resta a 60-10(da�o del misil) = 50 (vida del enemigo restante)
	});

	it("bola de fuego destruye nave y no desaparece", function(){
		SpriteSheet ={
			map: { enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
			       missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
			       explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		Game = {width: 320, height: 480};
		
		var enemies = {
			 basic: { x: 100, y: -50, sprite: 'enemy_ship' , health: 60 }
		};
		var gameBoard = new GameBoard();
		var fireball = new FireBall(100, 200);
		var enemy = new Enemy(enemies.basic,{x: 53 , y: 66});//enemigo que no se mueve creado en x,y de impacto 
		gameBoard.add(fireball);                               //cuando pasen los 0.1 segundos
		gameBoard.add(enemy);

		gameBoard.step(0.1);
		expect(gameBoard.removed.length).toEqual(1);//al chocar la bola elimina al enemigo y se a�ade a objetos a borrar
		expect(gameBoard.objects.length).toEqual(2);//2 objeto queda(fireball, y explosion que se genera), 
		expect(enemy.health).toEqual(-Infinity);//le resta a 60-infinito (vida del enemigo = -infinito)
	});

	it("enemigo choca con nave jugador y desaparece", function(){
		SpriteSheet ={
			map: { enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
			       missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
			       explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
			       ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 }}
		};
		Game = {width: 320, height: 480,keys: {'left': false , 'right':false, 'fire': false}};
		
		var enemies = {
			 basic: { x: 141.5, y: 328, sprite: 'enemy_ship' , E: 100 ,health: 60 }
		};
		var gameBoard = new GameBoard();
		var miNave = new PlayerShip();
		var enemy = new Enemy(enemies.basic);//enemigo que no se mueve creado en x,y de impacto 
		gameBoard.add(miNave);                               //cuando pasen los 0.1 segundos
		gameBoard.add(enemy);

		gameBoard.step(1);
		expect(enemy.x).toEqual(141.5);//coordenadas calculadas para la colision
		expect(enemy.y).toEqual(428);
		expect(gameBoard.removed.length).toEqual(2); //al colisionar se a�aden los dos para borrarlos
		expect(gameBoard.objects.length).toEqual(0); //la lista de objetos queda vac�a
	});
});
