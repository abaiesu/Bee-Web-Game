"use strict";

const body = document.querySelector("body");

let projectiles = []; // Set of circles and their x-coordinates
let obstacles = []; //Set of obstacles, their x-coordinates and their life status
const proj_radius = 10;  // Radius of the projectile
const obstacle_width = 70;
const player = document.querySelector('.player');
const start = document.querySelector('.start');
const end = document.querySelector('.container');
const restart = document.querySelector('.restart');
const death_sound = document.getElementById('death_sound');
const levelDisplay = document.getElementById('level'); 
const killedDisplay = document.getElementById('killed'); 
const levelbar = document.querySelector('.levelbar');
const howtoplay = document.getElementById('rules');
const gotit = document.getElementById('gotit');
const allexp = document.getElementById('all-exp');


let animationId;
let level = 1;
let killed = 0;

start.addEventListener('click', startGame);
restart.addEventListener('click', restartGame);
howtoplay.addEventListener('click', HowtToPlay);
gotit.addEventListener('click', GotIt);

function HowtToPlay(event){
  allexp.style.display = 'block';
  howtoplay.style.display = 'none';
  start.style.display = 'none';
}

function GotIt(event){
  allexp.style.display = 'none';
  howtoplay.style.display = 'block';
  start.style.display = 'block';
  
}


function levels(){
    
    levelbar.style.display= 'block';
    levelDisplay.textContent = level.toString(); //show the level
    if (player_collision_check() == 1){
      return
    }
    level ++;

    setTimeout(levels, 8000)
}

function init(){
  projectiles = []; // Set of circles and their x-coordinates
  obstacles = []; //Set of obstacles, their x-coordinates and their life status
  death_sound.currentTime = 0;
  level = 1;
  killed = 0;
}

function startGame(event){
  document.addEventListener('click', createProj);
  animation();
  document.addEventListener('mousemove', mouseMoveAction );
  start.style.display = 'none';
  howtoplay.style.display = 'none';
  createObs();
  levels(); //updates level
}

function restartGame(event){
  const death_sound = document.getElementById('death_sound');
  death_sound.pause();
  for (let n=0; n < obstacles.length;n++){
    const e = obstacles[n];
    body.removeChild(e.element);
  }

  for (let m=0; m < projectiles.length;m++){
    const f = projectiles[m];
    body.removeChild(f.element);
  }

  init();
  document.addEventListener('click', createProj);
  animation();
  document.addEventListener('mousemove', mouseMoveAction );
  end.style.display = 'none';
  player.src = 'bee1.png';
  movebee()
  movespi()
  createObs();
  levels();
  killedDisplay.textContent = killed.toString(); //show the killed
}

function pulse_start(button){
  if( button.style.color == "black"){
    button.style.color = "gray";
  }
  else {
    button.style.color = "black";
  }

  setTimeout(pulse_start, 500, button);

}

function player_collision_check(){
  for(let i=0; i < obstacles.length; i++){
    const obs = obstacles[i];
    const player_pos = player.getBoundingClientRect();
    const h_dist_front = Math.abs(player_pos.x - obs.x) - 100;
    const h_dist_back = Math.abs(player_pos.x - obs.x) - 70;
    const v_dist = Math.abs(player_pos.y - obs.y);
    if ( (h_dist_front < 1 || h_dist_back < 1) && v_dist < obstacle_width/2){
      setTimeout(() => {
        death_sound.volume = 0.2;
        death_sound.play();
        document.removeEventListener('click', createProj);
        document.removeEventListener('mousemove', mouseMoveAction );
        player.src = 'images/beeD.png';
        end.style.display = 'block';

      }, 0 )
      return 1;
    }
  }
}

function mouseMoveAction(event) {

  if (player_collision_check() == 1){
    return
  }

  const x = event.clientX;
  const y = event.clientY;
  const width = player.width;
  const height = player.height;

  player.style.transform = `translate(${x - width/2}px, ${y - height/2}px)`;
}

function play(audio) {
  if (audio.paused) {
      audio.play();
  }else{
      audio.currentTime = 0;
  }
}

function createProj(event) {
  const proj_sound = document.getElementById('projectile_sound');
  play(proj_sound);

  // Create a new circle where the user clicks
  const x0 = event.clientX-proj_radius;
  const y0 = event.clientY-proj_radius;

  const projElement = document.createElement("div");
  projElement.classList.add('proj');
  projElement.style = `top:${y0}px; left:${x0}px;`;

  body.appendChild(projElement);
  // Store this circle and its y coordinate in an array
  projectiles.push( { element: projElement, x: x0, y:y0 } );
}

function p_motion() {

  // Translate all circles in y direction
  for (let k=0; k<projectiles.length; k++) {
    const e = projectiles[k];
    e.x = e.x + 5;
    e.element.style.left = `${e.x}px`;
  }
    // Remove useless discs
  for(let k=0; k<projectiles.length; k++) {
    const e = projectiles[k];
    if( e.x> window.innerWidth ) // Assume that window will not be heigher than 800px (could use viewport instead)
    {
      body.removeChild(e.element);
      projectiles.splice(k,1);	// Slice removes existing elements at a specific position k. The second parameter of splice is the number of elements to remove
    }
  }
}

function createObs(event) {

  if (player_collision_check() == 1){
    return
  }

  // Create a new obstacles randomly
  const y0 = Math.floor(Math.random() * window.innerHeight);
  const x0 =  window.innerWidth - obstacle_width ;

  const obstacleElement = document.createElement("img"); //before it was div
  obstacleElement.classList.add('insect');
  obstacleElement.src = `spi1.png`;
  obstacleElement.style = `top:${y0}px; left:${x0}px;`;

  body.appendChild(obstacleElement);
  // Store this circle and its y coordinate in an array
  obstacles.push( { element: obstacleElement, x: x0, y : y0} );

  setTimeout(createObs, 700 - (level-1)*30);

}

function o_motion() {

  // Translate all circles in y direction
  for (let k=0; k<obstacles.length; k++) {
    const e = obstacles[k];
    e.x = e.x - level;
    e.element.style.left = `${e.x}px`;
  }
    // Remove useless discs
  for(let k=0; k<obstacles.length; k++) {
    const e = obstacles[k];
    if( e.x < - obstacle_width ) 
    {
      body.removeChild(e.element);
      obstacles.splice(k,1);	// Slice removes existing elements at a specific position k. The second parameter of splice is the number of elements to remove
    }
  }
}

function collision_check(){
  for(let i=0; i < obstacles.length; i++){
    for (let j = 0; j < projectiles.length; j++){
      const obs = obstacles[i];
      const proj = projectiles[j];
      const h_dist = Math.abs(proj.x - obs.x);
      const v_dist = Math.abs(proj.y - obs.y);
      if (h_dist - proj_radius < 1 && v_dist < obstacle_width/2){
        setTimeout(() => {
          obstacles.splice(i,1);
          projectiles.splice(j, 1);
          obs.element.style.display = 'none';
          proj.element.style.display = 'none';
          const coll_sound = document.getElementById('collision_sound');
          play(coll_sound);
        }, 0 )
        killed ++;
        killedDisplay.textContent = killed.toString(); //show the killed
      }
    }
  }
}

function animation(currentTime) {

  animationId = requestAnimationFrame(animation);

  if (player_collision_check() == 1){
    cancelAnimationFrame(animationId);
  }

  p_motion();
  o_motion();
  collision_check();
  player_collision_check();
}

function movebee(){
  if( player.src.endsWith('bee1.png') ) {
    player.src = 'images/bee2.png';
  }
  else {
    player.src = 'images/bee1.png';
  }

  if (player_collision_check() == 1){
    return
  }

  setTimeout(movebee, 200);
}

function movespi(){
  for (let k = 0; k<obstacles.length;k++){
    const spider = obstacles[k];
    if(spider.element.src.endsWith('spi1.png') ) {
      spider.element.src = 'images/spi2.png';
    }
    else {
      spider.element.src = 'images/spi1.png';
    }
  
  }

  if (player_collision_check() == 1){
    return
  }

  setTimeout(movespi, 100);
}

movebee()
movespi()
pulse_start(start)
pulse_start(restart)
