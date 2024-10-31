const userText = localStorage.getItem("userText");

    function typeTextRandom(text, elementId, minDelay = 30, maxDelay = 100) {
        const element = document.getElementById(elementId);
        let index = 0;
    
        function type() {
            if (index < text.length) {
                element.innerHTML += text[index] === "\n" ? "<br>" : text[index];
                index++;
                // 랜덤한 속도로 다음 글자 타이핑
                const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                setTimeout(type, randomDelay);
            }
        }
    
        element.innerHTML = ""; // 초기화 후 시작
        type();
    }


const message = `Hello, ${userText}. Welcome to our service! Our service offers an automatic conversion feature to protect your information from robots.\n안녕하세요, ${userText}. security code에 온 걸 환영합니다. 우리 서비스는 다른 로봇으로부터 정보를 보호하는 자동변환 기능을 제공하고 있습니다.`;
typeTextRandom(message, "welcomeMessage");


// 요소 가져오기
const startButton = document.getElementById('startButton');
const resultText = document.getElementById('resultText');
const captchaCanvas = document.getElementById('captchaCanvas');

// 컨텍스트를 가져올 때 willReadFrequently 속성 추가
const ctx = captchaCanvas.getContext('2d', { willReadFrequently: true }); 

// 캔버스 크기 설정
captchaCanvas.width = 800; // 캔버스 가로 1000px
captchaCanvas.height = 300; // 캔버스 높이 700px

// SpeechRecognition API 초기화
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'ko-KR'; // 한국어 설정
recognition.interimResults = false; // 중간 결과 비활성화
recognition.maxAlternatives = 1; // 최대 대체 텍스트 수 설정

let isRecognizing = false; // 음성 인식 중인지 여부
let finalTranscript = '';  // 최종 인식된 텍스트

// 음성 인식 시작 버튼 클릭 이벤트
startButton.addEventListener('click', () => {
    if (!isRecognizing) {
        finalTranscript = ''; // 이전 결과 초기화
        recognition.start();  // 음성 인식 시작
    }
});

// 음성 인식 시작 시
recognition.onstart = () => {
    isRecognizing = true; // 음성 인식이 진행 중임을 표시
};

// 음성 인식 결과 처리
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // 인식된 텍스트 가져오기
    finalTranscript += transcript; // 최종 텍스트에 추가

    // 인식된 텍스트 화면에 표시
    resultText.textContent = `인식된 텍스트: ${finalTranscript}`;
    console.log('인식된 텍스트:', finalTranscript);

    // 캔버스를 이용해 복잡한 보안 문자 생성
    generateComplexCaptcha(finalTranscript);
};

// 음성 인식 종료 이벤트
recognition.onend = () => {
    console.log('음성 인식이 종료되었습니다.');
    isRecognizing = false; // 음성 인식이 종료되면 다시 시작할 수 있도록 상태 업데이트
};

// 음성 인식 오류 처리
recognition.onerror = (event) => {
    console.error('음성 인식 오류:', event.error);
    resultText.textContent = '음성 인식 오류가 발생했습니다. 다시 시도해 주세요.';
    isRecognizing = false; // 오류 발생 시 인식 상태를 false로 설정
};

function generateComplexCaptcha(text) {
    // 캔버스 초기화
    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // 텍스트 관련 스타일 설정
    const canvasWidth = captchaCanvas.width;
    const canvasHeight = captchaCanvas.height;

    // 텍스트를 크게 설정 (폰트 크기를 캔버스 높이의 30%로 설정)
    const fontSize = canvasHeight * 0.6; // 폰트 크기를 캔버스 높이에 비례하게 설정
    const charSpacing = canvasWidth / (text.length + 1); // 글자 간격을 균등하게 설정

    ctx.textBaseline = 'middle'; // 텍스트가 수직으로 중앙에 배치되도록 설정
    ctx.font = `${fontSize}px Arial`; // 텍스트 크기 및 폰트 설정

    // 각 글자를 랜덤하게 그리기
    for (let i = 0; i < text.length; i++) {
        const x = charSpacing * (i + 1);
        const y = canvasHeight / 2; // 세로 중앙에 배치

        // 랜덤한 크기, 회전 각도 및 색상 설정
        const rotation = (Math.random() - 0.5) * 30; // -15도 ~ +15도 회전
        const scaleX = Math.random() * 0.4 + 0.8; // 가로 확대 비율 (0.8 ~ 1.2)
        const scaleY = Math.random() * 0.4 + 0.8; // 세로 확대 비율 (0.8 ~ 1.2)
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 랜덤 색상

        ctx.save(); // 현재 상태 저장
        ctx.translate(x, y); // 텍스트 중심으로 이동
        ctx.rotate((rotation * Math.PI) / 180); // 랜덤 회전 적용
        ctx.scale(scaleX, scaleY); // 랜덤 스케일 적용
        ctx.fillStyle = color; // 랜덤 색상 적용
        ctx.fillText(text[i], 0, 0); // 텍스트 그리기
        ctx.restore(); // 원래 상태 복원
    }

    // 랜덤한 선 그리기
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
        ctx.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
        ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.stroke();
    }

    // 랜덤한 점 찍기 (노이즈 효과)
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 텍스트가 그려진 후 캔버스를 이미지로 왜곡 처리
    applyPixelDistortion(); // applyPixelDistortion 함수 호출
}

function applyPixelDistortion() {
    const imgData = ctx.getImageData(0, 0, captchaCanvas.width, captchaCanvas.height); // 캔버스 데이터 가져오기
    const data = imgData.data;

    const width = imgData.width;
    const height = imgData.height;
    const newData = new Uint8ClampedArray(data); // 원본 데이터를 복사

    // 픽셀을 유동화하는 알고리즘 적용
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;

            // 픽셀을 좌우로 이동시키는 왜곡 효과
            const offsetX = Math.sin(y / 10) * 10; // 사인 곡선을 따라 왜곡
            const newX = Math.min(width - 1, Math.max(0, Math.floor(x + offsetX)));

            // 보간법을 사용하여 주변 픽셀의 색상 정보를 기반으로 새로운 색상 설정
            const newIndex = (y * width + newX) * 4;

            // 색상 정보 복사
            for (let i = 0; i < 4; i++) {
                newData[index + i] = data[newIndex + i];
            }
        }
    }

    // 왜곡된 이미지 데이터를 다시 캔버스에 적용
    ctx.putImageData(new ImageData(newData, width, height), 0, 0);
}