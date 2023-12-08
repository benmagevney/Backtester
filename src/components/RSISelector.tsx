import { Button, Checkbox, Collapse, NumberInput, Select } from "@mantine/core";
import "./InputSelector.css";
import { useState } from "react";
import { SupportedSignal, SymbolValueObject } from "../utils/App.type";
import { useDisclosure } from "@mantine/hooks";

type RSISelectorProps = {
    useRSI: boolean,
    setRSI: React.Dispatch<React.SetStateAction<boolean>>,
    RSIDays: number | undefined,
    setRSIDays: React.Dispatch<React.SetStateAction<number | undefined>>,
    RSISymbol: string | undefined,
    setRSISymbol: React.Dispatch<React.SetStateAction<SupportedSignal | undefined>>,
    RSIValue: number | undefined,
    setRSIValue: React.Dispatch<React.SetStateAction<number | undefined>>,
    RSISlope: SymbolValueObject,
    setRSISlope: React.Dispatch<React.SetStateAction<SymbolValueObject>>,
};

export function RSISelector({ useRSI, setRSI, RSIDays, setRSIDays, RSISymbol, setRSISymbol, RSIValue, setRSIValue, RSISlope, setRSISlope }: RSISelectorProps) {

    const [opened, setOpened] = useState<boolean>(false);

    const [optionalOpened, { toggle }] = useDisclosure(false);

    const toggleUseRSI = () => {
        setRSI(!useRSI);
        if (!useRSI) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    };

    const saveOptionalSlope = (fieldName: string, value: number | string | undefined) => {
        setRSISlope((RSISlope) => ({
            ...RSISlope,
            [fieldName]: value,
        }));
    };


    return (
        <div className="statGroup">
            <div className="statHeader" >
                <div className="statTitle">RSI</div>
                <Checkbox
                    style={{ paddingTop: "8px" }}
                    checked={useRSI}
                    onChange={() => toggleUseRSI()}
                />
            </div>
            <Collapse in={opened}>
                <div className="selectGroup">
                    <NumberInput className="selectItem" label="# of Days" 
                        min={0}
                        value={RSIDays} onChange={(value) => setRSIDays(typeof value === "number" ? value : parseInt(value))}
                        disabled={!useRSI} error={useRSI && (typeof RSIDays !== "number" || Number.isNaN(RSIDays))} />
                    <Select className="selectItem" label="Symbol"  value={RSISymbol} onChange={(value) => setRSISymbol(value == null ? undefined : value as SupportedSignal)}
                        data={[">=", "<="]}
                        disabled={!useRSI} error={useRSI && RSISymbol === undefined} />
                    <NumberInput className="selectItem" label="Value" min={0}
                        value={RSIValue} onChange={(value) => setRSIValue(typeof value === "number" ? value : parseInt(value))}
                        disabled={!useRSI} error={useRSI && (typeof RSIValue !== "number" || Number.isNaN(RSIValue))} />
                </div>
                <div className="statHeader" style={{ paddingTop: "8px" }}>
                    <Button style={{ marginLeft: "10px" }} color="gray" size="xs" onClick={toggle}>{optionalOpened ? "Close" : "Optional Paramters"}</Button>
                </div>

                <Collapse in={optionalOpened}>
                    <div className="selectGroup">
                        <div className="optionalTitle">Slope</div>
                        <Select className="selectItem" label="Symbol" value={RSISlope.symbol} onChange={(value) => saveOptionalSlope("symbol", value == null ? undefined : value as SupportedSignal)}
                            data={[">=", "<="]}
                            disabled={!useRSI} />
                        <NumberInput className="selectItem" label="Value" min={0}
                            value={RSISlope.value} onChange={(value) => saveOptionalSlope("value", typeof value === "number" ? value : parseInt(value))}
                            disabled={!useRSI} />
                    </div>
                </Collapse>
            </Collapse>
        </div>
    )
};
