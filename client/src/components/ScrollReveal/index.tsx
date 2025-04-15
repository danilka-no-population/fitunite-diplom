import React from 'react';
import { motion } from 'framer-motion';

const scrollVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
};

const ScrollReveal: React.FC<Props> = ({
  children,
  delay = 0.1,
  duration = 0.6,
  once = true,
}) => {
  return (
    <motion.div
      variants={scrollVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ delay, duration, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
