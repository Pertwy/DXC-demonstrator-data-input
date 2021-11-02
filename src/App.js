import { useState } from 'react';
import './App.css';

function App() {

  const[counter, setCounter] = useState(0)
  const[loggedActions, setLoggedActions] = useState([])
  const[totalCount, setTotalCount] = useState(0)

  let count = 0
  let TheTotalCount = 0



  let machine = {
    name:"Test Machine",
    ExpectedRunning:true,
    LastStatusChange:"Date",
    StatusCode:0,
    StatusNote:"",
    TotalCount:0,
    IdealCycleTime:2,
    LastPartProduced:20,
}

let me = {
    MachineMaxRuntime_ms:78,
    emergencyStopRestartTime:20,
    probOptimumProduction:0.5,
    minResponseTime:10,
    emergencyStopRestartTime:10,
    minMaintenanceTime:10
}

function LogAction(ThingName, ActionType, ActionDetails, Probability){
    let newAction = {
        ThingName,
        ActionType,
        ActionDetails,
        Probability
    }
    console.log(newAction)
    // loggedActions.push(newAction)
    setLoggedActions(loggedActions => [...loggedActions, newAction ])
}


let statusChangeProb;   // This variable is used to represent the probability that the status of the machine will change on this itteration




function runMachine(){

    if (machine.ExpectedRunning) {
        switch(machine.StatusCode) {


          case -1: // NEVER USED  -> RUNNING
            machine.StatusCode = 0; 
            LogAction(machine.name, 'STATUS CHANGE','"NEVER USED" to "RUNNING"', 1 );
            break;


          case 0: // RUNNING
            statusChangeProb = 0.1
           
            if (Math.random() <= statusChangeProb) { // RUNNING -> STOPPED
                console.log('SIMULATION INFO: [' + machine.name + '] changed from RUNNING to STOPPED with probability: ' + statusChangeProb); 
                machine.StatusCode = 1;

                if (Math.random() <= 0.5) { 
                    machine.StatusNote = 'EMERGENCY STOP: Risk of safety';
                    // An emergency stop has a corresponding delay to represent the duration before the operator turns the machine back on.
                } else {
                    machine.StatusNote = 'BREAKDOWN: Fix required'; 
                }   
                LogAction(machine.name, 'STATUS CHANGE','"RUNNING" to "STOPPED" (' + machine.StatusNote + ')', statusChangeProb );

            } else {
                let newPartProb = 0.1
                let oldCount = machine.TotalCount;
                machine.TotalCount ++;
                TheTotalCount = TheTotalCount+1
                //setCounter(count)
                setTotalCount(TheTotalCount)
                let newCount = machine.TotalCount;
                console.log('PART PRODUCED [' + machine.name + ']: ' + (newCount - oldCount) + ' new part(s).')
                LogAction(machine.name, 'PART PRODUCED', newCount +' Parts Produced', newPartProb );
            }
            break;


          case 1: // STOPPED
            if (machine.StatusNote.split(':')[0] === 'EMERGENCY STOP') {
                    machine.StatusCode = 0;
                    LogAction(machine.name, 'STATUS CHANGE','"STOPPED" (' + machine.StatusNote + ') to "RUNNING"', 1 );

            } else if (machine.StatusNote.split(':')[0] === 'BREAKDOWN') {

                    if (Math.random() <= 0.5) {
                        machine.StatusCode = 2;
                        LogAction(machine.name, 'STATUS CHANGE','"STOPPED" (' + machine.StatusNote + ') to "MAINTENANCE"', 0.5 );
                    }

            } else {
                machine.StatusCode = 0;
                LogAction(machine.name, 'STATUS CHANGE','"STOPPED" (' + machine.StatusNote + ') to "RUNNING"', 1 );
            }
            break;


          case 2: // MAINTENANCE
                if (Math.random() <= 0.5) {
                    machine.StatusCode = 0;
                    LogAction(machine.name, 'STATUS CHANGE','"MAINTENANCE" to "RUNNING"', 0.5 );
                }
            break;


          case 3: // IDLE
            machine.StatusCode = 0;
            LogAction(machine.name, 'STATUS CHANGE','"IDLE" (' + machine.StatusNote + ') to "RUNNING"', 1 );
            break;

          default:
            break;
        }

    } else {
        if (!((machine.StatusCode === 3) && (machine.StatusNote === 'OUT OF PRODUCTION INTERVAL'))) {
            // TODO: This assumes machine is always IDLE when out of production schedule. Not necessarily the case in reality
            machine.StatusCode = 3;
            machine.StatusNote = 'OUT OF PRODUCTION INTERVAL';
            LogAction(machine.name, 'STATUS CHANGE',machine.StatusNote, 1 );
        }
    }
}




  function startTimer(){
    count = count+1
    setCounter(count)
    runMachine()
    setTimeout(startTimer, 1000)
  }


  return (
    <div className="App">
      <h1>Efficiency: {((totalCount/counter)*100).toFixed(2)}%</h1>
      <h1>Cycles: {counter}</h1>
      <h1>Parts Produced: {totalCount}</h1>
      <button onClick={()=>startTimer()}>Test</button>

      <table>
        <tr>
          <th>Thing name</th>
          <th>Action Type</th>
          <th>Action Details</th>
          <th>Probability</th>
        </tr>
        
        {loggedActions.slice(0).reverse().map((action) => {
          return(
            <tr>
              {console.log(action)}
              <td>{action.ThingName}</td>
              <td>{action.ActionType}</td>
              <td>{action.ActionDetails}</td>
              <td>{action.Probability}</td>
            </tr>
          )
        })}
        </table>

    </div>
  );
}

export default App;
