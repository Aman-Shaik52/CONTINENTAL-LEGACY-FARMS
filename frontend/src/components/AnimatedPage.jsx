import { motion as Motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -14, filter: 'blur(5px)' },
};

const pageTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const AnimatedPage = ({ children }) => (
  <Motion.main
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    {children}
  </Motion.main>
);

export default AnimatedPage;