/**
 * Realistic Typewriter Effect
 * Types out text character by character with a blinking cursor
 */
(function() {
    'use strict';

    class Typewriter {
        constructor(element, options = {}) {
            this.element = element;
            this.words = options.words || [];
            this.typeSpeed = options.typeSpeed || 80;
            this.deleteSpeed = options.deleteSpeed || 50;
            this.pauseAfterType = options.pauseAfterType || 2000;
            this.pauseAfterDelete = options.pauseAfterDelete || 500;
            this.currentWordIndex = 0;
            this.currentCharIndex = 0;
            this.isDeleting = false;
            this.isPaused = false;

            this.init();
        }

        init() {
            // Create the text container and cursor
            this.element.innerHTML = '';

            this.textSpan = document.createElement('span');
            this.textSpan.className = 'typewriter-text';

            this.cursorSpan = document.createElement('span');
            this.cursorSpan.className = 'typewriter-cursor';
            this.cursorSpan.textContent = '|';

            this.element.appendChild(this.textSpan);
            this.element.appendChild(this.cursorSpan);

            // Start typing
            this.type();
        }

        type() {
            const currentWord = this.words[this.currentWordIndex];

            if (this.isDeleting) {
                // Remove a character
                this.currentCharIndex--;
                this.textSpan.textContent = currentWord.substring(0, this.currentCharIndex);

                if (this.currentCharIndex === 0) {
                    this.isDeleting = false;
                    this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                    // Pause before typing next word
                    setTimeout(() => this.type(), this.pauseAfterDelete);
                    return;
                }

                // Variable delete speed for more realism
                const speed = this.deleteSpeed + Math.random() * 30;
                setTimeout(() => this.type(), speed);
            } else {
                // Add a character
                this.currentCharIndex++;
                this.textSpan.textContent = currentWord.substring(0, this.currentCharIndex);

                if (this.currentCharIndex === currentWord.length) {
                    // Finished typing, pause then delete
                    setTimeout(() => {
                        this.isDeleting = true;
                        this.type();
                    }, this.pauseAfterType);
                    return;
                }

                // Variable type speed for more realism
                let speed = this.typeSpeed + Math.random() * 50;

                // Occasionally pause slightly longer (simulating human hesitation)
                if (Math.random() < 0.1) {
                    speed += 100;
                }

                setTimeout(() => this.type(), speed);
            }
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const typewriterElement = document.querySelector('.typewriter-container');

        if (typewriterElement) {
            const words = Array.from(typewriterElement.querySelectorAll('.typewriter-word'))
                .map(el => el.textContent.trim());

            if (words.length > 0) {
                new Typewriter(typewriterElement, {
                    words: words,
                    typeSpeed: 70,
                    deleteSpeed: 40,
                    pauseAfterType: 2500,
                    pauseAfterDelete: 400
                });
            }
        }
    });
})();
