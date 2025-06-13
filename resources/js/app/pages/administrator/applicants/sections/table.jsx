import { useSelector } from "react-redux";

export default function ApplicantsTable() {
    const { exams } = useSelector((store) => store.exams);
    console.log("exams", exams);
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Name of Applicant
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Scenario
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Grammar and Spelling
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Word Per Minute
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Net Word Per Minute
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Accuracy
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Total
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {exams?.data?.map((res) => {
                                    const total_grammar_and_spelling =
                                        (res.grammar_and_spellings.reduce(
                                            (sum, item) =>
                                                sum + Number(item.score),
                                            0
                                        ) /
                                            res.grammar_and_spellings.length) *
                                        100;
                                    const total_scenarios =
                                        (res.scenarios.reduce(
                                            (sum, item) =>
                                                sum + Number(item.score),
                                            0
                                        ) /
                                            res.scenarios.length) *
                                        10;
                                    const word_per_min =
                                        (res.typing_test.word_per_minute / 40) *
                                        100;

                                    const net_word_per_min =
                                        (res.typing_test.net_word_per_minute /
                                            40) *
                                        100;
                                    const status = (
                                        (total_scenarios +
                                            Number(total_grammar_and_spelling) +
                                            word_per_min +
                                            net_word_per_min +
                                            Number(res.typing_test.accuracy)) /
                                        5
                                    ).toFixed(2);
                                    console.log(
                                        "dadada",
                                        (res.scenarios.reduce(
                                            (sum, item) =>
                                                sum + Number(item.score),
                                            0
                                        ) /
                                            res.scenarios.length) *
                                            10
                                    );
                                    return (
                                        <tr key={res.email}>
                                            <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                                {res.name}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {total_scenarios}%
                                            </td>

                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {total_grammar_and_spelling.toFixed(
                                                    2
                                                )}
                                                %
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {word_per_min}%
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {net_word_per_min}%
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {res.typing_test.accuracy}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {status}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                <button
                                                    className={`px-4 py-1.5 rounded-xl font-semibold text-white shadow-md transition-all duration-300 ${
                                                        status > 75
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : "bg-red-500 hover:bg-red-600"
                                                    }`}
                                                >
                                                    {status > 75
                                                        ? "PASSED"
                                                        : "FAILED"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
