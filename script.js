let currentQuestion = 0;
let score = 0;
let selectedPartQuestions = [];
let answered = false;
let userAnswers = [];

document.getElementById("topicSelect").addEventListener("change", function () {
    const topic = this.value;
    const partSelect = document.getElementById("partSelect");
    partSelect.innerHTML = '<option value="">-- Chọn Phần --</option>';
    partSelect.disabled = true;

    if (topic && questionData[topic]) {
        const parts = Object.keys(questionData[topic]);
        parts.forEach(part => {
            const option = document.createElement("option");
            option.value = part;
            option.textContent = part;
            partSelect.appendChild(option);
        });
        partSelect.disabled = false;
    }
});

document.getElementById("partSelect").addEventListener("change", function () {
    const topic = document.getElementById("topicSelect").value;
    const part = this.value;
    const previewBtn = document.getElementById("previewAnswersBtn");

    if (topic && part && questionData[topic]?.[part]) {
        previewBtn.disabled = false;
    } else {
        previewBtn.disabled = true;
    }
});

function previewAnswers() {
    const topic = document.getElementById("topicSelect").value;
    const part = document.getElementById("partSelect").value;

    if (!topic || !part) return;

    const questions = questionData[topic][part];
    const previewBox = document.getElementById("reviewContainer");
    previewBox.innerHTML = "<h3>📖 Đáp án trước khi làm:</h3>";

    questions.forEach((q, i) => {
        const correctAnswer = q.answer;

        let html = `<div style="margin-bottom: 20px;">
        <strong>Câu ${i + 1}:</strong> ${q.question}<br>`;

        q.options.forEach((opt, idx) => {
            let style = "";

            if (idx === correctAnswer) {
                style = "color: white; background: #27ae60; padding: 6px; border-radius: 6px;";
            }

            html += `<div style="${style}">→ ${opt}</div>`;
        });

        html += "</div>";
        previewBox.innerHTML += html;
    });

    document.getElementById("resultContainer").style.display = "block";
    document.getElementById("menu").style.display = "none";
}
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    } else {
        alert("Bạn đang ở câu đầu tiên!");
    }
}
function submitQuiz() {
    if (!answered) {
        alert("Vui lòng chọn một đáp án trước khi nộp!");
        return;
    }

    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "block";

    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.innerHTML = `<h2>Hoàn thành!</h2><p>Bạn đã trả lời đúng <strong>${score}</strong> / ${selectedPartQuestions.length} câu hỏi.</p>`;
}

function renderTopics() {
    const select = document.getElementById('topicSelect');

    for (const key in questionData) {
        if (questionData.hasOwnProperty(key)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key; // Hoặc bạn có thể sử dụng questionData[key].ra để hiển thị nội dung
            select.appendChild(option);
        }
    }
}


function startQuiz() {
    const topic = document.getElementById("topicSelect").value;
    const part = document.getElementById("partSelect").value;

    if (!topic || !part) {
        alert("Vui lòng chọn đầy đủ chủ đề và phần!");
        return;
    }

    selectedPartQuestions = questionData[topic][part];
    currentQuestion = 0;
    score = 0;
    document.getElementById("menu").style.display = "none";
    document.getElementById("quizContainer").style.display = "block";
    document.getElementById("resultContainer").style.display = "none";
    showQuestion();
}

function showQuestion() {
    answered = false;
    document.getElementById("questionIndex").textContent = `🧾 Câu ${currentQuestion + 1} / ${selectedPartQuestions.length}`;
    const question = selectedPartQuestions[currentQuestion];
    document.getElementById("questionBox").textContent = `Câu ${currentQuestion + 1}: ${question.question}`;

    const optionsBox = document.getElementById("optionsBox");
    optionsBox.innerHTML = "";

    question.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(idx, btn);

        // Nếu người dùng đã chọn câu này rồi, thì hiển thị lại trạng thái
        if (userAnswers[currentQuestion] !== undefined) {
            const selectedIndex = userAnswers[currentQuestion];
            if (idx === question.answer) {
                btn.classList.add("correct");
            }
            if (idx === selectedIndex && selectedIndex !== question.answer) {
                btn.classList.add("incorrect");
            }
            btn.disabled = true;
            answered = true;
        }

        optionsBox.appendChild(btn);
    });
}

function handleAnswer(selectedIndex, selectedButton) {
    if (answered) return;
    answered = true;
    userAnswers[currentQuestion] = selectedIndex;


    const question = selectedPartQuestions[currentQuestion];

    const allButtons = document.querySelectorAll("#optionsBox button");

    allButtons.forEach((btn, index) => {
        if (index === question.answer) {
            btn.classList.add("correct");
        }

        if (index === selectedIndex && index !== question.answer) {
            btn.classList.add("incorrect");
        }

        // vô hiệu hóa nút sau khi chọn
        btn.disabled = true;
    });

    if (selectedIndex === question.answer) {
        score++;
    }
}

function nextQuestion() {
    if (!answered) {
        alert("Vui lòng chọn một đáp án trước khi tiếp tục!");
        return;
    }

    currentQuestion++;

    if (currentQuestion < selectedPartQuestions.length) {
        showQuestion();
    } else {
        document.getElementById("quizContainer").style.display = "none";
        document.getElementById("resultContainer").style.display = "block";

        const scoreDisplay = document.getElementById("scoreDisplay");
        scoreDisplay.innerHTML = `<h2>Hoàn thành!</h2><p>Bạn đã trả lời đúng <strong>${score}</strong> / ${selectedPartQuestions.length} câu hỏi.</p>`;
    }
}

function reviewAnswers() {
    if (!selectedPartQuestions.length || !userAnswers.length) {
        alert("Bạn chưa làm bài nên không có đáp án để xem lại!");
        return;
    }

    const reviewBox = document.getElementById("reviewContainer");
    reviewBox.innerHTML = "<h3>📖 Đáp án từng câu:</h3>";

    selectedPartQuestions.forEach((q, i) => {
        const userAnswer = userAnswers[i];
        const correctAnswer = q.answer;

        let html = `<div style="margin-bottom: 20px;">
        <strong>Câu ${i + 1}:</strong> ${q.question}<br>`;

        q.options.forEach((opt, idx) => {
            let style = "";

            if (idx === correctAnswer) {
                style = "color: white; background: #27ae60; padding: 6px; border-radius: 6px;";
            } else if (idx === userAnswer && userAnswer !== correctAnswer) {
                style = "color: white; background: #e74c3c; padding: 6px; border-radius: 6px;";
            }

            html += `<div style="${style}">→ ${opt}</div>`;
        });

        html += "</div>";
        reviewBox.innerHTML += html;
    });
}

function backToMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "none";
    document.getElementById("reviewContainer").innerHTML = "";
    userAnswers = [];
    score = 0;
    currentQuestion = 0;
}


window.onload = renderTopics;