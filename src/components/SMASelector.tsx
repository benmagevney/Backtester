import { Button, Checkbox, Collapse, NumberInput, Select } from "@mantine/core";
import "./InputSelector.css";
import { useState } from "react";
import { SupportedSignal } from "../utils/App.type";

type SMASelectorProps = {
    useSMA: boolean,
    setSMA: React.Dispatch<React.SetStateAction<boolean>>,
    SMADays: number | undefined,
    setSMADays: React.Dispatch<React.SetStateAction<number | undefined>>,
    SMASymbol: string | undefined,
    setSMASymbol: React.Dispatch<React.SetStateAction<SupportedSignal | undefined>>,
    SMAValue: number | undefined,
    setSMAValue: React.Dispatch<React.SetStateAction<number | undefined>>,
};

export function SMASelector({ useSMA, setSMA, SMADays, setSMADays, SMASymbol, setSMASymbol, SMAValue, setSMAValue }: SMASelectorProps) {

    const [opened, setOpened] = useState<boolean>(true);

    const toggleUseSMA = () => {
        setSMA(!useSMA);
        if (!useSMA) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }


    return (
        <div className="statGroup">
            <div className="statHeader" >
                <div className="statTitle">SMA</div>
                <Checkbox
                    checked={useSMA}
                    label="Use SMA"
                    onChange={() => toggleUseSMA()}
                />
                <Button style={{ marginLeft: "10px" }} size="xs" onClick={() => setOpened(!opened)}>{opened ? "Close" : "Show Details"}</Button>
            </div>
            <Collapse in={opened}>
                <div className="selectGroup">
                    <NumberInput className="selectItem" label="# of Days" min={0}
                        value={SMADays} onChange={(value) => setSMADays(typeof value === "number" ? value : parseInt(value))}
                        disabled={!useSMA} error={useSMA && (typeof SMADays !== "number" || Number.isNaN(SMADays))} />
                    <Select className="selectItem" label="Symbol" value={SMASymbol} onChange={(value) => setSMASymbol(value == null ? undefined : value as SupportedSignal)}
                        data={[">", "<", ">=", "<="]}
                        disabled={!useSMA} error={useSMA && SMASymbol === undefined} />
                    <NumberInput className="selectItem" label="Value" prefix="$" min={0}
                        value={SMAValue} onChange={(value) => setSMAValue(typeof value === "number" ? value : parseInt(value))}
                        disabled={!useSMA} error={useSMA && (typeof SMAValue !== "number" || Number.isNaN(SMAValue))} />
                </div>
            </Collapse>
        </div>
    )
};
