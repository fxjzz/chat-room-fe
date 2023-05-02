import { MutableRefObject } from "react";

const scrollToBottom = (node: MutableRefObject<HTMLDivElement | null>) => {
  const scrollHeight = node.current?.scrollHeight;
  const scrollTop = node.current?.scrollTop;
  const clientHeight = node.current?.clientHeight;

  const animateScroll = (timestamp: any) => {
    const progress = (timestamp - startTime) / duration;
    const newY =
      scrollTop! + (scrollHeight! - clientHeight!) * easeInOutQuad(progress);

    node.current?.scrollTo(0, newY);

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
    }
  };

  const easeInOutQuad = (t: any) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const duration = 500; // 滚动动画持续时间
  const startTime = performance.now(); // 开始时间戳

  window.requestAnimationFrame(animateScroll);
};

export default scrollToBottom;
