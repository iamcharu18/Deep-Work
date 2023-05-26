exports.services = (req, res) => {
    res.render("services", {
        title: "Services",
    });
}

const services = [
    { slug: "accounting-and-bookkeeping-service", title: "Accounting and Bookkeeping Service" },
    { slug: "gst-service", title: "GST Services" },
    { slug: "it-returns", title: "Income Tax returns" },
    { slug: "payroll-management", title: "Payroll Management" },
    { slug: "secretarial-services", title: "Secretarial Services" },
    { slug: "statutory-and-other-compliances", title: "Statutory & other Compliances" },
    { slug: "outsourcing-and-virtual-cfo-services", title: "Outsourcing" },
    { slug: "profitability-analytics-and-management", title: "Profitability Analytics and Management" },
    { slug: "business-valuation", title: "Business Valuation" },
    { slug: "ipr-service", title: "IPR Service" },
    { slug: "mergers-and-acquisitions", title: "Mergers and Acquisitions" },
];

exports.individual_service = (req, res) => {
    const { slug } = req.params;
    const service = services.find(s => s.slug === slug);

    if (service) {
        const template = `services/${slug}`;
        res.render(template, {
            title: service.title
        });
    } else {
        res.render("404", {
            title: "Service not found",
        });
    }
}