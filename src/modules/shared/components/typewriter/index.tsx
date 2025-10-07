import React from 'react';
import cn from 'clsx';
import styles from './styles.module.css';

type TypewriterProps = {
  text: string;
  duration?: number; // ms, default 4000
  className?: string; // for Tailwind or extra classes
};

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  duration = 7000,
  className,
}) => {
  const steps = text.split('').length * 2;

  const style = {
    animation: `typing ${duration}ms steps(${steps}, end) forwards, blinkCaret 1s step-end infinite 1s`,
  };

  return (
    <div className={styles.container}>
      <p className={cn(styles.text, className)} style={style}>
        {text}
      </p>
    </div>
  );
};
