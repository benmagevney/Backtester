import { Button, Checkbox, Collapse, NumberInput, Select } from "@mantine/core";
import "./InputSelector.css";
import { useState } from "react";
import { SupportedSignal } from "../utils/App.type";

type MACDSelectorProps = {
    useMACD: boolean,
    setMACD: React.Dispatch<React.SetStateAction<boolean>>,
    MACDFast: number | undefined,
    setMACDFast: React.Dispatch<React.SetStateAction<number | undefined>>,
    MACDSlow: number | undefined,
    setMACDSlow: React.Dispatch<React.SetStateAction<number | undefined>>,
    MACDSignal: number | undefined,
    setMACDSignal: React.Dispatch<React.SetStateAction<number | undefined>>,
    MACDSymbol: string | undefined,
    setMACDSymbol: React.Dispatch<React.SetStateAction<SupportedSignal | undefined>>,
    MACDValue: number | undefined,
    setMACDValue: React.Dispatch<React.SetStateAction<number | undefined>>,

};

export function MACDSelector({ useMACD, setMACD, MACDFast, setMACDFast, MACDSlow, setMACDSlow, MACDSignal, setMACDSignal, MACDSymbol, setMACDSymbol, MACDValue, setMACDValue }: MACDSelectorProps) {

    const [opened, setOpened] = useState<boolean>(true);

    const toggleUseMACD = () => {
        setMACD(!useMACD);
        if (!useMACD) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }


    return (
        <div>
            <div className="statHeader" >
                <div className="statTitle">MACD</div>
                <Checkbox
                    checked={useMACD}
                    label="Use MACD"
                    onChange={() => toggleUseMACD()}
                />
                <Button style={{ marginLeft: "10px" }} size="xs" onClick={() => setOpened(!opened)}>{opened ? "Close" : "Show Details"}</Button>
            </div>
            <Collapse in={opened}>
                <div className="selectGroup">
                    <NumberInput disabled={!useMACD} className="selectItem" label="Fast Moving Avg Period" value={MACDFast} onChange={(value) => setMACDFast(typeof value === "number" ? value : parseInt(value))} min={0}
                        error={useMACD && (typeof MACDFast !== "number" || Number.isNaN(MACDFast))} />
                    <NumberInput disabled={!useMACD} className="selectItem" label="Slow Moving Avg Period" value={MACDSlow} onChange={(value) => setMACDSlow(typeof value === "number" ? value : parseInt(value))} min={0}
                        error={useMACD && (typeof MACDSlow !== "number" || Number.isNaN(MACDSlow))} />
                    <NumberInput disabled={!useMACD} className="selectItem" label="Signal Period" value={MACDSignal} onChange={(value) => setMACDSignal(typeof value === "number" ? value : parseInt(value))} min={0}
                        error={useMACD && (typeof MACDSignal !== "number" || Number.isNaN(MACDSignal))} />
                    <Select disabled={!useMACD} className="selectItem" label="Symbol"
                        data={[">", "<", ">=", "<="]} value={MACDSymbol} onChange={(value) => setMACDSymbol(value == null ? undefined : value as SupportedSignal)}
                        error={useMACD && MACDSymbol === undefined} />
                    <NumberInput disabled={!useMACD} className="selectItem" label="Value ($)" prefix="$" min={0} value={MACDValue} onChange={(value) => setMACDValue(typeof value === "number" ? value : parseInt(value))}
                        error={useMACD && (typeof MACDValue !== "number" || Number.isNaN(MACDValue))} />
                </div>
            </Collapse>
        </div>
    )
};
