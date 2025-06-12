import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import SidebarSection from "@/app/_sections/sidebar-section";
import TopbarSection from "@/app/_sections/topbar-section";
import { current } from "@reduxjs/toolkit";

const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
];

export default function Layout({ children }) {
    const path = window.location.pathname.split("/")[2];
    const navigation = [
        {
            name: "Dashboard",
            href: "/administrator/dashboard",
            icon: HomeIcon,
            current: path == "dashboard",
        },
        // {
        //     name: "Team",
        //     href: "#",
        //     icon: UsersIcon,
        //     current: false,
        //     children: [
        //         { name: "Agent", href: "#", icon: HomeIcon, current: true },
        //         { name: "Register", href: "#", icon: HomeIcon, current: false },
        //     ],
        // },
        {
            name: "Applicant",
            href: "/administrator/applicants",
            icon: FolderIcon,
            current: path == "applicants",
        },
        // { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
        // {
        //     name: "Documents",
        //     href: "#",
        //     icon: DocumentDuplicateIcon,
        //     current: false,
        // },
        // { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
    ];
    return (
        <>
            <div>
                <SidebarSection navigation={navigation} />
                <div className="lg:pl-72">
                    <TopbarSection userNavigation={userNavigation} />

                    <main className="py-4">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
