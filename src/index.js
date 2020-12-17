const { app, BrowserWindow } = require('electron');
const path = require('path');
const sleep = require('util').promisify(setTimeout)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const webhook = require("webhook-discord")
 
const Hook = new webhook.Webhook("https://discord.com/api/webhooks/788941983875072020/jpA-0lSDozCmtMufJkKoJpLCPyX8KLyBlgwx0sVXHp2FAJm8HTL-MZfBB8ppZkcZhWHl")
var DiscordHook ={}
for (const key of ['info','warn','err','success']) {
  DiscordHook[key] = (a,b) => {
    try {Hook[key](a,b.substring(0, 1024))} 
    catch (error) {console.log(error)}
  }
}

// DiscordHook.info("DATE AVAILABLE","19")

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true, contextIsolation: true 
    }
  });
  mainWindow.setMenuBarVisibility(false);
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const puppeteer = require('puppeteer')

async function main(params) {
  let browser = await puppeteer.launch({ 
    headless: false ,
    userDataDir: __dirname +'/tmp',
  })
  const pages = await browser.pages()
  const page = pages[0]
  await page.setViewport({ width: 300, height: 250 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  if(sleepTime) await sleep(sleepTime)
  // let cookies = await page.cookies('https://www.newegg.com/')
}

const {ipcMain} = require('electron');

// Attach listener in the main process with the given ID
ipcMain.on('request-mainprocess-action', (event, arg) => {
  console.log(arg);
  if(arg.message == 'login_old'){
    login()
  }
  if(arg.message == 'search'){
    search()
  }
  if(arg.message == 'again'){
    again()
  }

});

let resolver = null;
ipcMain.on('code', (event, arg) => {
  resolver(arg)
});
function evalRemote(code) {
  return new Promise(function(resolve, reject) {
    resolver = resolve;
    mainWindow.webContents.send('code', code);
  });
}

let browser = null;
let page = null;
async function login(params) {
  console.log(__dirname +'/tmp3');
  browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: "C:\\Users\\gene\\AppData\\Local\\Google\\Chrome\\User Data",
      executablePath:"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.setViewport({ width: 1000, height: 1000 });
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    if(req.url().includes("code=member")){
      console.log(req.method(),req.url());
      setTimeout(loggedin,200)
      // loggedin();
    }
    if(req.url().includes("code=step2")){
      console.log(req.method(),req.url());
      setTimeout(loggedin,200)
      // loggedin();
    }
    // console.log(req.url());
    req.continue();
  });
  await page.goto("https://www.epicpass.com/", { waitUntil: 'networkidle2' })


}

async function search(params) {
  console.log(__dirname +'/tmp3');
  browser = await puppeteer.launch({ 
    headless: false,
    // userDataDir: "C:\\Users\\gene\\AppData\\Local\\Google\\Chrome\\User Data",
    executablePath:"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.setViewport({ width: 1000, height: 1000 });

  await page.goto("https://www.epicpass.com/plan-your-trip/lift-access/reservations.aspx", { waitUntil: 'networkidle2' })

    // 8 is northstar
  await page.select("#PassHolderReservationComponent_Resort_Selection",'8')

  await page.click("#passHolderReservationsSearchButton")
}

async function search(params) {
  console.log(__dirname +'/tmp3');
  browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: __dirname +'/tmp3',
    // userDataDir: "C:\\Users\\gene\\AppData\\Local\\Google\\Chrome\\User Data",
    executablePath:"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.setViewport({ width: 1000, height: 1000 });

  await page.goto("https://www.epicpass.com/plan-your-trip/lift-access/reservations.aspx", { waitUntil: 'networkidle2' })

  if(page.url().includes('account/login.aspx')){
    await submit_login();
  }
  // await page.focus("#txtUserName_3")
  // await page.type('#txtUserName_3', 'sircambridge@gmail.com');
  // await page.type('#txtPassword_3', 'd3vl0pe');

  // await page.click("#returningCustomerForm_3 button.accountLogin__cta")
  // await page.waitForNavigation({waitUntil:'networkidle2'})

    // 8 is northstar
  // await page.select("#PassHolderReservationComponent_Resort_Selection",'8')

  // await page.click("#passHolderReservationsSearchButton")
  await again()
}

// this function looks for the username and password box, types in genes 
// username and password and hits the submit button
// theres seems to be two variants of the page, txtUserName_1 and txtUserName_3
async function submit_login(params) {
  try {
    await page.waitForSelector("#txtUserName_1", { timeout: 5000 })
    const input = await page.$('#txtUserName_1');
    await input.click({ clickCount: 3 })
    await input.type("sircambridge@gmail.com");
    // await page.focus("#txtUserName_1")
    // await page.type('#txtUserName_1', 'sircambridge@gmail.com');
    await page.type('#txtPassword_1', 'd3vl0pe');
    await page.click("#returningCustomerForm_1 button.accountLogin__cta")
  } catch (error) {
    console.log("The element didn't appear.")
  }
  try {
    await page.waitForSelector("#txtUserName_3", { timeout: 5000 })
    const input = await page.$('#txtUserName_3');
    await input.click({ clickCount: 3 })
    await input.type("sircambridge@gmail.com");
    await page.type('#txtPassword_3', 'd3vl0pe');
    await page.click("#returningCustomerForm_3 button.accountLogin__cta")
  } catch (error) {
    console.log("The element didn't appear.")
  }
  // await page.focus("#txtUserName_1")
  // await page.type('#txtUserName_1', 'sircambridge@gmail.com');
  // await page.type('#txtPassword_1', 'd3vl0pe');

  // await page.click("#returningCustomerForm_1 button.accountLogin__cta")
  await page.waitForNavigation({waitUntil:'networkidle2'})
}

// keep track of these two days, 19th and 20th
// initially set to unavailable
var states = {
  '20':false,
  '19':false
}

// this function calls itself repeatedly every 15 seconds
async function again(){

  try {
    // if we got signed out and redirected to the login page,
    // run the sign in function instead
    if(page.url().includes('account/login.aspx')){
      await submit_login();
    }
    // await page.reload({waitUntil:'networkidle2'})

    // select "6" for heavenly, and hit "check availability"
    await page.select("#PassHolderReservationComponent_Resort_Selection",'6')
    
    await page.click("#passHolderReservationsSearchButton")
    await sleep(2000)
    // await page.waitForNavigation({waitUntil:'networkidle2'})
  
    // select "8" for northstar, and hit "check availability"
    await page.select("#PassHolderReservationComponent_Resort_Selection",'8')
    
    await page.click("#passHolderReservationsSearchButton")
    await sleep(2000)
    // await page.waitForNavigation({waitUntil:'networkidle2'})
  
    // use the css selector to extract the calender dates
    let days = await page.$$(".passholder_reservations__calendar__day")
    // console.log(days);
  
    // let searchDay = '20';

    // for each day, check if the table cell has the css class "--disabled"
    // and check against the last known state of the dates availablity
    // and if the state has changed, notify the discord channel
    
    for (const day of days) {
      // console.log(await day.getProperty("innerText"));
      const text = await page.evaluateHandle(element => element.innerText, day);
      // console.log(await text.jsonValue());
      let this_day = await text.jsonValue();
      for (const searchDay in states) {
        if(this_day == searchDay){        
          const disabled = await page.evaluateHandle(element => element.classList.contains("passholder_reservations__calendar__day--disabled"), day);
          let has_disabled = await disabled.jsonValue();
          console.log('has_disabled',has_disabled)
  
          let is_available = !has_disabled;
  
          if(!states[searchDay] && is_available){
            DiscordHook.info("Northstar","Dec "+searchDay+" Became Available")
            states[searchDay] = is_available;
          }
  
          if(states[searchDay] && !is_available){
            DiscordHook.info("Northstar","Dec "+searchDay+" Became Unavailable")
            states[searchDay] = is_available;
          }
        }
      }
    }
  } catch (error) {
    
  } finally {
    setTimeout(()=>{
      again()
    },15000)
  }
  

  
}