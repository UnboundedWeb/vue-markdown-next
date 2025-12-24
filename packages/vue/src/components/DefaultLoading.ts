import { defineComponent, h } from 'vue';

/**
 * 默认 Loading 组件
 * 使用 SVG 动画实现加载效果
 */
export const DefaultLoading = defineComponent({
  name: 'DefaultLoading',

  setup() {
    return () =>
      h(
        'div',
        {
          class: 'markdown-loading',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          },
        },
        [
          h(
            'svg',
            {
              width: '40',
              height: '40',
              viewBox: '0 0 40 40',
              xmlns: 'http://www.w3.org/2000/svg',
              style: {
                animation: 'markdown-spin 1s linear infinite',
              },
            },
            [
              h('circle', {
                cx: '20',
                cy: '20',
                r: '18',
                fill: 'none',
                stroke: '#3b82f6',
                'stroke-width': '4',
                'stroke-dasharray': '90, 150',
                'stroke-dashoffset': '0',
                'stroke-linecap': 'round',
              }),
              h(
                'style',
                `
                @keyframes markdown-spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
              ),
            ]
          ),
        ]
      );
  },
});
