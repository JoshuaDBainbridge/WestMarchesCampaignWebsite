let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");

let message = "This is a place holder for annoucement text!"
document.getElementById("announcement_text").innerHTML = message;

function sidebarFunction() {
    console.log("Click"); 
    sidebar.classList.toggle("active");
  if(sidebar.classList.contains("active")){
    sidebarBtn.classList.replace("bx-menu" ,"bx-menu-alt-right");
  }else
    sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}

//const loginButton = document.getElementById("logOff-button");
// loginButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     window.location = "../LoginPage/loginPage.html";
// })
// function logOffFunction(){
//     window.location = "../LoginPage/loginPage.html";
// }