const loginButton = document.getElementById("logOff-button");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location = "./loginPage.html";
})