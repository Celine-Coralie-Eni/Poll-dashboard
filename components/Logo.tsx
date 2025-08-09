import { motion, easeOut } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      whileHover={{ 
        scale: 1.1,
        rotateY: 15,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D Blue Circular Disc */}
      <div className="relative w-full h-full">
        {/* Main blue disc with 3D effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full shadow-2xl transform rotate-12">
          {/* Highlight for 3D effect */}
          <div className="absolute top-1 left-2 w-3 h-3 bg-blue-300 rounded-full opacity-60 blur-sm"></div>
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full"></div>
        </div>
        
        {/* Ascending bars */}
        <div className="absolute inset-0 flex items-end justify-center pb-2 space-x-1">
          {/* Left bar - shortest */}
          <motion.div
            className="w-1.5 bg-gray-200 rounded-sm"
            initial={{ height: 0 }}
            animate={{ height: '20%' }}
            transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          />
          
          {/* Middle bar - medium */}
          <motion.div
            className="w-1.5 bg-gray-200 rounded-sm"
            initial={{ height: 0 }}
            animate={{ height: '35%' }}
            transition={{ delay: 0.4, duration: 0.6, ease: easeOut }}
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          />
          
          {/* Right bar - tallest */}
          <motion.div
            className="w-1.5 bg-gray-200 rounded-sm"
            initial={{ height: 0 }}
            animate={{ height: '50%' }}
            transition={{ delay: 0.6, duration: 0.6, ease: easeOut }}
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          />
        </div>
        
        {/* Base line connecting the bars */}
        <motion.div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-300 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '2rem' }}
          transition={{ delay: 0.8, duration: 0.4, ease: easeOut }}
        />
      </div>
    </motion.div>
  );
}

export default Logo;
