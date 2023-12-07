import { Button, Checkbox, Collapse, NumberInput, Select } from "@mantine/core";
import "./InputSelector.css";
import { useState } from "react";
import { SupportedSignal } from "../utils/App.type";

type RSISelectorProps = {
    useRSI: boolean,
    setRSI: React.Dispatch<React.SetStateAction<boolean>>,
    RSIDays: number | undefined,
    setRSIDays: React.Dispatch<React.SetStateAction<number | undefined>>,
    RSISymbol: string | undefined,
    setRSISymbol: React.Dispatch<React.SetStateAction<SupportedSignal | undefined>>,
    RSIValue: number | undefined,
    setRSIValue: React.Dispatch<React.SetStateAction<number | undefined>>,
};

export function RSISelector({ useRSI, setRSI, RSIDays, setRSIDays, RSISymbol, setRSISymbol, RSIValue, setRSIValue }: RSISelectorProps) {

    const [opened, setOpened] = useState<boolean>(true);

    const toggleUseRSI = () => {
        setRSI(!useRSI);
        if (!useRSI) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }


    return (
        <div className="statGroup">
            <div className="statHeader" >
                <div className="statTitle">RSI</div>
                <Checkbox
                    checked={useRSI}
                    label="Use RSI"
                    onChange={() => toggleUseRSI()}
                />
                <Button style={{ marginLeft: "10px" }} size="xs" onClick={() => setOpened(!opened)}>{opened ? "Close" : "Show Details"}</Button>
            </div>
            <Collapse in={opened}>
                <div className="selectGroup">
                    <NumberInput className="selectItem" label="# of Days"
                        min={0}
                        value={RSIDays} onChange={(value) => setRSIDays(typeof value === "number" ? value : parseInt(value))}
                        disabled={!useRSI} error={useRSI && (typeof RSIDays !== "number" || Number.isNaN(RSIDays))} />
                    <Select className="selectItem" label="Symbol" value={RSISymbol} onChange={(value) => setRSISymbol(value == null ? undefined : value as SupportedSignal)}
                        data={[">", "<", ">=", "<="]}
                        disabled={!useRSI} error={useRSI && RSISymbol === undefined} />
                    <NumberInput className="selectItem" label="Value" prefix="$" min={0}
                        value={RSIValue} onChange={(value) => setRSIValue(typeof value === "number" ? value : parseInt(value))}
                        disabled={!useRSI} error={useRSI && (typeof RSIValue !== "number" || Number.isNaN(RSIValue))} />
                </div>
            </Collapse>
        </div>
    )
};
