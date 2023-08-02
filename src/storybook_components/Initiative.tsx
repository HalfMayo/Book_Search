import { useState, SyntheticEvent, useReducer, Dispatch } from "react";
import foes from "../assets/fake dbs/foes";
import friends from "../assets/fake dbs/friends";
import Button from "./Button";

/*NEXT:
    [X] aggiungere una textarea per le condizioni (e uno stato relativo per salvarle e visualizzarle)
    - aggiungere un bottone per il turno successivo e un'area di testo per il conteggio dei turni
    - aggiungere un bottone per aggiungere nuovi nemici che si uniscono allo scontro
    - aggiungere un bottone per cambiare l'iniziativa di chi ritarda il turno
    - migliorare la grafica, soprattutto delle schede dei mostri e dell'inserimento iniziative
    [X] useReducer per nascondere la schermata iniziale di inserimento delle iniziative [!!]
*/

interface InitInfo {
    faction: string,
    name: string,
    initiative: string,
    conditions: string
}

interface StateProps {
    initiativeOrder: InitInfo[],
    isOpen: string | null,
    index: string,
    status: string
}

interface Add {
    type: "addFighter",
    payload: InitInfo
}
interface Submit {
    type: "submitOrder",
    payload: InitInfo
}
interface Open {
    type: "openInfo",
    payload: string
}

interface Condition {
    type: "addCondition",
    payload: InitInfo
}

type Actions = Add | Submit | Open | Condition;

const firstEl = {} as InitInfo;

const initialState : StateProps = {
    initiativeOrder: [firstEl],
    isOpen: null,
    index: "0",
    status: "input"
}

function reducer(state : StateProps, action : Actions) {
    switch(action.type) {
        case "addFighter":
            return {...state, initiativeOrder: [...state.initiativeOrder, action.payload]}
        case "submitOrder":
            const defInit = [...state.initiativeOrder, action.payload];
            defInit.shift();
            defInit.sort((a,b) => parseInt(b.initiative) - parseInt(a.initiative));
            return {...state, status: "ordered", initiativeOrder: defInit};
        case "openInfo":
            const newIndex = state.initiativeOrder.map(el => el.name).indexOf(action.payload).toString();
            return {...state, isOpen: action.payload === state.isOpen ? null : action.payload, index: newIndex};
        case "addCondition":
            const updatedConditions = [...state.initiativeOrder];
            updatedConditions.splice(parseInt(state.index), 1, action.payload)
            return {...state, initiativeOrder: updatedConditions}
        default:
            throw new Error("Wtf are you trying to do?")
    }
}

export default function Initiative() {

    const[{initiativeOrder, isOpen, index, status}, dispatch] = useReducer(reducer, initialState);

    return(
        <>
            {status === "input" &&
                <ul className="flex flex-col items-center justify-center gap-8 w-96">
                    {initiativeOrder.map((init:InitInfo, i:number) =>
                        <NewFighter key={init.name + i} initiativeOrder={initiativeOrder} dispatch={dispatch}/>
                    )}
                </ul>}

            {status === "ordered" &&
                <div className="flex flex-col gap-8 items-start justify-center relative w-fit min-w-[500px]">
                    <ul className="flex items-center justify-between gap-24 w-full">
                        <progress className="progress w-11/12 h-2 absolute top-[3.2rem] left-7 z-0" max={initiativeOrder.length - 1} value={index}></progress>
                        {initiativeOrder.map((init:InitInfo, i:number) =>
                            <li key={i} onClick={() => dispatch({type: "openInfo", payload: init.name})} className="flex flex-col items-center justify-center gap-4 cursor-pointer relative z-1">
                                <p>{init.name}</p>
                                <div className={`flex items-center justify-center text-center rounded-full w-8 h-8 ${index >= i.toString() ? "bg-primary-teal text-white" : "bg-disabled text-on-surface"}`}>{init.initiative}</div>
                                <textarea value={init.conditions} onChange={(e) => dispatch({type: "addCondition", payload:{faction: init.faction, name: init.name, initiative: init.initiative, conditions: e.target.value}})}></textarea>
                            </li>
                        )}
                    </ul>
                    <EnemyCard enemy={isOpen}/>
                </div>}
        </>
    )
}

interface FighterProps {
    dispatch: Dispatch<Actions>,
    initiativeOrder: InitInfo[]
}

type ErrorForm = "errorFighter" | "errorInitiative"

function NewFighter({dispatch, initiativeOrder} : FighterProps) {
    const [faction, setFaction] = useState<string>("");
    const [fighterName, setFighterName] = useState<string>("");
    const [initValue, setInitValue] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [incompleteForm, setIncompleteForm] = useState<ErrorForm|null>(null);

    function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        const eventSubmitter = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('value');

        function dispatchHandler(type: "addFighter" | "submitOrder") {
            const initNameFilter = initiativeOrder.filter((init:InitInfo) => init.name?.match(/\b[a-z]+\b/ig)?.join(" ") === fighterName).length
            const [enemyInfo] = foes.filter(foe => foe.name === fighterName);
            setIncompleteForm(null);
            setSubmitted(true);
            dispatch({type: type, payload:{faction: faction, name: faction === "friend" || enemyInfo.unique ? fighterName : fighterName + " " + (initNameFilter + 1), initiative: initValue, conditions: "-"}});

        }

        if(fighterName === "default" || fighterName === ""){
            setIncompleteForm("errorFighter");
            return;
        }

        if(initValue === ""){
            setIncompleteForm("errorInitiative");
            return;
        }

        if(faction === "friend" && initiativeOrder.filter((init:InitInfo) => init.name === fighterName).length > 0) {
            setIncompleteForm("errorFighter");
            return;
        }

        if(eventSubmitter === "Next") dispatchHandler("addFighter")
        else if (eventSubmitter === "Done") dispatchHandler("submitOrder")
    }

    return(
        <>
        <form className="flex gap-2 items-center w-full" onSubmit={handleSubmit}>
                <div className="flex gap-4 items-center">
                    <input type="radio" name="faction" id="friend" value="friend" onChange={(e) => setFaction(e.target.value)}/>
                    <label htmlFor="friend">Friend</label>
                </div>
                <div className="flex gap-2 items-center">
                    <input type="radio" name="faction" id="foe" value="foe" onChange={(e) => setFaction(e.target.value)}/>
                    <label htmlFor="foe">Foe</label>
                </div>
                {faction === "foe" ? <select className="w-32" onChange={(e) => setFighterName(e.target.value)}>
                    <option value="default">Choose a monster</option>
                    {foes.map(foe =>
                        <option key={foe.name} value={foe.name}>{foe.name}</option>)}
                </select>
                : faction === "friend"
                ? <select className="w-32" onChange={(e) => setFighterName(e.target.value)}>
                    <option value="default">Choose a member of the party</option>
                    {friends.map(friend =>
                        <option key={friend} value={friend}>{friend}</option>)}
                  </select>
                : <></>}
                <label htmlFor="initiative">Initiative</label>
                <input className="w-8" type="text" id="initiative" value={initValue} onChange={e => setInitValue(e.target.value)}/>
                {!submitted && <Button label="Next" type="submit"/>}
                {initiativeOrder.length > 1 && !submitted && <Button label="Done" type="submit"/>}
            </form>
            {incompleteForm === "errorFighter"
                ? <div className="bg-disabled"><p>Please select a fighter</p></div>
                : incompleteForm === "errorInitiative"
                    ? <div className="bg-disabled"><p>Please set an initiative</p></div>
                    : <></>}
            </>
    )
}

interface Enemy {
    enemy: string | null};

function EnemyCard({enemy} : Enemy) {

    if(enemy === null || foes.filter(foe => foe.name === enemy.match(/\b[a-z]+\b/ig)?.join(" ")).length < 1) return null;

    const [enemyInfo] = foes.filter(foe => foe.name === enemy.match(/\b[a-z]+\b/ig)?.join(" "));

    return(
        <div className="flex flex-col w-[500px]">
            <h1 className="bg-primary-teal text-white w-full p-1.5 font-semibold text-lg mb-1.5">{enemyInfo.name.toUpperCase()}</h1>
            <p>HP: {enemyInfo.hp}</p>
            <p>AC: {enemyInfo.ac}</p>
            <p>TS: {enemyInfo.ts}</p>
            <p>Perception: {enemyInfo.perception}</p>
            <div>Melee:
                <ul>
                    <li key={enemyInfo.attacks.melee?.[1]}>{enemyInfo.attacks.melee?.[1]}</li>
                    <li key={enemyInfo.attacks.melee?.[2]}>{enemyInfo.attacks.melee?.[2]}</li>
                </ul>
            </div>
            <div>Ranged:
                <ul>
                    <li key={enemyInfo.attacks.ranged?.[1]}>{enemyInfo.attacks.ranged?.[1]}</li>
                    <li key={enemyInfo.attacks.ranged?.[2]}>{enemyInfo.attacks.ranged?.[2]}</li>
                </ul>
            </div>
            <div>Special:
                <ul>
                    <li key={enemyInfo.attacks.special?.[1]}>{enemyInfo.attacks.special?.[1]}</li>
                    <li key={enemyInfo.attacks.special?.[2]}>{enemyInfo.attacks.special?.[2]}</li>
                </ul>
            </div>
            <p>Skills: {enemyInfo.skills}</p>
            <div>Feats:
                <ul>
                    <li key={enemyInfo.feats?.[1]}>{enemyInfo.feats?.[1]}</li>
                    <li key={enemyInfo.feats?.[2]}>{enemyInfo.feats?.[2]}</li>
                    <li key={enemyInfo.feats?.[3]}>{enemyInfo.feats?.[3]}</li>
                    <li key={enemyInfo.feats?.[4]}>{enemyInfo.feats?.[4]}</li>
                </ul>
            </div>
            <p>Speed: {enemyInfo.speed}</p>
            <p>Stats: {enemyInfo.stats}</p>
            <p>Languages: {enemyInfo.languages}</p>
            <p>Items: {enemyInfo.items}</p>
        </div>
    )
}