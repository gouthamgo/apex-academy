'use client';

import { useEffect } from 'react';

export function CodeCopyHandler() {
  useEffect(() => {
    const handleCopy = async (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const code = button.getAttribute('data-code');

      if (!code) return;

      // Decode the code (handle escaped quotes and newlines)
      const decodedCode = code
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\\n/g, '\n');

      try {
        await navigator.clipboard.writeText(decodedCode);

        // Update button to show success
        const copyIcon = button.querySelector('.copy-icon');
        const checkIcon = button.querySelector('.check-icon');
        const copyText = button.querySelector('.copy-text');

        if (copyIcon && checkIcon && copyText) {
          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');
          copyText.textContent = 'Copied!';

          // Reset after 2 seconds
          setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
            copyText.textContent = 'Copy';
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };

    // Attach event listeners to all copy buttons
    const copyButtons = document.querySelectorAll('.copy-code-btn');
    copyButtons.forEach(button => {
      button.addEventListener('click', handleCopy);
    });

    // Cleanup
    return () => {
      copyButtons.forEach(button => {
        button.removeEventListener('click', handleCopy);
      });
    };
  }, []);

  return null; // This component doesn't render anything
}
