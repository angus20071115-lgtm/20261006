// 宣告目前題目索引。
let currentQuestion = 0;

// 宣告答對題數。
let correctCount = 0;

// 宣告目前是否已作答。
let hasAnswered = false;

// 宣告測驗是否完成。
let quizFinished = false;

// 宣告使用者選擇的選項。
let selectedOption = -1;

// 宣告畫布。
let canvas;

// 宣告操作按鈕。
let actionButton;

// 宣告所有選項的點擊區域。
let optionAreas = [];

// 設定正確答案背景顏色。
const CORRECT_COLOR = "#80ed99";

// 設定錯誤答案背景顏色。
const WRONG_COLOR = "#ffadad";

// 設定一般選項背景顏色。
const OPTION_COLOR = "#ffffff";

// 建立五題高中數學題目。
const questions = [
  {
    question: "若 f(x) = 2x + 3，則 f(4) 等於多少？",
    options: ["7", "8", "11", "12"],
    answer: 2
  },
  {
    question: "方程式 x² - 5x + 6 = 0 的兩根和為多少？",
    options: ["2", "3", "5", "6"],
    answer: 2
  },
  {
    question: "等差數列 3、7、11、15、⋯ 的第 10 項為多少？",
    options: ["35", "39", "43", "47"],
    answer: 1
  },
  {
    question: "若 sin θ = 1/2，且 θ 為銳角，則 θ 等於多少？",
    options: ["30°", "45°", "60°", "90°"],
    answer: 0
  },
  {
    question: "向量 a = (2, 3)，向量 b = (1, -1)，則 a · b 等於多少？",
    options: ["-1", "1", "5", "6"],
    answer: 0
  }
];

// p5.js 初始化函式。
function setup() {
  // 建立全螢幕畫布。
  canvas = createCanvas(windowWidth, windowHeight);

  // 設定畫布為固定定位。
  canvas.style("position", "fixed");

  // 設定畫布左上角位置。
  canvas.style("left", "0");

  // 設定畫布頂端位置。
  canvas.style("top", "0");

  // 設定畫布顯示層級。
  canvas.style("z-index", "0");

  // 設定畫布為區塊元素。
  canvas.style("display", "block");

  // 防止手機觸控時捲動畫面。
  canvas.elt.style.touchAction = "none";

  // 移除網頁預設外距。
  document.body.style.margin = "0";

  // 隱藏網頁捲軸。
  document.body.style.overflow = "hidden";

  // 設定網頁背景顏色。
  document.body.style.backgroundColor = "#f1f5f9";

  // 設定中文字型。
  textFont("Arial, Noto Sans TC, sans-serif");

  // 建立唯一操作按鈕。
  actionButton = createButton("下一題");

  // 將按鈕加入網頁 body。
  actionButton.parent(document.body);

  // 設定按鈕點擊事件。
  actionButton.mousePressed(handleActionButton);

  // 設定按鈕初始樣式。
  actionButton.style("position", "fixed");
  actionButton.style("z-index", "10");
  actionButton.style("border", "none");
  actionButton.style("border-radius", "10px");
  actionButton.style("background-color", "#2563eb");
  actionButton.style("color", "#ffffff");
  actionButton.style("cursor", "pointer");
  actionButton.style("font-family", "Arial, Noto Sans TC, sans-serif");
  actionButton.style("pointer-events", "auto");

  // 初始隱藏按鈕。
  actionButton.hide();

  // 監聽畫布指標事件。
  canvas.elt.addEventListener("pointerdown", handleCanvasPointer, {
    passive: false
  });
}

// p5.js 主要繪圖函式。
function draw() {
  // 設定畫布背景。
  background("#f1f5f9");

  // 判斷測驗是否完成。
  if (quizFinished) {
    // 繪製結果畫面。
    drawResultScreen();

    // 結束目前繪圖。
    return;
  }

  // 繪製答題畫面。
  drawQuizScreen();
}

// 取得響應式版面設定。
function getLayout() {
  // 取得畫布寬度。
  const canvasWidth = width;

  // 取得畫布高度。
  const canvasHeight = height;

  // 判斷是否為橫向畫面。
  const isLandscape = canvasWidth > canvasHeight;

  // 判斷是否為小螢幕。
  const isSmallScreen = canvasWidth < 600;

  // 判斷是否為橫向窄螢幕。
  const isShortLandscape = isLandscape && canvasHeight < 540;

  // 設定頁面邊距。
  const margin = isSmallScreen ? 14 : 40;

  // 計算內容寬度。
  const contentWidth = min(canvasWidth - margin * 2, 860);

  // 根據螢幕尺寸設定標題大小。
  const titleSize = isSmallScreen ? 22 : 34;

  // 設定進度文字大小。
  const progressSize = isSmallScreen ? 14 : 19;

  // 設定題目文字大小。
  const questionSize = isSmallScreen ? 16 : 22;

  // 設定選項文字大小。
  const optionTextSize = isSmallScreen ? 14 : 19;

  // 設定回饋文字大小。
  const feedbackSize = isSmallScreen ? 14 : 18;

  // 計算標題位置。
  const titleY = isSmallScreen ? 28 : 42;

  // 計算進度位置。
  const progressY = isSmallScreen ? 60 : 82;

  // 計算題目卡片頂端位置。
  const cardY = isShortLandscape
    ? 68
    : isSmallScreen
      ? 84
      : 112;

  // 計算題目卡片高度。
  const cardHeight = isShortLandscape
    ? 92
    : isSmallScreen
      ? 128
      : 160;

  // 判斷是否使用雙欄選項。
  const twoColumns = isShortLandscape;

  // 計算選項欄數。
  const columns = twoColumns ? 2 : 1;

  // 計算欄位間距。
  const columnGap = twoColumns ? 12 : 0;

  // 計算選項寬度。
  const optionWidth = twoColumns
    ? (contentWidth - columnGap) / 2
    : contentWidth;

  // 計算選項高度。
  const optionHeight = isShortLandscape
    ? 48
    : isSmallScreen
      ? 46
      : 58;

  // 計算選項間距。
  const optionGap = isShortLandscape
    ? 10
    : isSmallScreen
      ? 9
      : 14;

  // 計算選項頂端位置。
  const optionTop = cardY + cardHeight + (isShortLandscape ? 14 : 20);

  // 計算選項區域高度。
  const optionRows = twoColumns ? 2 : 4;

  // 計算選項區域高度。
  const optionsHeight =
    optionRows * optionHeight +
    (optionRows - 1) * optionGap;

  // 計算回饋文字位置。
  const feedbackY = optionTop + optionsHeight + 20;

  // 計算按鈕頂端位置。
  const buttonY = feedbackY + (isShortLandscape ? 22 : 28);

  // 回傳所有版面資料。
  return {
    isLandscape,
    isSmallScreen,
    isShortLandscape,
    contentWidth,
    titleSize,
    progressSize,
    questionSize,
    optionTextSize,
    feedbackSize,
    titleY,
    progressY,
    cardY,
    cardHeight,
    optionTop,
    optionWidth,
    optionHeight,
    optionGap,
    optionsHeight,
    feedbackY,
    buttonY,
    columns,
    columnGap,
    margin
  };
}

// 繪製答題畫面。
function drawQuizScreen() {
  // 取得目前版面資料。
  const layout = getLayout();

  // 取得目前題目。
  const currentItem = questions[currentQuestion];

  // 清除選項點擊區域。
  optionAreas = [];

  // 設定一般文字樣式。
  noStroke();
  textAlign(CENTER, CENTER);

  // 設定標題顏色。
  fill("#1e293b");

  // 設定標題文字大小。
  textSize(layout.titleSize);

  // 顯示測驗標題。
  text("高中數學選擇題測驗", width / 2, layout.titleY);

  // 設定進度文字顏色。
  fill("#64748b");

  // 設定進度文字大小。
  textSize(layout.progressSize);

  // 顯示目前進度。
  text(
    `第 ${currentQuestion + 1} 題／共 ${questions.length} 題`,
    width / 2,
    layout.progressY
  );

  // 設定題目卡片背景顏色。
  fill("#ffffff");

  // 繪製題目卡片。
  rect(
    (width - layout.contentWidth) / 2,
    layout.cardY,
    layout.contentWidth,
    layout.cardHeight,
    18
  );

  // 設定題目文字顏色。
  fill("#1e293b");

  // 設定題目文字大小。
  textSize(layout.questionSize);

  // 將題目文字水平與垂直置中。
  text(
    currentItem.question,
    width / 2,
    layout.cardY + layout.cardHeight / 2,
    layout.contentWidth - 36,
    layout.cardHeight - 20
  );

  // 繪製所有選項。
  for (let index = 0; index < currentItem.options.length; index++) {
    // 繪製單一選項。
    drawOption(
      currentItem.options[index],
      index,
      layout
    );
  }

  // 判斷是否已作答。
  if (hasAnswered) {
    // 顯示答題回饋。
    drawFeedback(currentItem, layout);

    // 更新操作按鈕。
    updateActionButton(layout);

    // 顯示操作按鈕。
    actionButton.show();
  } else {
    // 尚未作答時隱藏按鈕。
    actionButton.hide();
  }
}

// 計算選項位置。
function getOptionPosition(index, layout) {
  // 計算選項所在欄位。
  const column = layout.columns === 2 ? index % 2 : 0;

  // 計算選項所在列。
  const row = layout.columns === 2
    ? floor(index / 2)
    : index;

  // 計算選項水平位置。
  const x =
    (width - layout.contentWidth) / 2 +
    column * (layout.optionWidth + layout.columnGap);

  // 計算選項垂直位置。
  const y =
    layout.optionTop +
    row * (layout.optionHeight + layout.optionGap);

  // 回傳選項位置。
  return {
    x,
    y
  };
}

// 繪製單一選項。
function drawOption(optionText, index, layout) {
  // 取得目前題目。
  const currentItem = questions[currentQuestion];

  // 取得選項位置。
  const position = getOptionPosition(index, layout);

  // 設定預設選項顏色。
  let optionColor = OPTION_COLOR;

  // 判斷是否為正確選項。
  if (hasAnswered && index === currentItem.answer) {
    // 將正確答案設定為指定綠色。
    optionColor = CORRECT_COLOR;
  }

  // 判斷是否為使用者選錯的選項。
  if (
    hasAnswered &&
    index === selectedOption &&
    selectedOption !== currentItem.answer
  ) {
    // 將錯誤答案設定為紅色。
    optionColor = WRONG_COLOR;
  }

  // 設定選項背景顏色。
  fill(optionColor);

  // 設定選項外框。
  stroke("#cbd5e1");
  strokeWeight(2);

  // 繪製選項方框。
  rect(
    position.x,
    position.y,
    layout.optionWidth,
    layout.optionHeight,
    12
  );

  // 設定選項文字顏色。
  fill("#1e293b");

  // 移除文字外框。
  noStroke();

  // 設定文字靠左置中。
  textAlign(LEFT, CENTER);

  // 設定選項文字大小。
  textSize(layout.optionTextSize);

  // 顯示選項文字。
  text(
    `${String.fromCharCode(65 + index)}. ${optionText}`,
    position.x + 16,
    position.y + layout.optionHeight / 2
  );

  // 儲存選項點擊區域。
  optionAreas.push({
    x: position.x,
    y: position.y,
    width: layout.optionWidth,
    height: layout.optionHeight
  });
}

// 顯示答題回饋。
function drawFeedback(currentItem, layout) {
  // 判斷答案是否正確。
  const isCorrect = selectedOption === currentItem.answer;

  // 設定回饋文字顏色。
  fill(isCorrect ? "#15803d" : "#b91c1c");

  // 設定文字置中。
  textAlign(CENTER, CENTER);

  // 設定回饋文字大小。
  textSize(layout.feedbackSize);

  // 建立回饋文字。
  const feedbackText = isCorrect
    ? "答對了！"
    : `答錯了，正確答案是 ${String.fromCharCode(
        65 + currentItem.answer
      )}。`;

  // 顯示回饋文字。
  text(feedbackText, width / 2, layout.feedbackY);
}

// 更新操作按鈕。
function updateActionButton(layout) {
  // 設定按鈕文字。
  actionButton.html(
    currentQuestion === questions.length - 1
      ? "查看測驗結果"
      : "下一題"
  );

  // 設定按鈕寬度。
  const buttonWidth = layout.isSmallScreen ? 180 : 220;

  // 設定按鈕高度。
  const buttonHeight = layout.isSmallScreen ? 42 : 48;

  // 計算按鈕水平位置。
  const buttonX = width / 2 - buttonWidth / 2;

  // 計算按鈕垂直位置。
  const buttonY = min(
    layout.buttonY,
    height - buttonHeight - 12
  );

  // 設定按鈕尺寸。
  actionButton.size(buttonWidth, buttonHeight);

  // 設定按鈕位置。
  actionButton.position(buttonX, buttonY);

  // 設定按鈕字體大小。
  actionButton.style(
    "font-size",
    layout.isSmallScreen ? "16px" : "18px"
  );

  // 設定按鈕顯示層級。
  actionButton.style("z-index", "10");

  // 確保按鈕可以點擊。
  actionButton.style("pointer-events", "auto");
}

// 處理操作按鈕點擊。
function handleActionButton() {
  // 判斷測驗是否已完成。
  if (quizFinished) {
    // 重新開始測驗。
    resetQuiz();

    // 結束函式。
    return;
  }

  // 判斷是否還有下一題。
  if (currentQuestion < questions.length - 1) {
    // 前往下一題。
    currentQuestion++;

    // 清除作答狀態。
    hasAnswered = false;

    // 清除選擇的答案。
    selectedOption = -1;

    // 隱藏操作按鈕。
    actionButton.hide();

    // 重新繪製畫面。
    redraw();

    // 結束函式。
    return;
  }

  // 設定測驗完成。
  quizFinished = true;

  // 隱藏目前按鈕。
  actionButton.hide();

  // 重新繪製結果畫面。
  redraw();
}

// 繪製結果畫面。
function drawResultScreen() {
  // 設定結果標題顏色。
  fill("#1e293b");

  // 設定文字置中。
  textAlign(CENTER, CENTER);

  // 設定標題大小。
  textSize(width < 600 ? 30 : 38);

  // 顯示完成標題。
  text("測驗完成！", width / 2, height / 2 - 90);

  // 設定成績顏色。
  fill("#2563eb");

  // 設定成績文字大小。
  textSize(width < 600 ? 23 : 30);

  // 顯示答對題數。
  text(
    `你答對了 ${correctCount}／${questions.length} 題`,
    width / 2,
    height / 2 - 25
  );

  // 設定重新開始按鈕文字。
  actionButton.html("重新開始測驗");

  // 設定按鈕寬度。
  const buttonWidth = width < 600 ? 190 : 220;

  // 設定按鈕高度。
  const buttonHeight = width < 600 ? 44 : 48;

  // 計算按鈕水平位置。
  const buttonX = width / 2 - buttonWidth / 2;

  // 計算按鈕垂直位置。
  const buttonY = min(
    height / 2 + 45,
    height - buttonHeight - 15
  );

  // 設定按鈕尺寸。
  actionButton.size(buttonWidth, buttonHeight);

  // 設定按鈕位置。
  actionButton.position(buttonX, buttonY);

  // 設定按鈕字體大小。
  actionButton.style(
    "font-size",
    width < 600 ? "16px" : "18px"
  );

  // 顯示按鈕。
  actionButton.show();
}

// 處理畫布指標事件。
function handleCanvasPointer(event) {
  // 阻止瀏覽器預設觸控行為。
  event.preventDefault();

  // 如果測驗完成，不處理選項。
  if (quizFinished || hasAnswered) {
    return;
  }

  // 取得畫布實際顯示範圍。
  const rect = canvas.elt.getBoundingClientRect();

  // 計算畫布內部與顯示尺寸的水平比例。
  const scaleX = width / rect.width;

  // 計算畫布內部與顯示尺寸的垂直比例。
  const scaleY = height / rect.height;

  // 將瀏覽器座標轉換成 p5.js 畫布座標。
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  // 判斷使用者點擊哪一個選項。
  for (let index = 0; index < optionAreas.length; index++) {
    // 取得目前選項點擊區域。
    const area = optionAreas[index];

    // 判斷座標是否位於選項內。
    const isInside =
      x >= area.x &&
      x <= area.x + area.width &&
      y >= area.y &&
      y <= area.y + area.height;

    // 如果點擊到選項。
    if (isInside) {
      // 記錄使用者答案。
      selectedOption = index;

      // 設定為已作答。
      hasAnswered = true;

      // 判斷是否答對。
      if (selectedOption === questions[currentQuestion].answer) {
        // 答對題數加一。
        correctCount++;
      }

      // 結束選項判斷。
      break;
    }
  }
}

// 重新開始測驗。
function resetQuiz() {
  // 回到第一題。
  currentQuestion = 0;

  // 清除答對題數。
  correctCount = 0;

  // 清除作答狀態。
  hasAnswered = false;

  // 清除使用者選項。
  selectedOption = -1;

  // 設定測驗尚未完成。
  quizFinished = false;

  // 隱藏操作按鈕。
  actionButton.hide();

  // 重新繪製畫面。
  redraw();
}

// 視窗大小改變時執行。
function windowResized() {
  // 重新調整畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新繪製畫面。
  redraw();
}