import React, { useState } from 'react';

const ControlPanel: React.FC = () => {
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [algorithm, setAlgorithm] = useState('default');
    const [attackTriggered, setAttackTriggered] = useState(false);

    const startSimulation = () => {
        setSimulationRunning(true);
        // Additional logic to start the simulation can be added here
    };

    const stopSimulation = () => {
        setSimulationRunning(false);
        // Additional logic to stop the simulation can be added here
    };

    const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpeed(Number(event.target.value));
    };

    const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgorithm(event.target.value);
    };

    const triggerAttack = () => {
        setAttackTriggered(true);
        // Logic to handle attack triggers can be added here
    };

    return (
        <div>
            <h1>Simulation Control Panel</h1>
            <button onClick={simulationRunning ? stopSimulation : startSimulation}>
                {simulationRunning ? 'Stop' : 'Start'} Simulation
            </button>

            <div>
                <label>Speed Adjustment:</label>
                <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={speed} 
                    onChange={handleSpeedChange} 
                />
            </div>

            <div>
                <label>Algorithm Selection:</label>
                <select value={algorithm} onChange={handleAlgorithmChange}>
                    <option value="default">Default</option>
                    <option value="algorithm1">Algorithm 1</option>
                    <option value="algorithm2">Algorithm 2</option>
                </select>
            </div>

            <button onClick={triggerAttack}>Trigger Attack</button>
        </div>
    );
};

export default ControlPanel;