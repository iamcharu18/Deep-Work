let contactFormEl = document.getElementById("contact-form");
let nameEl = document.getElementById("name");
let emailEl = document.getElementById("email");
let subjectEl = document.getElementById("subject");
let messageEl = document.getElementById("message");
let submitEl = document.getElementById("submit");
// console.log(1);
contactFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = {
        name: nameEl.value,
        email: emailEl.value,
        subject: subjectEl.value,
        message: messageEl.value
    }

    submitEl.innerText = "Sending Message..."

    let options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
    };

    // console.log(1);

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
                submitEl.innerText = "Message Sent Successfully!";
            }
        });
});