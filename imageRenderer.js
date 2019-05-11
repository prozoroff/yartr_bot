const puppeteer = require('puppeteer')

let page

const options = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
const width = 400
const padding = 9;

function renderImage(htmlString, middleware) {
    return new Promise(function (resolve, reject) {
        try {
            (async () => {
                if (!page) {
                    const browser = await puppeteer.launch(options);
                    page = await browser.newPage();
                }

                await page.setContent(htmlString);
                let middlewareData

                if (middleware) {
                    middlewareData = await page.evaluate((strFn) => {
                        const middlewareFunction = new Function(' return (' + strFn + ').apply(null, arguments)');
                        return middlewareFunction(document)
                    }, middleware.toString());
                }

                await page.addStyleTag({ path: './restyle.css' })

                const height = await page.evaluate(padding => {
                    const lastChild = document.body.lastElementChild
                    return lastChild.offsetTop + lastChild.offsetHeight + padding
                }, padding);

                await page.setViewport({ width: width + padding * 2, height: height })

                const imagePath = `./screenshots/${Date().toString()}.png`;
                await page.screenshot({ path: imagePath });

                resolve({ imagePath, middlewareData });
            })();
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = renderImage;
