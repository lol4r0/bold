// Interactive particles background
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.isActive = false;
    
    this.init();
  }
  
  init() {
    // Setup canvas
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.3';
    
    document.body.appendChild(this.canvas);
    
    this.resize();
    this.createParticles();
    this.animate();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: '#ff1a1a',
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += dx * force * 0.001;
        particle.vy += dy * force * 0.001;
        particle.size = Math.min(particle.size + force * 2, 8);
      } else {
        particle.size = Math.max(particle.size - 0.1, 1);
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 26, 26, ${particle.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.strokeStyle = `rgba(255, 26, 26, ${0.1 * (1 - distance / 150)})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system when page loads
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});
 (function(){
    const root = document.documentElement;
    let energy = 0; // 0..1

    // section-entry spike glitch (independent of cursor)
    const raf = ()=>{
      energy = Math.max(0, energy - 0.02); // decay
      const a = (2 - 1.2*energy).toFixed(2) + 's';
      const b = (1.6 - 1.0*energy).toFixed(2) + 's';
      root.style.setProperty('--fragA', a);
      root.style.setProperty('--fragB', b);
      root.style.setProperty('--glitch', String(energy));
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          energy = Math.min(1, energy + 1.0); // stronger spike
        }
      });
    }, {root:null, threshold:0.4});
    document.querySelectorAll('.section-title').forEach(el=>observer.observe(el));

    // Parallax effect for hero image
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });

    // Gallery hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
      });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Animated counter for stats
    function animateCounter(element, target, duration = 2000) {
      let start = 0;
      const increment = target / (duration / 16);
      
      function updateCounter() {
        start += increment;
        if (start < target) {
          element.textContent = Math.floor(start);
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      }
      
      updateCounter();
    }

    // Observe stats section for animation
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    // Magnetic buttons effect
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = x * strength * 0.3;
          const moveY = y * strength * 0.3;
          
          button.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.1})`;
        }
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0px, 0px) scale(1)';
      });
      
      button.addEventListener('click', () => {
        button.style.transform = 'translate(0px, 0px) scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'translate(0px, 0px) scale(1)';
        }, 150);
      });
    });
  })();
