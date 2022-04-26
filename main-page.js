const loginButton = document.getElementById("logOff-button");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location = "./loginPage.html";
})

function logOffFunction(){
    window.location = "./loginPage.html";
}