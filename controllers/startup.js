// Define an array of startup registrations with their corresponding titles
const startupRegistrations = [
    { slug: "private-limited-company-registration", title: "Private Limited Company Registration" },
    { slug: "llp-company-registration", title: "Limited Liability Partnership Company Registration" },
    { slug: "opc-registration", title: "One-Person Company (OPC) Registration" },
    { slug: "ngo-registration", title: "NGO/Section 8 Company Registration" },
    { slug: "startup-registrations", title: "Other Registrations" }
];

// Route handler for startup registrations
exports.slug = (req, res) => {
    const { slug } = req.params;
    const registration = startupRegistrations.find(r => r.slug === slug);

    if (registration) {
        const template = `startup/${slug}`;
        res.render(template, {
            title: registration.title
        });
    } else {
        res.render("404", {
            title: "Service not found",
        });
    }
};
