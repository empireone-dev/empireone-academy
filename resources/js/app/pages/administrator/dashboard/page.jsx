import React, { useState } from "react";
import Layout from "../layout";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import { H1Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import TextArea from "@/app/_components/textarea";
import Radio from "@/app/_components/radio";
import Modal from "@/Components/Modal";

export default function Page() {
    const [open, setOpen] = useState(false);
    return (
        <Layout>
            {/* <div className="flex gap-3">
                <Button loading={true} variant="primary">
                    hello
                </Button>
                <Button>Click Me</Button>

                <Button variant="secondary" size="md">
                    Secondary Large
                </Button>

                <Button variant="danger">Can't Click</Button>

                <Button
                    loading={true}
                    variant="outline"
                    className="bg-blue-600"
                    size="sm"
                >
                    Small Outline
                </Button>
            </div>
            <br />
            <Input
                error="Error Sya"
                iconLeft={<UserCircleIcon className="h-6" />}
                label="Name"
            />
            <br />
            <TextArea error="Error Sya" label="Name" />
            <br />
            <div className="flex gap-3">
                <Radio name="a" value="dada" label="heello" />
                <Radio name="a" value="dwaaaada" label="heello" />
            </div>

            <Button onClick={() => setOpen(true)}>Open</Button>
            <Modal open={open} setOpen={setOpen}>
                this is the body
            </Modal> */}
        </Layout>
    );
}
