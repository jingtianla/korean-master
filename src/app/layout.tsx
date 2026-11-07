import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '韩语学习平台 (Korean Master) — 专为中文母语者打造',
  description:
    '集四十音发音点读、韩语音变规则高亮转写、延世韩国语汉字词源单词本、分级语法题库与错题本于一体的全栈学习平台。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
