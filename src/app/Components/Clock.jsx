"use client"
/* Test does not pass, can't figure it out, all works fine, maybe some compatibility issues: 14. When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of "timer-label" should display a string indicating a session has begun. */
import { useState, useEffect } from "react"

function Clock() {
  const [state, setState] = useState({
    break: 5,
    session: 25,
    timePassed: 0,
    timeLeft: 25 * 60,
    isRunning: false,
    isSession: true,
    shouldReset: false,
  })

  const [intervalId, setIntervalId] = useState(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleBreakIncrement = () => {
   if (state.break < 60 && !state.isRunning) {
    setState((prev) => ({
      ...prev,
      break: prev.break + 1
    }))
   }
  }

  const handleBreakDecrement = () => {
    if (state.break >1 && !state.isRunning) {
     setState((prev) => ({
       ...prev,
       break: prev.break - 1
     }))
    }
   }

  const handleSessionIncrement = () => {
    if (state.session < 60 && !state.isRunning) {
      setState((prev) => ({
        ...prev,
        session: prev.session + 1,
        timeLeft: (prev.session + 1) * 60
      }))
    }
  }

  const handleSessionDecrement = () => {
    if (state.session > 1 && !state.isRunning) {
      setState((prev) => ({
        ...prev,
        session: prev.session - 1,
        timeLeft: (prev.session - 1) * 60
      }))
    }
  }

  const handleReset = () => {
    if (intervalId) {
      clearInterval(intervalId),
      setIntervalId(null)
    }
    setState({
      break: 5,
      session: 25,
      timePassed: 0,
      timeLeft: 25 * 60,
      isRunning: false,
      isSession: true,
      shouldReset: true,
    })

    const audio = document.getElementById("beep")
    if (audio) {
      audio.pause(),
      audio.currentTime = 0
    }
  }

  const handleStartStop = () => {
    if (!state.isRunning) {
      setState(prev => ({ ...prev, isRunning: true }));
      const id = setInterval(() => {
        setState((prev) => {
          const newTimeLeft = prev.timeLeft - 1;
  
          if (newTimeLeft === 0) {
            document.getElementById("beep")?.play();
          }
  
          if (newTimeLeft < 0) {
            const nextIsSession = !prev.isSession;
            const nextDuration = nextIsSession ? prev.session : prev.break;
            return {
              ...prev,
              isSession: nextIsSession,
              timeLeft: nextDuration * 60,
            };
          }

          return {
            ...prev,
            timeLeft: Math.max(newTimeLeft, 0),
          };
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

    return (
        <div id="clock-div">
          <h1 id="header">25 + 5 Clock</h1>
          <div id="counter-div">
          <p id="break-label">Break Length</p>
          <p id="session-label">Session Length</p>
          <div id="break-count">
            <button id="break-increment"
            onClick={handleBreakIncrement}
            >
             <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
            </button>
            <h3 id="break-length">{state.break}</h3>
            <button id="break-decrement"
            onClick={handleBreakDecrement}
            >
             <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
            </button>
          </div>
          <div id="session-count">
            <button id="session-increment"
            onClick={handleSessionIncrement}
            >
              <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
              </button>
            <h3 id="session-length">{state.session}</h3>
            <button id="session-decrement"
            onClick={handleSessionDecrement}
            >
              <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
              </button>
          </div>
          </div>
          <div id="timer-div">
            <p id="timer-label">{state.isSession ? "Session" : "Break"}</p>
            <p id="time-left">{formatTime(state.timeLeft)}</p>
          </div>
          <div id="buttons-div">
            <button id="start_stop"
            onClick={handleStartStop}
            className={`button-with-icon ${state.isRunning ? 'pause-button' : 'play-button'}`}
            >
              {state.isRunning ? 
<button class="pause-btn">
  <svg class="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#ff2849" stroke-linecap="round" stroke-width="2"><rect height="14" rx="1.5" width="3" x="15" y="5"></rect><rect height="14" rx="1.5" width="3" x="6" y="5"></rect></g></svg>
</button> 
              :
              <svg
      width="53"
      height="58"
      viewBox="0 0 53 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44.25 36.3612L17.25 51.9497C11.5833 55.2213 4.5 51.1318 4.50001 44.5885L4.50001 13.4115C4.50001 6.86824 11.5833 2.77868 17.25 6.05033L44.25 21.6388C49.9167 24.9104 49.9167 33.0896 44.25 36.3612Z"
        stroke="currentColor"
        stroke-width="9"
      ></path></svg>}
              </button>
              <br></br>
            <button id="reset"
            onClick={handleReset}
            className="reset-btn"
            >
              Reset
              </button>
          </div>
          <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
        </div>
    )
}

export default Clock;