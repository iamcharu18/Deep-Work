let contactFormEl = document.getElementById("contact-form");
let nameEl = document.getElementById("name");
let emailEl = document.getElementById("email");
let subjectEl = document.getElementById("subject");
let phoneEl = document.getElementById("phone");
let messageEl = document.getElementById("message");
let categoryEl = document.getElementById("category");
let submitEl = document.getElementById("submit");



// console.log(1);
contactFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    let selectedOptions = Array.from(categoryEl.selectedOptions).map(({ value }) => value);
    let formData = {
        name: nameEl.value,
        email: emailEl.value,
        subject: subjectEl.value,
        phone: phoneEl.value,
        category: selectedOptions,
        message: messageEl.value
    }

    submitEl.innerText = "Sending Message..."

    let options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
    };

    // console.log(formData);

    let url = "/sendmail";

    await fetch(url, options)
        .then(function (response) {
            return response;
        })
        .then(function (jsonData) {
            if (jsonData.status !== 200) {
                submitEl.innerText = "Something Went Wrong!";
            }

            if (jsonData.status === 200) {
                console.log('success');
                nameEl.value = "";
                emailEl.value = "";
                subjectEl.value = "";
                messageEl.value = "";
                phoneEl.value = "";
                categoryEl.value = "";
                submitEl.innerText = "Message Sent Successfully!";
            }
        });
});