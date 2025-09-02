# CPU Scheduling Simulator

A web-based interactive tool built with **Vite + React + TailwindCSS** to visualize and analyze different CPU scheduling algorithms.

The simulator helps students and developers understand how various scheduling algorithms work by generating Gantt charts, scheduling tables, and performance metrics.

---

## ✨ Features

* 🔹 Supports multiple scheduling algorithms:

  * **First-Come, First-Served (FCFS)**
  * **Shortest Job First (Non-Preemptive)**
  * **Shortest Remaining Time First (Preemptive SJF)**
  * **Priority Scheduling (Preemptive & Non-Preemptive)**
  * **Round Robin**

* 🔹 Interactive process configuration

  * Add / remove processes dynamically
  * Set **Process ID, Arrival Time, Burst Time, and Priority (if needed)**

* 🔹 Visual Gantt Chart for execution timeline

* 🔹 Detailed results table including:

  * Completion Time
  * Turnaround Time
  * Waiting Time
  * Response Time

* 🔹 Performance metrics:

  * Average Waiting Time
  * Average Turnaround Time
  * Average Response Time
  * Total Execution Time

---

## 🛠️ Tech Stack

* **React 19 + Vite** – fast and modern frontend tooling
* **TailwindCSS** – utility-first styling
* **Radix UI** – accessible UI components
* **React Hook Form + Zod** – form handling & validation
* **TanStack Query** – state/data fetching
* **Recharts** – performance charts & visualizations
* **Lucide Icons** – modern icon set

(see `package.json` for full dependency list)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cpu-sched-playground.git
cd cpu-sched-playground
```

### 2. Install dependencies

Using **npm**:

```bash
npm install
```

Or with **bun** (if you prefer):

```bash
bun install
```

### 3. Run the development server

```bash
npm run dev
```

App will be available at: [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

---

## 📂 Project Structure

```
cpu-sched-playground/
│── public/               # Static assets
│── src/                  # Source code
│   ├── components/       # UI components (buttons, inputs, modals, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility/helper functions
│   ├── pages/            # Page-level components (Simulator, Home, etc.)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Core scheduling algorithms (FCFS, SJF, RR, Priority, etc.)
│   ├── App.tsx           # Root React component
│   ├── main.tsx          # React entry point
│   ├── App.css           # Global app styles
│   ├── index.css         # Tailwind base styles
│   └── vite-env.d.ts     # Vite TypeScript types
│── index.html
│── vite.config.ts
│── tailwind.config.ts
│── package.json
│── tsconfig.json
```

---

## 📊 Example Simulation

**Processes:**

* P1: Arrival=0, Burst=8
* P2: Arrival=1, Burst=4
* P3: Arrival=2, Burst=9
* P4: Arrival=3, Burst=5

**Selected Algorithm:** Shortest Job First (Non-Preemptive)

**Results:**

* Average Waiting Time: `7.75`
* Average Turnaround Time: `14.25`
* Average Response Time: `7.75`
* Total Execution Time: `26`

---

## 🤝 Contributing

Contributions are welcome!

* Fork the repository
* Create a feature branch
* Submit a PR 🎉

