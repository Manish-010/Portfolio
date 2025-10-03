// ==========================================
// AI NEURAL PORTFOLIO - FINAL SCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // ==========================================
    // GSAP CUSTOM CURSOR (DESKTOP ONLY)
    // ==========================================
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

        window.addEventListener('mousemove', e => {
            gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
            gsap.to(cursorFollower, { duration: 0.6, x: e.clientX, y: e.clientY });
        });

        document.querySelectorAll('.clickable').forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('grow'));
        });
    }


    // ==========================================
    // NEURAL NETWORK BACKGROUND (OPTIMIZED)
    // ==========================================
    const canvas = document.getElementById('neural-bg');
    if (canvas) {
        if (isTouchDevice || window.innerWidth < 768) {
            canvas.style.display = 'none';
        } else {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let isAnimationRunning = true;

            const setupCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                particles = [];
                const particleCount = 60;
                for (let i = 0; i < particleCount; i++) particles.push(new Particle());
            };
            class Particle {
                constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5; this.radius = 2; }
                update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > canvas.width) this.vx *= -1; if (this.y < 0 || this.y > canvas.height) this.vy *= -1; }
                draw() { const color = document.body.classList.contains('contact-page-body') ? 'rgba(45, 42, 38, 0.5)' : 'rgba(210, 105, 30, 0.5)'; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
            }
            const connectParticles = () => {
                const lineColor = document.body.classList.contains('contact-page-body') ? '45, 42, 38' : '210, 105, 30';
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                        if (distance < 150) {
                            ctx.strokeStyle = `rgba(${lineColor}, ${1 - distance / 150})`; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                        }
                    }
                }
            };
            const animate = () => { 
                if (!isAnimationRunning) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                particles.forEach(p => { p.update(); p.draw(); }); 
                connectParticles(); 
                requestAnimationFrame(animate); 
            };
            
            window.pauseCanvasAnimation = () => { isAnimationRunning = false; };
            window.resumeCanvasAnimation = () => {
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    animate();
                }
            };
            
            setupCanvas();
            animate();
            window.addEventListener('resize', debounce(setupCanvas, 250));
        }
    }
    
    // ==========================================
    // NAVIGATION & ACTIVE LINK HIGHLIGHTING
    // ==========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksList = document.querySelector('.nav-links');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) navbar.classList.toggle('hidden', currentScroll > lastScroll && currentScroll > 0);
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
            
            if (document.body.matches('.contact-page-body')) return;

            let activeSection = 'home';
            document.querySelectorAll('main section[id]').forEach(section => {
                if (window.pageYOffset >= section.offsetTop - navbar.offsetHeight - 50) {
                    activeSection = section.id;
                }
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href.includes(`#${activeSection}`)) { link.classList.add('active'); }
            });
        });
    }
    if (hamburger) {
        hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navLinksList.classList.toggle('active'); });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => { hamburger.classList.remove('active'); navLinksList.classList.remove('active'); }, 300);
            });
        });
    }

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    const typedTextSpan = document.querySelector('.typed-text');
    if (typedTextSpan) {
        const textArray = ['AI Engineer', 'LLM Specialist', 'Python Developer', 'Problem Solver'];
        let textArrayIndex = 0, charIndex = 0;
        const type = () => { if (charIndex < textArray[textArrayIndex].length) { typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex++); setTimeout(type, 100); } else { setTimeout(erase, 2000); } };
        const erase = () => { if (charIndex > 0) { typedTextSpan.textContent = textArray[textArrayIndex].substring(0, --charIndex); setTimeout(erase, 50); } else { textArrayIndex = (textArrayIndex + 1) % textArray.length; setTimeout(type, 600); } };
        setTimeout(type, 2000);
    }

    // ==========================================
    // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ==========================================
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.matches('.stat-number')) {
                    const targetNum = +target.dataset.target; const symbol = target.dataset.symbol || ''; let count = 0;
                    const updateCount = () => { const increment = targetNum / 100; count += increment; if (count < targetNum) { target.textContent = Math.ceil(count); requestAnimationFrame(updateCount); } else { target.textContent = targetNum + symbol; } };
                    updateCount();
                    observer.unobserve(target);
                }
                if (target.matches('.timeline-item, .project-card, .recognition-card')) {
                    target.classList.add('visible');
                    observer.unobserve(target);
                }
            }
        });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.stat-number, .timeline-item, .project-card, .recognition-card').forEach(el => animationObserver.observe(el));

    // ==========================================
    // SKILL BAR ANIMATION (INTERACTIVE VERSION)
    // ==========================================
    document.querySelectorAll('.skill-category, .language-card').forEach(parentBlock => {
        const container = parentBlock.querySelector('.skill-bars, .lang-bars');
        if (!container) return;
        
        const animateBars = () => {
            gsap.fromTo(container.querySelectorAll('.fill'), 
                { width: '0%' }, 
                { 
                    width: (i, el) => `${el.dataset.level}%`,
                    duration: 1.5,
                    ease: 'power2.out',
                    stagger: 0.1,
                    overwrite: 'auto'
                }
            );
        };

        // Animate once on scroll
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                animateBars();
                observer.unobserve(parentBlock);
            }
        }, { threshold: 0.5 });

        observer.observe(parentBlock);

        // Re-animate on hover (desktop) or tap (mobile)
        parentBlock.addEventListener('mouseenter', animateBars);
        parentBlock.addEventListener('touchstart', animateBars, { passive: true });
    });
    
    // ==========================================
    // KEYWORD SCROLLER LOGIC
    // ==========================================
    const scrollers = document.querySelectorAll(".scroller");
    if (scrollers.length > 0) {
        scrollers.forEach(scroller => {
            scroller.setAttribute("data-animated", true);
            
            const scrollerInner = scroller.querySelector('.scroller-inner');
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach(item => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute('aria-hidden', true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }

    // ==========================================
    // MAGNETIC BUTTON LOGIC
    // ==========================================
    const magneticButton = document.querySelector('.magnetic-btn');
    if (magneticButton && !isTouchDevice) {
        const journeyContainer = document.getElementById('journey');
        
        journeyContainer.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = magneticButton.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            
            gsap.to(magneticButton, {
                x: deltaX * 0.4,
                y: deltaY * 0.4,
                duration: 0.8,
                ease: 'elastic.out(1, 0.75)'
            });
        });

        journeyContainer.addEventListener('mouseleave', () => {
            gsap.to(magneticButton, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    // ==========================================
    // MODAL LOGIC
    // ==========================================
    const modalData = {
        'ad-generator': { type: 'project', image: 'images/adgen.png', title: 'AI Ad Content Generator', description: 'This powerful tool leverages generative models to transform a single text prompt into a complete advertising campaign. It produces compelling ad scripts, generates AI-powered voiceovers, and assembles dynamic video ads, streamlining the creative workflow from concept to completion.', tech: ['Generative AI', 'Python', 'ElevenLabs'], cta: '<a href="https://github.com/Manish-010?tab=repositories" target="_blank" class="btn btn-primary clickable">View on GitHub</a>' },
        'mindhaven': { type: 'project', image: 'images/chatbot.png', title: 'MindHaven: AI Chatbot', description: 'An empathetic AI chatbot designed to detect early signs of depression or suicidal ideation through nuanced conversation analysis. It uses advanced NLP models to understand sentiment and context, providing supportive guidance and resources. <em>Disclaimer: This is a supportive tool, not a substitute for professional medical advice.</em>', tech: ['Conversational AI', 'NLP', 'TensorFlow'], cta: '<div class="modal-cta-group"><a href="https://github.com/Manish-010/SUICIDAL-THOUGHT-PREDICTION-AND-MINDHEAVEN-CHATBOT" target="_blank" class="btn btn-primary clickable">View on GitHub</a><a href="https://www.linkedin.com/posts/manish-p-5017032a3_healthcareai-mentalhealth-aiforgood-activity-7378702719575887872-zmJD" target="_blank" class="btn btn-outline clickable">Read on LinkedIn</a></div>' },
        'sentiment-analysis': { type: 'project', image: 'images/tam-mal.png', title: 'Regional Language Sentiment Analysis', description: 'Pioneered a novel algorithm to decipher the complex linguistic nuances of regional Indian languages (Tamil and Malayalam). This project provides highly accurate sentiment analysis, creating a crucial foundation for fine-tuning Large Language Models for better regional understanding.', tech: ['NLP', 'Python', 'Machine Learning'], cta: '<div class="modal-cta-group"><a href="https://github.com/Manish-010/Sentiment-Analysis-Project" target="_blank" class="btn btn-primary clickable">View on GitHub</a><a href="https://www.linkedin.com/posts/manish-p-5017032a3_exploring-namp-dreams-two-novel-ai-algorithms-activity-7367434038590009344-jKes" target="_blank" class="btn btn-outline clickable">Read on LinkedIn</a></div>' },
        'ai-resume': { type: 'project', image: 'images/ai-resume.png', title: 'AI Resume Screener', description: 'Architected an intelligent tool to revolutionize recruitment by automating the initial screening process. It leverages advanced NLP to autonomously scan, parse, and rank candidate resumes against job descriptions, identifying top talent and drastically reducing manual effort.', tech: ['NLP', 'TF-IDF', 'Scikit-learn'], cta: '<a href="https://github.com/Manish-010/AI-RESUME-TOOL-" target="_blank" class="btn btn-primary clickable">View on GitHub</a>' },
        'tuberculosis': { type: 'project', title: 'Tuberculosis Analysis Suite', image: 'images/tb.png', description: 'A comprehensive AI suite designed to assist healthcare professionals in the fight against Tuberculosis. The system uses deep learning models for prediction from patient data, detection from chest X-rays, and precise segmentation of affected lung areas for faster, more accurate diagnostics.', tech: ['Deep Learning', 'Healthcare AI', 'Segmentation'], cta: '<a href="https://www.linkedin.com/posts/manish-p-5017032a3_ai-machinelearning-deeplearning-activity-7375842059901005824-cr1P" target="_blank" class="btn btn-primary clickable">Read on LinkedIn</a>' },
        'pc-control': { type: 'project', title: 'Hands-Free PC Control', image: 'images/pc.png', description: 'Developed a cutting-edge, real-time system that enables hands-free PC control using only eye movements and gestures. By tracking facial landmarks with OpenCV and MediaPipe, it provides a vital accessibility tool for users with motor impairments.', tech: ['Python', 'OpenCV', 'MediaPipe'], cta: '<a href="https://github.com/Manish-010?tab=repositories" target="_blank" class="btn btn-primary clickable">View on GitHub</a>' },
        'neurocept': { type: 'project', title: 'Neurocept: Real vs Fake Image Detector', image: 'images/neurocept.png', description: 'A robust deep learning model built with PyTorch that accurately classifies images as authentic or AI-generated/manipulated. This tool is essential for combating misinformation and ensuring content integrity in the digital age.', tech: ['Python', 'PyTorch', 'CNNs'], cta: '<a href="https://github.com/Manish-010?tab=repositories" target="_blank" class="btn btn-primary clickable">View on GitHub</a>' },
        'forest-segmentation': { type: 'project', title: 'Forest Segmentation', image: 'images/forest.png', description: 'Engineered a YOLOv5-based deep learning model for pixel-accurate forest area detection and segmentation from satellite imagery. The system provides an interactive overlay visualization, crucial for environmental monitoring and resource management.', tech: ['YOLOv5', 'Deep Learning', 'OpenCV'], cta: '<a href="https://github.com/Manish-010?tab=repositories" target="_blank" class="btn btn-primary clickable">View on GitHub</a>' },
        'lunar-enhancer': { type: 'project', title: 'Lunar Image Enhancer', image: 'images/img-lunar.png', description: 'A sophisticated image processing tool that utilizes Fast Fourier Transforms (FFT) to significantly enhance the quality, clarity, and detail of satellite images of the lunar surface, revealing features not visible in the original captures.', tech: ['OpenCV', 'Python', 'FFT'], cta: '<a href="https://github.com/Manish-010?tab=repositories" target="_blank" class="btn btn-primary clickable">View on GitHub</a>' },
        'beetalogic': { type: 'detail', logo: 'images/beet-logo.png', title: 'AI Developer (ML & DL)', company: 'Beetalogic Software Solutions', description: '<p><strong>Duration:</strong> June 2025 - Present</p><p>Developing and deploying AI-powered solutions, including real-time computer vision systems and optimizing ML/DL models for production.</p>', linkHref: 'https://beetalogic.com/' },
        'dynaspede': { type: 'detail', logo: 'images/dyn-logo.png', title: 'Automation & Robotics Intern', company: 'Dynaspede Integrated Systems', description: '<p><strong>Duration:</strong> April - May 2025</p><p>Designed an automated vehicle system, focusing on real-time control and sensor integration.</p>', linkHref: 'https://www.dynaspede.com/' },
        'gkt': { type: 'detail', logo: 'images/glob.png', title: 'AI Tools Intern - KNIME', company: 'Global Knowledge Technologies', description: '<p><strong>Duration:</strong> Aug - Sep 2024</p><p>Built end-to-end data workflows and ML pipelines using KNIME.</p>', linkHref: 'https://www.globalknowledgetech.com/' },
        'kit-btech': { type: 'detail', logo: 'images/kit-logo.png', title: 'B.Tech in AI & Data Science', company: 'Kangeyam Institute Of Technology', description: '<p><strong>Duration:</strong> Oct 2022 - Present</p><p>Affiliated with Anna University. Maintaining a CGPA of 8.29.</p>', linkHref: 'https://www.kitech.edu.in/' },
        'sr-hsc': { type: 'detail', logo: 'images/logo-white.png', title: 'Higher Secondary (CS)', company: 'SR Matriculation Hr. Sec. School', description: '<p><strong>Completed:</strong> 2022</p><p>Grade: 80%</p>', linkHref: 'https://srmatricschool.org/' },
        'kongu-sslc': { type: 'detail', logo: 'images/kms.png', title: 'SSLC', company: 'Kongu Matriculation School', description: '<p><strong>Completed:</strong> 2020</p><p>Grade: 60%</p>', linkHref: '#' },
        'tamil': { type: 'detail', logo: null, title: 'தமிழ் (Tamil)', company: 'Native Language Proficiency', description: 'Tamil is my native and mother tongue. I am deeply connected to my roots and culture.<blockquote style="border-left: 3px solid var(--cyan); padding-left: 1rem; margin-top: 1rem; font-style: italic;">திருக்குறள்:<br>அகர முதல எழுத்தெல்லாம் ஆதி<br>பகவன் முதற்றே உலகு.<br><small>— Thirukkural 1</small></blockquote>' },
        'english': { type: 'detail', logo: null, title: 'English', company: 'Professional Working Proficiency', description: 'English has become a bridge that connects me globally while keeping my roots intact.<blockquote style="border-left: 3px solid var(--cyan); padding-left: 1rem; margin-top: 1rem; font-style: italic;">"Language is the road map of a culture."<br>— Rita Mae Brown</blockquote>' },
        'hp-life': { type: 'detail', logo: null, title: 'HP LIFE Certified: Design Thinking', company: 'HP LIFE', description: 'Completed a course on the principles and practical application of Design Thinking.' },
        'mcp': { type: 'detail', logo: null, title: 'Intro to Model Context Protocol', company: 'Anthropic', description: 'Completed coursework on advanced prompt engineering and context management for LLMs.' },
        'genai': { type: 'detail', logo: null, title: 'Career Essentials in Generative AI', company: 'Microsoft + LinkedIn', description: 'A certification covering the fundamentals and applications of Generative AI.' },
        'tcs-ion': { type: 'detail', logo: null, title: 'TCS ION Career Edge', company: 'TCS', description: 'Completed a course covering essential professional skills for the modern workplace.'},
        'more': { type: 'detail', logo: null, title: 'Continuous Learning', company: 'A Lifelong Pursuit', description: "I'm constantly developing myself. Reach out if you\'d like to know more!<br><br><blockquote style=\"border-left: 3px solid var(--coral); padding-left: 1rem; margin-top: 1rem; font-style: italic;\">\"Learning never exhausts the mind.\"<br>— Leonardo da Vinci</blockquote>" },
        'custom-ai': { type: 'detail', logo:null, title: 'Custom AI Solutions', company: '', description: 'I develop tailored AI applications to solve specific business problems, from computer vision systems to predictive analytics.', cta: '<div class="modal-cta-group"><a href="contact.html" class="btn btn-primary clickable">Book a Consultation</a></div>' },
        'iot-automation': { type: 'detail', logo:null, title: 'IoT & Automation', company: 'In collaboration with Solvenix Techwork', description: 'I build smart, connected systems using IoT technology for home, agricultural, and industrial automation.', cta: '<div class="modal-cta-group"><a href="contact.html" class="btn btn-primary clickable">Book a Consultation</a><a href="https://solvenixtechwork.wixsite.com/solvenix-techwork" target="_blank" rel="noopener noreferrer" class="btn btn-outline clickable">Visit Solvenix</a></div>' },
        'workshops': { type: 'detail', logo:null, title: 'AI Workshops & Training', company: '', description: 'I offer hands-on training sessions and seminars designed to demystify AI and IoT for students and professionals.', cta: '<div class="modal-cta-group"><a href="contact.html" class="btn btn-primary clickable">Request a Workshop</a></div>' },
        'chatbots': { type: 'detail', logo:null, title: 'Intelligent Chatbots', company: '', description: 'I create engaging and intelligent chatbots powered by advanced natural language understanding.', cta: '<div class="modal-cta-group"><a href="contact.html" class="btn btn-primary clickable">Discuss Your Bot</a></div>' },
        'predictive-analytics': { type: 'detail', logo:null, title: 'Predictive Analytics', company: '', description: 'Turn raw data into powerful business insights with accurate demand, sales, and trend predictions.', cta: '<div class="modal-cta-group"><a href="contact.html" class="btn btn-primary clickable">Analyze Your Data</a></div>' },
        'ai-agriculture': { type: 'detail', logo:null, title: 'AI in Agriculture', company: '', description: 'Boost crop yield and farm efficiency with AI-powered monitoring, prediction, and automation.', cta: '<div class="modal-cta-group"><a href="contact.html" class="btn btn-primary clickable">Modernize Your Farm</a></div>' },
    };

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');

    if (modalOverlay) {
        function openModal(data) {
            let contentHTML = ''; const key = data.title ? data.title.replace(/\s+/g, '+') : 'Project';
            let ctaHTML = data.cta || (data.link ? `<div class="modal-cta-group"><a href="${data.link}" target="_blank" class="btn btn-primary clickable">Visit Project</a></div>` : '');

            if (data.type === 'project') {
                contentHTML = `<button class="modal-close clickable">&times;</button><div class="modal-content-wrapper"><img src="${data.image}" alt="${data.title}" class="modal-image" onerror="this.onerror=null;this.src='https://placehold.co/800x500/FFF8F0/D2691E?text=${key}';"><h2 class="modal-title">${data.title}</h2><p class="modal-description">${data.description}</p><div class="modal-tech">${(data.tech || []).map(t => `<span>${t}</span>`).join('')}</div>${ctaHTML}</div>`;
            } else if (data.type === 'detail') {
                const logoHTML = data.logo ? `<img src="${data.logo}" alt="${data.company} Logo" class="detail-modal-logo" onerror="this.style.display='none'"/>` : '';
                const linkHTML = data.linkHref ? `<a href="${data.linkHref}" ${data.linkHref.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="detail-modal-link clickable">${data.linkText || 'Visit Website'} →</a>` : '';
                contentHTML = `<button class="modal-close clickable">&times;</button><div class="modal-content-wrapper"><div class="detail-modal-header">${logoHTML}<div class="detail-modal-title"><h3>${data.title}</h3><h4>${data.company}</h4></div></div><div class="detail-modal-body">${data.description}${ctaHTML || linkHTML}</div></div>`;
            }
            modalContainer.innerHTML = contentHTML;
            modalOverlay.classList.add('active');
            
            document.documentElement.classList.add('no-scroll');
            if (window.pauseCanvasAnimation) window.pauseCanvasAnimation();
        }

        function closeModal() { 
            modalOverlay.classList.remove('active'); 
            document.documentElement.classList.remove('no-scroll');
            if (window.resumeCanvasAnimation) window.resumeCanvasAnimation();
        }
        document.querySelectorAll('[data-modal-key]').forEach(el => { el.addEventListener('click', () => { const key = el.dataset.modalKey; if (modalData[key]) openModal(modalData[key]); }); });
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay || e.target.closest('.modal-close')) closeModal(); });
    }

    // ==========================================
    // GO TO TOP BUTTON
    // ==========================================
    const goTopBtn = document.querySelector('.go-top-btn');
    if (goTopBtn) { window.addEventListener('scroll', () => { goTopBtn.classList.toggle('visible', window.scrollY > 600); }); }
    
});