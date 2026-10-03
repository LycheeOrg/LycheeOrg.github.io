import getReadingTime from 'reading-time';
import { defineHastPlugin, defineMdastPlugin } from 'satteri';
import type {} from '@astrojs/markdown-satteri';

// Factory so the code-block buffer is fresh for every document.
export const readingTimeMdastPlugin = () => {
  // ctx.textContent() skips fenced code blocks, so collect them separately.
  const codeBlocks: string[] = [];

  return defineMdastPlugin({
    name: 'reading-time',
    code(node) {
      codeBlocks.push(node.value);
    },
    after(root, ctx) {
      const textOnPage = [ctx.textContent(root, { includeImageAlt: true, includeHtml: true }), ...codeBlocks].join(
        '\n'
      );
      const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

      if (typeof ctx.data.astro?.frontmatter !== 'undefined') {
        ctx.data.astro.frontmatter.readingTime = readingTime;
      }
    },
  });
};

export const responsiveTablesHastPlugin = defineHastPlugin({
  name: 'responsive-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      if (ctx.parent(node).type !== 'root') return;

      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: {
          style: 'overflow:auto',
        },
        children: [],
      });
    },
  },
});
