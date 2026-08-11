import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, decimals = 2, duration = 0.8, className = '' }: AnimatedNumberProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (isVisible) spring.set(value);
    else spring.set(0);
  }, [value, isVisible, spring]);

  const [displayValue, setDisplayValue] = useState(value.toFixed(decimals));

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [display]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}
