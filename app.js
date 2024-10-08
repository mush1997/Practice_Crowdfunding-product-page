const openMenuBtn = document.getElementById("openMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const bookmarkBtn = document.querySelector(".bookmark");
const backProjBtn = document.querySelector("#project .btn");
const rewardBtn = document.querySelectorAll("#introduction .btn");
const closeModalBtn = document.getElementById("closeModal");
const continueBtn = document.querySelectorAll(".customPledge .btn");
const doneBtn = document.querySelector("#thankMsg .btn");

const pledgeModal = document.getElementById("pledgeModal");
const labels = document.querySelectorAll("article:not(.notAllowed) label");
const customPledgeInputs = document.querySelectorAll(".customPledge input");
const thankMsg = document.getElementById("thankMsg");
let pledge = 0;

function openMenu() {
    openMenuBtn.style.display = "none";
    closeMenuBtn.style.display = "block";
    document.body.querySelector("header ul").style.display = "block";
}

function closeMenu() {
    closeMenuBtn.style.display = "none";
    openMenuBtn.style.display = "block";
    document.body.querySelector("header ul").style.display = "none";
}

function setBookmark(event) {
    event.currentTarget.classList.toggle("saved");

    if (event.currentTarget.classList.contains("saved")) {
        event.currentTarget.firstElementChild.textContent = "Bookmarked";
    } else {
        event.currentTarget.firstElementChild.textContent = "Bookmark";
    }
}

function showPledgeModal(event) {
    document.body.classList.add("shadow");
    pledgeModal.classList.add("show");
    pledgeModal.style.top = (window.scrollY + 80) + "px";

    if (event.target.closest("article")) {
        let optionTitle = event.target.closest("article").querySelector("h3").textContent;
        let pledgeItem = Array.from(labels).findIndex(label => label.querySelector("h4").textContent === optionTitle);

        setPledgeCSS(labels[pledgeItem], labels[pledgeItem].parentElement);
        pledge = labels[pledgeItem].parentElement.querySelector(".customPledge input").getAttribute("placeholder").slice(2);
    }
}

function backToPage() {
    document.body.classList.remove("shadow");
    pledgeModal.classList.remove("show");
    thankMsg.classList.remove("show");
    clearPledgeModal();
}

function showThankMsg() {
    pledgeModal.classList.remove("show");
    thankMsg.classList.add("show");
    thankMsg.style.top = ((window.innerHeight - thankMsg.clientHeight) / 2 + window.scrollY) + "px";
    updateSummary(parseInt(pledge));
}

function selectPledge(event) {
    event.stopPropagation();
    clearPledgeModal();

    let clickedLabel = event.currentTarget;
    let selectedOption = clickedLabel.parentElement;
    setPledgeCSS(clickedLabel, selectedOption);

    if (selectedOption.classList.contains("reward")) {
        pledge = selectedOption.querySelector(".customPledge input").getAttribute("placeholder").slice(2);
    }
}

function setPledgeCSS(label, article) {
    label.classList.add("clicked");
    article.classList.add("picked");
    if (article.classList.contains("reward")) { article.querySelector(".customPledge").classList.remove("hide"); }
}

function recordPledge(event) {
    let customInput = event.target;
    let defaultPledge = customInput.getAttribute("placeholder").slice(2);

    pledge = customInput.value;
    if (!parseInt(customInput.value) || parseInt(customInput.value) < parseInt(defaultPledge)) { pledge = defaultPledge; }
}

function clearPledgeModal() {
    pledge = 0;

    labels.forEach(label => {
        label.classList.remove("clicked");
        label.parentElement.classList.remove("picked");
        if (label.parentElement.classList.contains("reward")) { label.parentElement.querySelector(".customPledge").classList.add("hide"); }
    });

    customPledgeInputs.forEach(input => input.value = "");
}

function updateSummary(pledgeAmount) {
    const amount = document.querySelectorAll(".records h2")[0];
    const backers = document.querySelectorAll(".records h2")[1];
    const progressBar = document.querySelector(".progress div");

    let updatedAmount = (Number(amount.textContent.slice(1).replaceAll(",", "")) + pledgeAmount);
    amount.textContent = "$" + updatedAmount.toLocaleString();

    let updatedbackers = (Number(backers.textContent.replaceAll(",", "")) + 1);
    backers.textContent = updatedbackers.toLocaleString();

    progressBar.style.width = (updatedAmount / 100000 * 100).toFixed() + "%";
}

openMenuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);
bookmarkBtn.addEventListener("click", setBookmark);
backProjBtn.addEventListener("click", showPledgeModal);
rewardBtn.forEach(btn => btn.addEventListener("click", showPledgeModal));
closeModalBtn.addEventListener("click", backToPage);
continueBtn.forEach(btn => btn.addEventListener("click", showThankMsg));
doneBtn.addEventListener("click", backToPage);

labels.forEach(label => label.addEventListener("click", selectPledge));
customPledgeInputs.forEach(input => input.addEventListener("input", recordPledge));

window.addEventListener("resize", () => {
    if (window.innerWidth > 660) {
        openMenuBtn.style.display = "none";
        closeMenuBtn.style.display = "none";
        document.body.querySelector("header ul").style.display = "block";
    } else {
        openMenuBtn.style.display = "block";
        document.body.querySelector("header ul").style.display = "none";
    }
})