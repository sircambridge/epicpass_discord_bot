// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    // const replaceText = (selector, text) => {
    //   const element = document.getElementById(selector)
    //   if (element) element.innerText = text
    // }
  
    // for (const type of ['chrome', 'node', 'electron']) {
    //   replaceText(`${type}-version`, process.versions[type])
    // }
    // console.log(11123);
  
    document.querySelector('#login_old').addEventListener('click', () => {
      login_old();
    })
    document.querySelector('#search').addEventListener('click', () => {
      search();
    })
    document.querySelector('#again').addEventListener('click', () => {
      again();
    })

  })
  
  const { ipcRenderer } = require('electron');

  function login_old() {
    ipcRenderer.send('request-mainprocess-action', { message: "login_old", someData: {} });
  }
  function search() {
    ipcRenderer.send('request-mainprocess-action', { message: "search", someData: {} });
  }
  function again() {
    ipcRenderer.send('request-mainprocess-action', { message: "again", someData: {} });
  }