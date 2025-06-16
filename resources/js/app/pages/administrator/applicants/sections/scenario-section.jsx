import Modal from "@/app/_components/modal";
import React, { useState } from "react";

export default function ScenarioSection({ data }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)} className="underline">
                {data.total_scenarios}%
            </button>
            <Modal isOpen={open} title="Answers" onClose={() => setOpen(false)}>
                <div className="overflow-auto h-[500px]">
                    {data?.scenarios?.map((res, i) => (
                    <div className="flex flex-col gap-3">
                        <div></div>
                        <div>
                            
                            <div>{i+1} Answer:{res.answer}</div>
                            <div className="underline">Score:{res.score}</div>
                        </div>
                    </div>
                ))}
                </div>
            </Modal>
        </>
    );
}
