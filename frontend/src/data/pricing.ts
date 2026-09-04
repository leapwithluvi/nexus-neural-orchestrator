export const pricingTiers = [
    {
        name: "Public Access",
        metrics: ["Free Entry", "Message Limits", "Groq Core", "Shared Instance"],
        pricing: "FREE*",
        cta: "Connect System",
        subtext: "*Limited Alpha Access",
        href: "/",
        disabled: false
    },
    {
        name: "Developer Beta",
        metrics: ["Priority Stream", "Extended Limits", "Direct SDK Access", "Analytics"],
        pricing: "BETA",
        cta: "System Closed",
        subtext: "Under Development",
        href: "#",
        disabled: true
    },
    {
        name: "Enterprise",
        metrics: ["In-VPC Control", "Custom Model 4.0", "Full Redundancy", "SLA Support"],
        pricing: "SCALE",
        cta: "Liaison Office",
        subtext: "Commercial Deployment",
        href: "#contact",
        disabled: true
    }
];
