let scrapeEmails = document.getElementById("scrapeEmails");

let list = document.getElementById("emailList");

// Handler to recievw emails from content script 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Get emails 
    let emails = request.emails;
    // alert(emails);

    // Display emails on popup 
    if(emails == null || emails.length == 0){
        // No emails
        let li = document.createElement("li");
        li.innerText = "No emails found";
        list.appendChild(li);
    } else{
        // Display emails 
        emails.forEach((email)  => {
            let li = document.createElement("li");
        li.innerText = email;
        list.appendChild(li);
        })
    }
})



// button's click event listner
scrapeEmails.addEventListener("click", async () => {
    // alert("hello");

    // get the current active tab 
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});


    //execute script to parse emails on page 
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,

    });
})



// fucntion to scrape emails 
function scrapeEmailsFromPage(){
    // alert("hello !!!")


    // Rgex to parse emails from html code 
    const emailRgEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;




    // parse emails from the html of the page 
    let emails = document.body.innerHTML.match(emailRgEx);

    // alert(emails);




    // send emails to popup 
    chrome.runtime.sendMessage({emails});
}