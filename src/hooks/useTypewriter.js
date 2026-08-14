import { useState, useEffect } from 'react';

export function useTypewriterPlaceholder(texts, typingSpeed = 50, deletingSpeed = 30, delayBetween = 2000) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[index];
    let timeout;

    if (!isDeleting && text === currentText) {
      timeout = setTimeout(() => setIsDeleting(true), delayBetween);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(() => {
        setText(currentText.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, texts, typingSpeed, deletingSpeed, delayBetween]);

  return text;
}
