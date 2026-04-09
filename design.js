const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const toggleBgBtn = document.getElementById('toggleBgBtn');
const imageGrid = document.getElementById('imageGrid');
const resultsSection = document.getElementById('resultsSection');
const winnerLabel = document.getElementById('winnerLabel');

let uploadedImages = [];
let isDarkBg = false;

// Handle file uploads
fileInput.addEventListener('change', (e) => {
    uploadedImages = Array.from(e.target.files);
    renderImages();
});

// Render uploaded images
function renderImages() {
    imageGrid.innerHTML = '';

    if (uploadedImages.length === 0) {
        imageGrid.innerHTML = `
            <div class="design-slot">Design A</div>
            <div class="design-slot">Design B</div>
        `;
        return;
    }

    uploadedImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.classList.add('design-slot');
            div.style.backgroundImage = `url(${e.target.result})`;
            imageGrid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// Analyze designs
analyzeBtn.addEventListener('click', () => {
    if (uploadedImages.length === 0) {
        alert('Please upload at least 2 designs');
        return;
    }

    resultsSection.innerHTML = '';
    winnerLabel.textContent = '';
    let winnerScore = -1;
    let winnerIndex = -1;
    let designScores = [];

    uploadedImages.forEach((file, idx) => {
        const scores = {
            "Color Contrast": getRandomScore(),
            "Spacing & Layout": getRandomScore(),
            "Visual Hierarchy": getRandomScore(),
            "Readability": getRandomScore(),
            "Balance & Alignment": getRandomScore(),
            "Color Harmony": getRandomScore(),
            "Consistency": getRandomScore(),
            "Visual Attention": getRandomScore(),
            "Overall Impact": getRandomScore()
        };

        let total = Object.values(scores).reduce((a,b) => a+b, 0);
        designScores.push({index: idx, total, scores});
        if(total > winnerScore) {
            winnerScore = total;
            winnerIndex = idx;
        }
    });

    // Render results
    designScores.forEach(ds => {
        const card = document.createElement('div');
        card.classList.add('result-card');
        if(ds.index === winnerIndex) card.classList.add('winner');

        let listItems = '';
        for (let [key, value] of Object.entries(ds.scores)) {
            const percent = (value / 10) * 100;
            listItems += `
                <li>${key}: ${value}/10
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                </li>
            `;
        }

        // Add hint if low score (<6)
        let hints = '';
        for (let [key, value] of Object.entries(ds.scores)) {
            if(value < 6) hints += `<li>Hint: ${key} could be improved</li>`;
        }

        card.innerHTML = `
            <h3>Design ${String.fromCharCode(65 + ds.index)}</h3>
            <ul>
                ${listItems}
                <li><strong>Total Score: ${ds.total}/90</strong></li>
                ${hints}
            </ul>
        `;
        resultsSection.appendChild(card);
    });

    winnerLabel.textContent = `🏆 Best Design: ${String.fromCharCode(65 + winnerIndex)}`;
});

// Reset
resetBtn.addEventListener('click', () => {
    uploadedImages = [];
    fileInput.value = '';
    renderImages();
    resultsSection.innerHTML = '';
    winnerLabel.textContent = '';
});

// Toggle background color
toggleBgBtn.addEventListener('click', () => {
    isDarkBg = !isDarkBg;
    document.body.style.backgroundColor = isDarkBg ? '#333' : '#f5f5f5';
    document.body.style.color = isDarkBg ? '#fff' : '#333';
});

// Helper function
function getRandomScore() {
    return Math.floor(Math.random() * 6) + 5; // random 5-10
}
