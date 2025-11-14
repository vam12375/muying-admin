/**
 * 动画数字组件
 * Animated Number Component with CountUp effect
 */

'use client';

import React, { useEffect, useRef } from 'react';
import CountUp from 'react-countup';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 1,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const prevValue = useRef(value);

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <CountUp
      start={prevValue.current}
      end={value}
      duration={duration}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      className={className}
      preserveValue
    />
  );
}
