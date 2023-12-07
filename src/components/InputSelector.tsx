
import { TextInput } from '@mantine/core';


type SelectorProps = {
    ticker: string,
    setTicker: React.Dispatch<React.SetStateAction<string>>,
};

export function InputSelector({ ticker, setTicker }: SelectorProps) {

    return (
        <div style={{ display: "flex", alignContent: "center" }}>
            <TextInput label="Stock Ticker" placeholder={ticker} onChange={(event) => setTicker(event.currentTarget.value)} />
        </div>
    )
};