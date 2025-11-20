'use client';

import { useEffect, useRef } from 'react';

/**
 * 流体渐变背景组件
 * 实现柔和的渐变流动效果
 * Source: 云端育儿室设计文档 (ui.md)
 * 
 * 
 * 使用CSS动画实现，性能优于Canvas
 */
export default function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* 主背景色 */}
      <div className="absolute inset-0 bg-[#FDFBF7]" />
      
      {/* 流动的渐变球 */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      <style jsx>{`
        .blob {
          position: absolute;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: morph 15s ease-in-out infinite;
        }

        .blob-1 {
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 100%);
          animation: morph 20s ease-in-out infinite, float1 25s ease-in-out infinite;
        }

        .blob-2 {
          bottom: -10%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
          animation: morph 18s ease-in-out infinite reverse, float2 30s ease-in-out infinite;
        }

        .blob-3 {
          top: 30%;
          right: 20%;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%);
          opacity: 0.4;
          animation: morph 22s ease-in-out infinite, float3 28s ease-in-out infinite;
        }

        .blob-4 {
          bottom: 30%;
          left: 20%;
          width: 450px;
          height: 450px;
          background: linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%);
          opacity: 0.3;
          animation: morph 25s ease-in-out infinite reverse, float4 32s ease-in-out infinite;
        }

        @keyframes morph {
          0%, 100% {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
          25% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          75% {
            border-radius: 70% 30% 50% 60% / 40% 60% 50% 40%;
          }
        }

        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(50px, 30px) rotate(120deg) scale(1.1);
          }
          66% {
            transform: translate(-30px, 60px) rotate(240deg) scale(0.9);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-40px, -50px) rotate(-120deg) scale(1.15);
          }
          66% {
            transform: translate(60px, -30px) rotate(-240deg) scale(0.95);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, 40px) scale(1.2);
          }
        }

        @keyframes float4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, -50px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
