# CPU Scheduling Simulator
A web app that simulates some CPU scheduling algorithms

## Project Setup
For this simulation, we'll be using React + Vite scaffolding with SWC (rust based)

Other dependencies include 
- TailwindCSS for styling
- Chart js 
- JSpdf to generate downloadable results in pdf format
- Github pages for SPA deployment 

# Feature #1

Generate a basic set of processes with a control component to determine number of processes and time quantum for round robin

Processes also have color indicators to differentiate them
![alt text](image.png)


Sort through processes by arrival time and clear processes when done
![alt text](image-1.png)


## Feature 2

Multi-select tool for running varius algorithms

You can select from a list of algorithms or have the option to select all and run them based on the generated processes

![alt text](image-3.png)

Running all algorithms

Click on "Generate processes" to generate a number of processes and then click "Run all algorithms" 

We are met with a display of bar charts and gantt charts outlining and comparing performance across each of the algorithms

![alt text](image-4.png)



## Feature 3 - Downloading and Saving Results
Finally, we can save our results to a pdf for either single algorithm instances or after running all algorithms

Comparison PDF
![alt text](image-5.png)


Single algorithm metric pdf (FIFO example)
![alt text](image-6.png)