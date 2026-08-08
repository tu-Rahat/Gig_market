export const dashboardSections = [
    {
        title: "Job Posting & Auction",
        description:
            "Create tasks, manage advertisements, bid on work, and handle worker selection.",
        features: [
            {
                number: 1,
                title: "Manage Categories",
                description: "Create and manage gig categories.",
                path: "/categories/manage",
                status: "available",
            },
            {
                number: 2,
                title: "Post a Task",
                description: "Create a new job advertisement.",
                path: "/tasks/create",
                status: "available",
            },
            {
                number: 3,
                title: "My Advertisements",
                description:
                    "Edit or cancel your task advertisements.",
                path: "/tasks/mine",
                status: "coming",
            },
            {
                number: 4,
                title: "Browse & Bid",
                description:
                    "Browse open jobs and submit competitive bids.",
                path: "/tasks/browse",
                status: "coming",
            },
            {
                number: 5,
                title: "Live Bid Ranking",
                description:
                    "View bidders ranked by bid amount.",
                path: "/bids/ranking",
                status: "coming",
            },
            {
                number: 6,
                title: "Bid Expiration",
                description:
                    "Track remaining auction time.",
                path: "/bids/expiration",
                status: "coming",
            },
            {
                number: 7,
                title: "Worker Selection",
                description:
                    "Choose a worker from submitted bids.",
                path: "/workers/select",
                status: "coming",
            },
        ],
    },

    {
        title: "Qualification & Reputation",
        description:
            "Build your professional profile, credentials, reputation, and trust.",
        features: [
            {
                number: 8,
                title: "My Credentials",
                description:
                    "Upload certificates, licenses, and experience documents.",
                path: "/credentials",
                status: "available",
            },
            {
                number: 9,
                title: "Verification Requests",
                description:
                    "Submit credentials for verification.",
                path: "/credentials",
                status: "available",
            },
            {
                number: 10,
                title: "Credential Filtering",
                description:
                    "Find workers based on verified qualifications.",
                path: "/workers/filter",
                status: "coming",
            },
            {
                number: 11,
                title: "Professional Profile",
                description:
                    "Manage skills, experience, and portfolio.",
                path: "/profile/professional",
                status: "coming",
            },
            {
                number: 12,
                title: "Ratings & Reviews",
                description:
                    "View and manage reputation feedback.",
                path: "/reviews",
                status: "coming",
            },
            {
                number: 13,
                title: "Badges",
                description:
                    "View earned reputation and qualification badges.",
                path: "/badges",
                status: "coming",
            },
            {
                number: 14,
                title: "Compare Bidders",
                description:
                    "Compare bids, ratings, experience, and credentials.",
                path: "/bidders/compare",
                status: "coming",
            },
        ],
    },

    {
        title: "Payment, Completion & Trust",
        description:
            "Manage escrow, task completion, disputes, earnings, and spending.",
        features: [
            {
                number: 15,
                title: "Escrow Payments",
                description:
                    "Manage demo payments held for active tasks.",
                path: "/payments/escrow",
                status: "coming",
            },
            {
                number: 16,
                title: "Task Countdown",
                description:
                    "Track remaining task completion time.",
                path: "/jobs/countdown",
                status: "coming",
            },
            {
                number: 17,
                title: "Submit Completed Work",
                description:
                    "Mark work complete and submit proof.",
                path: "/jobs/completion",
                status: "coming",
            },
            {
                number: 18,
                title: "Owner Approval",
                description:
                    "Approve or reject submitted work.",
                path: "/jobs/approval",
                status: "coming",
            },
            {
                number: 19,
                title: "Auto-Release Status",
                description:
                    "Track automatic payment release.",
                path: "/payments/auto-release",
                status: "coming",
            },
            {
                number: 20,
                title: "Disputes",
                description:
                    "Raise disputes and submit supporting evidence.",
                path: "/disputes",
                status: "coming",
            },
            {
                number: 21,
                title: "Transactions & Earnings",
                description:
                    "View earnings, spending, and transaction history.",
                path: "/transactions",
                status: "coming",
            },
        ],
    },
];