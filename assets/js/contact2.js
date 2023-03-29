let contactFormEl = document.getElementById("startup-contact-form");
let nameEl = document.getElementById("name");
let emailEl = document.getElementById("email");
let phoneEl = document.getElementById("phone");
let subjectEl = document.getElementById("subject");
let submitEl = document.getElementById("submit");

contactFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = {
        name: nameEl.value,
        email: emailEl.value,
        phone: phoneEl.value,
        subject: subjectEl.value,
    }

    submitEl.innerText = "Sending Message..."

    let options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
    };

    // console.log(formData);

    let url = "/sendmail-2";

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
                phone.value = "";
                submitEl.innerText = "Message Sent Successfully!";
            }
        });
});