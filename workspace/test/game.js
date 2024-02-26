// MyCanvas 영역
let canvas = $("#myCanvas")[0];
let ctx = canvas.getContext("2d");
let w = $("#myCanvas").width();
let h = $("#myCanvas").height();

// 뱀과 먹이의 크기
let sq = 15;
let food;
let snake = [];

// 게임 시작 후 처음 움직이는 방향설정
let d = "RIGHT";

let currentScore = 0;
// 먹이의 위치를 랜덤으로 추출
function placeFood() {
  food = {
    // 해당 영역의 너비만큼 sq의 길이를 빼준다
    x: Math.round((Math.random() * (w - sq)) / sq),
    y: Math.round((Math.random() * (h - sq)) / sq),
  };
}

// 뱀의 위치를 랜덤으로 추출
function createSnake() {
  snake = []; // snake을 배열로 초기화
  snake.push({
    x: Math.round((Math.random() * (w - sq)) / sq),
    y: Math.round((Math.random() * (h - sq)) / sq),
  });
  currentScore = -10; // 점수 초기화
  final = 0;
  updateScore();
}

// 스네이크와 먹이를 그리는 함수
function paint() {
  // 캔버스 지우기
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  // 뱀 그리기
  for (let i = 0; i < snake.length; i++) {
    let s = snake[i];
    paint_cell(s.x, s.y, "green");
  }

  // 먹이 그리기
  paint_cell(food.x, food.y, "red");
}

// 위치에 맞춰 색을 넣어준다.
function paint_cell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * sq, y * sq, sq, sq);
  ctx.strokeStyle = "white";
  ctx.strokeRect(x * sq, y * sq, sq, sq);
}

// 먹이와 뱀의 초기 위치 설정 및 그리기
createSnake();
placeFood();
paint();
updateScore();

// 키보드 입력 처리 함수
$(document).keydown(function (e) {
  let key = e.which;
  if (key === 37 && d !== "RIGHT") d = "LEFT";
  else if (key === 38 && d !== "DOWN") d = "UP";
  else if (key === 39 && d !== "LEFT") d = "RIGHT";
  else if (key === 40 && d !== "UP") d = "DOWN";
});

// 게임 업데이트 함수
function update() {
  // 뱀의 머리 위치 결정
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (d === "RIGHT") headX++;
  else if (d === "LEFT") headX--;
  else if (d === "UP") headY--;
  else if (d === "DOWN") headY++;

  // 게임 오버 조건 검사
  if (
    headX >= w / sq ||
    headX < 0 ||
    headY >= h / sq ||
    headY < 0 ||
    collision(headX, headY, snake)
  ) {
    clearInterval(gameLoop);
    // 최종 점수를 게임 오버 화면에 업데이트
    $("#final").text(currentScore);
    // 게임 오버 화면을 표시
    $("#gameover").show();

    // food와 snake의 위치를 최초 세팅
    createSnake();
    placeFood();
    d = "RIGHT";
    Score = 0;
    updateScore(); // 점수 초기화
    gameLoop = setInterval(update, 100);
    return;
  }

  let tail;
  if (headX === food.x && headY === food.y) {
    tail = { x: headX, y: headY };
    placeFood();
    updateScore();
  } else {
    tail = snake.pop();
    tail.x = headX;
    tail.y = headY;
  }

  snake.unshift(tail);

  paint();
}

// 먹이와 뱀이 충돌하는지 검사
function collision(x, y, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].x === x && array[i].y === y) return true;
  }
  return false;
}

// 게임 업데이트 주기 설정
let gameLoop = setInterval(update, 100);

// 점수 업데이트 함수
function updateScore() {
  $("#currentScore").text(currentScore);
  currentScore += 10;
}
