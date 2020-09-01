const puppeteer = require('puppeteer');
const { email, password } = require('./credentials');


(async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });
    const page = await browser.newPage();

    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://tinder.com/', ['geolocation', 'notifications']);

    await page.goto('https://tinder.com/');

    //Permissions: geolocalization
    await page.setGeolocation({ latitude: 40.4025917, longitude: -3.7135284 });


    //Cookies acceptance
    await page.waitForXPath(
        '(//*[@id="content"]/div/div[2]/div/div/div[1]/button)'
        , { timeout: 10000 });

    const [cookiesAcceptance] = await page.$x(
        '(//*[@id="content"]/div/div[2]/div/div/div[1]/button)'
    );
    cookiesAcceptance.click();

    //Facebook Login
    await page.waitForXPath(
        '(//*[@id="modal-manager"]/div/div/div[1]/div/div[3]/span/div[2]/button)'
        , { timeout: 3000 });

    const [facebookEntry] = await page.$x(
        '(//*[@id="modal-manager"]/div/div/div[1]/div/div[3]/span/div[2]/button)'
    );

    facebookEntry.click();

    //We target de Pop-up page to Login with Facebook
    const facePopupPage = new Promise(resolve => page.once('popup', resolve));


    const faceLogin = await facePopupPage;

    await faceLogin.waitForSelector('#email');
    await faceLogin.click('#email');
    await faceLogin.keyboard.type(email);
    await faceLogin.click('#pass');
    await faceLogin.keyboard.type(password);
    await faceLogin.click('#loginbutton');

    //Likes

    const swaping = async () => {
        try {
            await page.waitForXPath(
                '(//*[@id="content"]/div/div[1]/div/div/main/div/div[1]/div[1]/div[1]/div[3]/div[1]/div/span/div)'
            );
            var randomTime = Math.floor(Math.random() * 2000);
            await page.click(randomSwipe());
            setTimeout(swaping, randomTime);

        } catch (error) {
            console.log(error);
            process.exit();
        };
    };

    const randomSwipe = async () => {
        var random = Math.random();
        if (random <= 0.2) { return `[aria-label="Nope"]` }
        else { return `[aria-label="Me gusta"]` }
    };

    swaping();


})(); 