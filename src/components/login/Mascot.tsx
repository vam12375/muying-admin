'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * 2D吉祥物组件 - 躲猫猫的小熊
 * 实现视线跟随和捂眼效果
 * Source: 云端育儿室设计文档 (ui.md)
 * 
 * 
 * 特性：
 * - 输入密码时捂住眼睛
 * - 登录成功时欢呼
 * - 登录失败时困惑
 */

interface MascotProps {
  isPasswordFocused?: boolean;
  isSuccess?: boolean;
  hasError?: boolean;
}

export default function Mascot({ isPasswordFocused, isSuccess, hasError }: MascotProps) {
  // 根据状态选择表情
  const getEmoji = () => {
    if (isSuccess) return '🎉';
    if (hasError) return '😕';
    if (isPasswordFocused) return '🙈';
    return '🐻';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      className="absolute -top-20 -right-20 z-20 pointer-events-none select-none"
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: isPasswordFocused ? [15, 10, 15] : [15, 20, 15]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* 阴影 */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full blur-md opacity-20"
          style={{ background: 'radial-gradient(circle, #FF9A9E 0%, transparent 70%)' }}
        />
        
        {/* 吉祥物主体 */}
        <motion.div
          key={getEmoji()}
          initial={{ scale: 0.8, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.8, rotate: 20 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-[120px] filter drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(255, 154, 158, 0.3))'
          }}
        >
          {getEmoji()}
        </motion.div>

        {/* 对话气泡 */}
        <AnimatePresence>
          {isPasswordFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div 
                className="px-4 py-2 rounded-2xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 154, 158, 0.3)',
                  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.2)',
                  color: '#FF9A9E'
                }}
              >
                我什么都没看见~ 👀
              </div>
              {/* 气泡尖角 */}
              <div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid rgba(255, 154, 158, 0.3)',
                  borderRight: 'none',
                  borderBottom: 'none'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 成功时的特效 */}
        <AnimatePresence>
          {isSuccess && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 2,
                    x: Math.cos((i * Math.PI * 2) / 6) * 100,
                    y: Math.sin((i * Math.PI * 2) / 6) * 100
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 text-3xl"
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
