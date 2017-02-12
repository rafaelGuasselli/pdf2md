import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';
import BlockPage from '../BlockPage.jsx';
import ContentView from '../ContentView.jsx';

export default class ToBlockSystem extends Transformation {

    constructor() {
        super("To Block System");
    }

    contentView() {
        return ContentView.BLOCK;
    }

    showPageSelection() {
        return false;
    }

    transform(pages:PdfPage[]) {
        const blocks = [];
        pages.forEach(page => {
            var minDiff = 99;
            var lastY = 0;
            page.textItems.forEach(item => {
                if (lastY > 0) {
                    const yDiff = lastY - item.y - item.height;
                    if (yDiff > 0) {
                        minDiff = Math.min(minDiff, yDiff);
                    }
                }
                lastY = item.y;
            });

            var text;
            const rollup = (category) => {
                if (text && text.length > 0) {
                    // console.debug("Push[" + blocks.length + "]: " + text);
                    blocks.push({
                        category: category,
                        text: text
                    });
                }
                text = null;
            };

            lastY = 0;
            page.textItems.forEach(item => {
                if (item.markdownElement) {
                    rollup("Block");
                    text = item.markdownElement.transformText(item.text);
                    rollup(item.markdownElement.constructor.name);
                } else if (!text) {
                    text = item.text;
                } else {
                    const yDiff = lastY - item.y - item.height;
                    if (yDiff > minDiff + 2) {
                        rollup("Block");
                        text = item.text;
                    } else {
                        text += '\n' + item.text;
                    }
                }
                lastY = item.y;
            });
            rollup("Block")
        });
        return [new BlockPage({
            index: 0,
            blocks: blocks
        })];
    }

    processAnnotations(pages) {
        return pages;
    }

}