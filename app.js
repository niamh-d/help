import { useReducer, useEffect } from "react";

import Main from "./Main";
import ToDos from "./ToDos";
import Form from "./Form";
import Header from "./Header";
import Left from "./Left";
import Center from "./Center";

/*
Time To Complete: Repeated, Today, This Week, This Month, Later 
Importance ratings: High, Medium, Low

*/

// starter data for demo purposes

const demoToDosArr = [
  {
    title: "Start Portfolio Project",
    importanceRating: "High",
    timeToComplete: "This Week",
    label: "programming",
    writeUp: "Practice building my own app.",
    id: "TD0001",
  },
  {
    title: "Clean the sitting room",
    importanceRating: "Medium",
    timeToComplete: "Today",
    label: "home",
    writeUp: "",
    id: "TD0002",
  },
  {
    title: "Go for a run",
    importanceRating: "Medium",
    timeToComplete: "This week",
    label: "exercise",
    writeUp: "",
    id: "TD0003",
  },
  {
    title: "Write 2 pages of story",
    importanceRating: "Low",
    urgencyRating: "Continous",
    label: "story",
    writeUp: "",
    id: "TD0004",
  },
];

const demoLabelsArr = ["exercise", "home", "story", "programming"];

// initial state

let initialState = {
  toDos: demoToDosArr,
  tags: {
    labels: demoLabelsArr,
    importanceRatings: ["high", "medium", "low"],
    timesToComplete: ["Repeated", "Today", "This Week", "This Month", "Later"],
  },
  showAddNewToDo: false,
};

function App() {

  // runs on first render only
  useEffect(function () {
    // checking whether data exists in local storage for labels array; if exists, logic is meant to update initial state, but isn't; logic is returning local storage data but state is notbeing affected
    const labels = pullFromLocalStorage("labels");
    if (labels)
      initialState = {
        ...initialState,
        tags: { ...initialState.tags, labels: labels },
      };
    
 // checking whether data exists in local storage for toDos object; if exists, logic is meant to update initial state, but isn't; logic is returning local storage data but state is notbeing affected
    const toDos = pullFromLocalStorage("toDos");
    if (toDos)
      initialState = {
        ...initialState,
        tags: { ...initialState.tags, labels: labels },
      };
  }, []);

  const [{ toDos, showAddNewToDo, tags }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function reducer(state, action) {
    switch (action.type) {
      case "ADD_NEW_TODO":
        const labelDecisionOutcome = state.tags.labels.includes(
          action.val.label
        )
          ? state.tags.labels
          : [...state.tags.labels, action.val.label];

        if (!state.tags.labels.includes(action.val.label))
          updateLocalStorage(
            "labels",
            JSON.stringify([...state.tags.labels, action.val.label])
          );

        updateLocalStorage(
          "toDos",
          JSON.stringify([...state.toDos, action.val])
        );

        return {
          ...state,
          toDos: [...state.toDos, action.val],
          tags: {
            ...state.tags,
            labels: labelDecisionOutcome,
          },
          showAddNewToDo: false,
        };
      case "SHOW_ADD":
        return {
          ...state,
          showAddNewToDo: true,
        };
      case "CLOSE_ADD":
        return {
          ...state,
          showAddNewToDo: false,
        };

      default:
        throw new Error("Invalid dispatch.");
    }
  }

  function pullFromLocalStorage(storageItemKey) {
    const localStorageData = localStorage.getItem(storageItemKey);
    return JSON.parse(localStorageData);
  }

  function updateLocalStorage(storageItemKey, data) {
    localStorage.setItem(storageItemKey, data);
  }

  return (
    <div className="app">
      <Header />
      <Main>
        <Left
          showAddNewToDo={showAddNewToDo}
          dispatch={dispatch}
          tags={tags}
        ></Left>
        <Center>
          {!showAddNewToDo && <ToDos toDos={toDos} />}
          {showAddNewToDo && <Form dispatch={dispatch} />}
        </Center>
      </Main>
    </div>
  );
}

export default App;
