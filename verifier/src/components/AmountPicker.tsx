

export default function AmountPicker({ amount, setAmount }: { amount: number, setAmount: (amount: number) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center">
                <button
                    onClick={() => setAmount(amount - 1)}
                    disabled={amount <= 1}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-md disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                    -
                </button>
                <input
                    value={amount}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                            setAmount(value);
                        } else if (value >= 100) {
                            setAmount(100);
                        } else {
                            setAmount(1);
                        }
                    }}
                    className="bg-white py-2 text-center text-black w-10"
                    min={1}
                    max={100}
                />
                <button
                    onClick={() => setAmount(amount + 1)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    )
}