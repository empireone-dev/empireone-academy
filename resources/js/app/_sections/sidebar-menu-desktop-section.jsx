import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import React from "react";
import DisclosureComponent from "../_components/disclosure";
import { Link } from "@inertiajs/react";

export default function SidebarDesktopSection({
    navigation,
    setOpenIndex,
    openIndex,
}) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    return (
        <>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list">
                            {navigation.map((item, i) =>
                                !item.children ? (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                                                "group flex gap-x-3 rounded-md p-2 py-3 text-sm/6 font-semibold"
                                            )}
                                        >
                                            <item.icon
                                                aria-hidden="true"
                                                className={classNames(
                                                    item.current
                                                        ? "text-white"
                                                        : "text-gray-700 group-hover:text-blue-600",
                                                    "size-6 shrink-0"
                                                )}
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                ) : (
                                    <li key={i}>
                                        <DisclosureComponent
                                            setOpenIndex={setOpenIndex}
                                            openIndex={openIndex}
                                            item={item}
                                            i={i}
                                        />
                                    </li>
                                )
                            )}
                        </ul>
                    </li>
                    <li className="mt-auto px-2">
                        <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-black"
                        >
                            <Cog6ToothIcon
                                aria-hidden="true"
                                className="size-6 shrink-0  hover:bg-blue-700"
                            />
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
}
