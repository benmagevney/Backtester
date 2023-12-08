import { Button, Checkbox, Collapse, NumberInput, Select, useMantineClassNamesPrefix } from "@mantine/core";
import "./InputSelector.css";
import { useState } from "react";
import { SupportedSignal, SymbolValueObject } from "../utils/App.type";
import { useDisclosure } from "@mantine/hooks";

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
    MACDSlope: SymbolValueObject,
    setMACDSlope: React.Dispatch<React.SetStateAction<SymbolValueObject>>,
    MACDSignalOptional: SymbolValueObject,
    setMACDSignalOptional: React.Dispatch<React.SetStateAction<SymbolValueObject>>,
    MACDSignalSlope: SymbolValueObject,
    setMACDSignalSlope: React.Dispatch<React.SetStateAction<SymbolValueObject>>,
    MACDSignalDiff: SymbolValueObject,
    setMACDSignalDiff: React.Dispatch<React.SetStateAction<SymbolValueObject>>,
};

export function MACDSelector({ useMACD, setMACD, MACDFast, setMACDFast, MACDSlow, setMACDSlow, MACDSignal, setMACDSignal, MACDSymbol, setMACDSymbol, MACDValue, setMACDValue, MACDSlope, setMACDSlope, MACDSignalOptional, setMACDSignalOptional, MACDSignalSlope, setMACDSignalSlope, MACDSignalDiff, setMACDSignalDiff }: MACDSelectorProps) {

    const [opened, setOpened] = useState<boolean>(false);

    const [optionalOpened, { toggle }] = useDisclosure(false);


    const toggleUseMACD = () => {
        setMACD(!useMACD);
        if (!useMACD) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }

    const saveMACDSlope = (fieldName: string, value: number | string | undefined) => {
        setMACDSlope((MACDSlope) => ({
            ...MACDSlope,
            [fieldName]: value,
        }));
    };
    const saveMACDSignalOptional = (fieldName: string, value: number | string | undefined) => {
        setMACDSignalOptional((MACDSignalOptional) => ({
            ...MACDSignalOptional,
            [fieldName]: value,
        }));
    }
    const saveMACDSignalSlope = (fieldName: string, value: number | string | undefined) => {
        setMACDSignalSlope((MACDSignalSlope) => ({
            ...MACDSignalSlope,
            [fieldName]: value,
        }));
    }
    const saveMACDSignalDiff = (fieldName: string, value: number | string | undefined) => {
        setMACDSignalDiff((MACDSignalDiff) => ({
            ...MACDSignalDiff,
            [fieldName]: value,
        }));
    }


    return (
        <div className="statGroup">
            <div className="statHeader" >
                <div className="statTitle">MACD</div>
                <Checkbox
                    checked={useMACD}
                    onChange={() => toggleUseMACD()}
                />
            </div>
            <Collapse in={opened}>
                <div className="selectGroup">
                    <NumberInput disabled={!useMACD} className="selectItem" label="Fast Moving Avg" style={{color: "white"}} value={MACDFast} onChange={(value) => setMACDFast(typeof value === "number" ? value : parseInt(value))} min={0}
                        error={useMACD && (typeof MACDFast !== "number" || Number.isNaN(MACDFast))} />
                    <NumberInput disabled={!useMACD} className="selectItem" label="Slow Moving Avg" style={{color: "white"}} value={MACDSlow} onChange={(value) => setMACDSlow(typeof value === "number" ? value : parseInt(value))} min={0}
                        error={useMACD && (typeof MACDSlow !== "number" || Number.isNaN(MACDSlow))} />
                    <NumberInput disabled={!useMACD} className="selectItem" label="Signal Period" style={{color: "white"}} value={MACDSignal} onChange={(value) => setMACDSignal(typeof value === "number" ? value : parseInt(value))} min={0}
                        error={useMACD && (typeof MACDSignal !== "number" || Number.isNaN(MACDSignal))} />
                    <Select disabled={!useMACD} className="selectItem" label="Symbol" style={{color: "white"}}
                        data={[">=", "<="]} value={MACDSymbol} onChange={(value) => setMACDSymbol(value == null ? undefined : value as SupportedSignal)}
                        error={useMACD && MACDSymbol === undefined} />
                    <NumberInput disabled={!useMACD} className="selectItem" label="Value" style={{color: "white"}} min={0} value={MACDValue} onChange={(value) => setMACDValue(typeof value === "number" ? value : parseInt(value))}
                        error={useMACD && (typeof MACDValue !== "number" || Number.isNaN(MACDValue))} />
                </div>
                <div className="statHeader" style={{ paddingTop: "8px" }}>
                    <Button style={{ marginLeft: "10px" }} color="gray" size="xs" onClick={toggle}>{optionalOpened ? "Close" : "Optional Paramters"}</Button>
                </div>

                <Collapse in={optionalOpened}>
                    <div className="selectGroup">
                        <div className="optionalTitle" style={{ paddingRight: "52px" }}>Slope</div>
                        <Select className="selectItem" label="Symbol"  value={MACDSlope.symbol} onChange={(value) => saveMACDSlope("symbol", value == null ? undefined : value as SupportedSignal)}
                            data={[">=", "<="]}
                            disabled={!useMACD} />
                        <NumberInput className="selectItem" label="Value"  min={0}
                            value={MACDSlope.value} onChange={(value) => saveMACDSlope("value", typeof value === "number" ? value : parseInt(value))}
                            disabled={!useMACD} />
                    </div>
                    <div className="selectGroup">
                        <div className="optionalTitle" style={{ paddingRight: "50px" }}>Signal</div>
                        <Select className="selectItem" label="Symbol" value={MACDSignalOptional.symbol} onChange={(value) => saveMACDSignalOptional("symbol", value == null ? undefined : value as SupportedSignal)}
                            data={[">=", "<="]}
                            disabled={!useMACD} />
                        <NumberInput className="selectItem" label="Value" min={0}
                            value={MACDSignalOptional.value} onChange={(value) => saveMACDSignalOptional("value", typeof value === "number" ? value : parseInt(value))}
                            disabled={!useMACD} />
                    </div>
                    <div className="selectGroup">
                        <div className="optionalTitle" >Signal Slope</div>
                        <Select className="selectItem" label="Symbol"  value={MACDSignalSlope.symbol} onChange={(value) => saveMACDSignalSlope("symbol", value == null ? undefined : value as SupportedSignal)}
                            data={[">=", "<="]}
                            disabled={!useMACD} />
                        <NumberInput className="selectItem" label="Value"  min={0}
                            value={MACDSignalSlope.value} onChange={(value) => saveMACDSignalSlope("value", typeof value === "number" ? value : parseInt(value))}
                            disabled={!useMACD} />
                    </div>
                    <div className="selectGroup">
                        <div className="optionalTitle" style={{ paddingRight: "18px" }}>Signal Diff</div>
                        <Select className="selectItem" label="Symbol"  value={MACDSignalDiff.symbol} onChange={(value) => saveMACDSignalDiff("symbol", value == null ? undefined : value as SupportedSignal)}
                            data={[">=", "<="]}
                            disabled={!useMACD} />
                        <NumberInput className="selectItem" label="Value"  min={0}
                            value={MACDSignalDiff.value} onChange={(value) => saveMACDSignalDiff("value", typeof value === "number" ? value : parseInt(value))}
                            disabled={!useMACD} />
                    </div>
                </Collapse>
            </Collapse>
        </div>
    )
};
