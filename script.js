const canvas = document.getElementById('glowCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 150 + 50;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Skin-ish glowing colors (coral, soft pink, peach, warm white)
        const colors = [
            'rgba(255, 182, 193, 0.15)', // Light Pink
            'rgba(255, 218, 185, 0.15)', // Peach Puff
            'rgba(250, 235, 215, 0.1)',  // Antique White
            'rgba(255, 105, 180, 0.05)'  // Hot pink (very subtle)
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = w + this.size;
        if (this.y > h + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = h + this.size;

        // Interactive gentle pull towards mouse
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 300) {
                this.x += dx * 0.005;
                this.y += dy * 0.005;
            }
        }
    }

    draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    // Adjust number of particles based on screen size for performance
    const numParticles = Math.min(Math.floor((w * h) / 30000), 30);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    
    // Slight global glow effect
    ctx.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    requestAnimationFrame(animate);
}

init();
animate();

// Form submission handler
document.getElementById('notifyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const input = e.target.querySelector('input');
    
    if(input.value) {
        btn.textContent = 'Added to Waitlist!';
        btn.style.background = '#ffd1dc';
        btn.style.color = '#000';
        input.value = '';
        
        setTimeout(() => {
            btn.textContent = 'Notify Me';
            btn.style.background = '#fff';
        }, 3000);
    }
});
