import { defineComponent, h, PropType } from 'vue';

/**
 * 默认错误组件
 * 显示错误信息
 */
export const DefaultError = defineComponent({
  name: 'DefaultError',

  props: {
    error: {
      type: [Error, String] as PropType<Error | string>,
      required: true,
    },
  },

  setup(props) {
    const errorMessage = typeof props.error === 'string' ? props.error : props.error.message;

    return () =>
      h(
        'div',
        {
          class: 'markdown-error',
          style: {
            padding: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
          },
        },
        [
          h(
            'div',
            {
              style: {
                fontWeight: 'bold',
                marginBottom: '8px',
              },
            },
            'Markdown 渲染错误'
          ),
          h(
            'div',
            {
              style: {
                fontSize: '14px',
              },
            },
            errorMessage
          ),
        ]
      );
  },
});
